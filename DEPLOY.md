# GhumoNE Backend — VPS Deployment Guide

Deploy NestJS API to your VPS with **Nginx**, **PM2**, and **GitHub Actions**.

## Architecture

```text
GitHub (push main) → GitHub Actions → SSH → VPS
                                         ├── git pull
                                         ├── npm ci + prisma migrate + build
                                         └── pm2 restart ghumone-api
Vercel frontend → Nginx (api.ghumone.com) → localhost:3004 → PostgreSQL
```

---

## SSH keys — reuse across projects (recommended)

You do **NOT** need a new SSH key for every project.

Use **one deploy key pair** for all GitHub Actions → VPS deployments:

| Key | Where it lives |
|-----|----------------|
| **Private key** | GitHub repo secret: `SSH_PRIVATE_KEY` (same value in every repo) |
| **Public key** | VPS: `~/.ssh/authorized_keys` for your deploy user (add once) |

Each project only differs by:
- GitHub repo
- App directory (`/var/www/ghumone-api`)
- PM2 name (`ghumone-api`)
- Port (`3004`)
- Nginx domain (`api.ghumone.com`)
- `.env` on the server

### If you already deploy other NestJS apps

Reuse the same `SSH_PRIVATE_KEY`, `VPS_HOST`, and `VPS_USER` secrets. Only add repo-specific secrets if needed (e.g. `GHUMONE_APP_DIR`).

### If setting up keys for the first time

**On Windows (PowerShell):**

```powershell
ssh-keygen -t ed25519 -C "github-actions-deploy" -f $env:USERPROFILE\.ssh\github_actions_deploy
```

- **Private key** → paste into GitHub secret `SSH_PRIVATE_KEY` (full file including `-----BEGIN...`)
- **Public key** → add to VPS:

```bash
# On VPS, as root or deploy user
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

---

## 1. One-time VPS setup

SSH into your VPS (`94.136.191.2`).

### Install Node.js 20+ (if missing)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v && npm -v
```

### Install PM2

```bash
sudo npm install -g pm2
pm2 startup
# Run the command it prints, then:
pm2 save
```

### Create app directory and clone repo

```bash
sudo mkdir -p /var/www/ghumone-api
sudo chown -R $USER:$USER /var/www/ghumone-api
cd /var/www/ghumone-api
git clone https://github.com/alterera/ghumo-ne-api.git .
# Or your actual backend repo URL
```

### Create production `.env` on VPS (never commit this)

```bash
nano /var/www/ghumone-api/.env
```

```env
DATABASE_URL="postgresql://ghumone:YOUR_PASSWORD@localhost:5432/ghumone?schema=public"
JWT_SECRET="long-random-production-secret"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="https://ghumo-ne.vercel.app,https://ghumone.com"
PORT=3004
UPLOAD_DIR="/var/www/ghumone-api/uploads"
PUBLIC_API_URL="https://api.ghumone.com"
ADMIN_EMAIL="admin@ghumone.com"
ADMIN_PASSWORD="strong-admin-password"
```

```bash
mkdir -p /var/www/ghumone-api/uploads
```

### First manual deploy

```bash
cd /var/www/ghumone-api
npm ci
npx prisma migrate deploy
npm run db:seed    # first time only
npm run build
pm2 start ecosystem.config.cjs
pm2 save
```

### Nginx

```bash
sudo cp /var/www/ghumone-api/nginx/ghumone-api.conf.example /etc/nginx/sites-available/ghumone-api
sudo ln -s /etc/nginx/sites-available/ghumone-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d api.ghumone.com
```

### Verify

```bash
curl http://localhost:3004/api/v1/home
curl https://api.ghumone.com/api/v1/home
```

---

## 2. GitHub repository setup

Create a repo for the backend (e.g. `alterera/ghumo-ne-api`) and push the `backend/` folder as the repo root.

### GitHub Secrets (Settings → Secrets and variables → Actions)

