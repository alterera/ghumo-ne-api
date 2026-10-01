import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  constructor(private config: ConfigService) {}

  async saveFile(file: { buffer: Buffer; originalname: string }) {
    const uploadDir = this.config.get<string>('UPLOAD_DIR', './uploads');
    await mkdir(uploadDir, { recursive: true });

    const ext = file.originalname.split('.').pop() ?? 'jpg';
    const filename = `${randomUUID()}.${ext}`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, file.buffer);

    const baseUrl =
      this.config.get<string>('PUBLIC_API_URL') ??
      `http://localhost:${this.config.get<string>('PORT', '3001')}`;
    const url = `${baseUrl.replace(/\/$/, '')}/uploads/${filename}`;

    return { url, filename };
  }
}