| Secret | Required | Reuse? | Example |
|--------|----------|--------|---------|
| `SSH_PRIVATE_KEY` | Yes | **Yes — same across all projects** | Contents of `github_actions_deploy` private key |
| `VPS_HOST` | Yes | **Yes** | `94.136.191.2` |
| `VPS_USER` | Yes | **Yes** | `root` or `deploy` |
| `VPS_PORT` | No | Yes | `22` (default) |
| `GHUMONE_APP_DIR` | No | No | `/var/www/ghumone-api` (default in workflow) |

No secrets needed on your Windows machine for deploy — only GitHub Actions uses them.

---

## 3. Auto-deploy workflow

Workflow file: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

Node version is pinned in [`.nvmrc`](.nvmrc) (currently **24**).

Triggers on every push to `main`:

**Job 1 — verify-build (GitHub runner):** `npm ci` → `prisma generate` → `npm run build`

**Job 2 — deploy (VPS over SSH):** `nvm use 24` → `git pull` → `npm ci --include=dev` → `prisma migrate deploy` → `npm run build` → `pm2 restart`

---

## 4. Local Windows machine

Nothing extra required for auto-deploy. For local development:

| File | Purpose |
|------|---------|
| `backend/.env` | Local dev — use SSH tunnel to VPS DB (`localhost:5433`) |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1` |

Optional: add VPS SSH config in `~/.ssh/config`:

```ssh-config
Host ghumone-vps
  HostName 94.136.191.2
  User root
  LocalForward 5433 localhost:5432
```

Then: `ssh ghumone-vps` for DB tunnel while developing.

---

## 5. Vercel (frontend)

In Vercel project settings:

```env
NEXT_PUBLIC_API_URL=https://api.ghumone.com/api/v1
```

Ensure `CORS_ORIGIN` on the backend includes your Vercel URL.

---

## 6. Port reference (your VPS)

| App | Suggested port |
|-----|----------------|
| Existing backend 1 | 3001 |
| Existing backend 2 | 3002 |
| Existing backend 3 | 3003 |
| **GhumoNE API** | **3004** |

Update `nginx/ghumone-api.conf.example` if you use a different port.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Permission denied (publickey)` | Public key not in VPS `authorized_keys`, or wrong `SSH_PRIVATE_KEY` in GitHub |
| `Repository not cloned yet` | Run `git clone` on VPS into `/var/www/ghumone-api` |
| `P1001` database error on deploy | Check `DATABASE_URL` in VPS `.env` uses `localhost:5432` |
| CORS errors from Vercel | Add Vercel URL to `CORS_ORIGIN` (comma-separated) |
| Upload images show localhost URL | Set `PUBLIC_API_URL=https://api.ghumone.com` on VPS |
| Migration failed | SSH to VPS, run `npx prisma migrate deploy` manually and check logs |
| `nest build` fails in GitHub Action with no error | Check the **verify-build** job log first; ensure `.nvmrc` exists; ensure `npm ci --include=dev` runs on VPS |
| `nest build` fails on VPS only | Run `cat /tmp/ghumone-build.log` on VPS; check `free -h` for OOM; ensure Node 24 via `nvm use 24` |
| `nvm use` fails | Run `nvm install 24 && nvm use 24` on VPS; `.nvmrc` must be committed to repo |
| `npm warn config production` during deploy | Run `npm config delete production` on VPS; deploy uses `npm ci --include=dev --ignore-scripts` |
| `invalid config omit=""` in `.npmrc` | Remove `.npmrc` from repo — use `npm ci --include=dev` in deploy script instead |
| Fails at `prisma generate` in postinstall | Deploy uses `--ignore-scripts` then runs `prisma generate` explicitly; check `/tmp/ghumone-prisma.log` on VPS |
| `.env file missing` | Create `/var/www/ghumone-api/.env` on VPS before first deploy |

```bash
pm2 logs ghumone-api
pm2 status
```
