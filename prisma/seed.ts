import { PrismaClient, BannerType, BlogStatus, TripStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const PLACEHOLDER = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80';

async function main() {
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? 'admin123',
    10,
  );

  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? 'admin@ghumone.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL ?? 'admin@ghumone.com',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });

  await prisma.siteSetting.deleteMany();
  await prisma.siteSetting.create({
    data: {
      phone: '+91 98765 43210',
      phone2: '+91 98765 43211',
      email: 'support@ghumone.com',
      instagramUrl: 'https://instagram.com/ghumone',
    },
  });

  await prisma.navItem.deleteMany({ where: { parentId: { not: null } } });
  await prisma.navItem.deleteMany();
  const navParents = await Promise.all([
    prisma.navItem.create({ data: { label: 'Oct-Nov', href: '/categories/oct-nov', order: 1 } }),
    prisma.navItem.create({ data: { label: 'Stranger Trips', href: '/categories/stranger-trips', order: 2 } }),
    prisma.navItem.create({ data: { label: 'Winter Trips', href: '/categories/winter-trips', order: 3 } }),
    prisma.navItem.create({ data: { label: 'Summer Trips', href: '/categories/summer-trips', order: 4 } }),
  ]);

  await prisma.navItem.createMany({
    data: [
      { label: 'Meghalaya', href: '/categories/oct-nov/meghalaya', parentId: navParents[0].id, order: 1 },
      { label: 'Arunachal', href: '/categories/oct-nov/arunachal', parentId: navParents[0].id, order: 2 },
      { label: 'Blog', href: '/blog', order: 5 },
      { label: 'Contact Us', href: '/contact', order: 6 },
    ],
  });

  await prisma.category.deleteMany();
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Stranger Trips', slug: 'stranger-trips', imageUrl: PLACEHOLDER, description: 'Meet new people on curated group adventures', order: 1 },
    }),
    prisma.category.create({
      data: { name: 'Winter Trips', slug: 'winter-trips', imageUrl: PLACEHOLDER, description: 'Snow-capped peaks and cozy valleys', order: 2 },
    }),
    prisma.category.create({
      data: { name: 'Summer Trips', slug: 'summer-trips', imageUrl: PLACEHOLDER, description: 'Lush green landscapes and waterfalls', order: 3 },
    }),
    prisma.category.create({
      data: { name: 'Oct-Nov', slug: 'oct-nov', imageUrl: PLACEHOLDER, description: 'Best season to explore Northeast', order: 4 },
    }),
  ]);

  await prisma.trip.deleteMany();
  const trips = [
    {
      title: 'Meghalaya Living Root Bridges',
      slug: 'meghalaya-living-root-bridges',
      location: 'Meghalaya',
      duration: '5 Days / 4 Nights',
      startDate: new Date('2026-11-01'),
      endDate: new Date('2026-11-05'),
      maxPeople: 15,
      price: 12999,
      images: [PLACEHOLDER],
      description: 'Explore the magical living root bridges of Meghalaya with fellow travelers.',
      categoryId: categories[0].id,
      isFeatured: true,
      status: TripStatus.PUBLISHED,
    },
    {
      title: 'Tawang Winter Expedition',
      slug: 'tawang-winter-expedition',
      location: 'Arunachal Pradesh',
      duration: '7 Days / 6 Nights',
      startDate: new Date('2026-12-15'),
      endDate: new Date('2026-12-21'),
      maxPeople: 12,
      price: 18999,
      images: [PLACEHOLDER],
      description: 'Experience snow-covered monasteries and breathtaking Himalayan views.',
      categoryId: categories[1].id,
      isFeatured: true,
      status: TripStatus.PUBLISHED,
    },
    {
      title: 'Kaziranga Wildlife Safari',
      slug: 'kaziranga-wildlife-safari',
      location: 'Assam',
      duration: '4 Days / 3 Nights',
      startDate: new Date('2026-04-10'),
      endDate: new Date('2026-04-13'),
      maxPeople: 20,
      price: 9999,
      images: [PLACEHOLDER],
      description: 'Spot the one-horned rhino and diverse wildlife in Kaziranga National Park.',
      categoryId: categories[2].id,
      isFeatured: true,
      status: TripStatus.PUBLISHED,
    },
    {
      title: 'Dzukou Valley Trek',
      slug: 'dzukou-valley-trek',
      location: 'Nagaland',
      duration: '3 Days / 2 Nights',
      startDate: new Date('2026-10-20'),
      endDate: new Date('2026-10-22'),
      maxPeople: 18,
      price: 7999,
      images: [PLACEHOLDER],
      description: 'Trek through the stunning valley of flowers in Nagaland.',
      categoryId: categories[3].id,
      isFeatured: true,
      status: TripStatus.PUBLISHED,
    },
  ];
  await prisma.trip.createMany({ data: trips });

  await prisma.location.deleteMany();
  await prisma.location.createMany({
    data: [
      { name: 'Shillong', slug: 'shillong', imageUrl: PLACEHOLDER, description: 'Scotland of the East', order: 1 },
      { name: 'Gangtok', slug: 'gangtok', imageUrl: PLACEHOLDER, description: 'Gateway to Sikkim', order: 2 },
      { name: 'Tawang', slug: 'tawang', imageUrl: PLACEHOLDER, description: 'Land of Monasteries', order: 3 },
      { name: 'Kaziranga', slug: 'kaziranga', imageUrl: PLACEHOLDER, description: 'Wildlife Paradise', order: 4 },
    ],
  });

  await prisma.banner.deleteMany();
  await prisma.banner.createMany({
    data: [
      { type: BannerType.HERO, imageUrl: PLACEHOLDER, linkUrl: '/trips/meghalaya-living-root-bridges', title: 'Discover Meghalaya', order: 1 },
      { type: BannerType.HERO, imageUrl: PLACEHOLDER, linkUrl: '/trips/tawang-winter-expedition', title: 'Winter in Tawang', order: 2 },
      { type: BannerType.HERO, imageUrl: PLACEHOLDER, linkUrl: '/categories/stranger-trips', title: 'Stranger Trips', order: 3 },
      { type: BannerType.OFFER, imageUrl: PLACEHOLDER, linkUrl: '/trips/kaziranga-wildlife-safari', title: 'Early Bird 20% Off', order: 1 },
      { type: BannerType.OFFER, imageUrl: PLACEHOLDER, linkUrl: '/contact', title: 'Group Booking Discount', order: 2 },
    ],
  });

  await prisma.feature.deleteMany();
  await prisma.feature.createMany({
    data: [
      { title: 'Expert Guides', description: 'Local experts who know every trail and hidden gem.', iconName: 'MapPin', order: 1 },
      { title: 'Safe Travel', description: 'Verified accommodations and 24/7 support on every trip.', iconName: 'Shield', order: 2 },
      { title: 'Small Groups', description: 'Intimate group sizes for a personalized experience.', iconName: 'Users', order: 3 },
      { title: 'Best Prices', description: 'Competitive pricing with no hidden charges.', iconName: 'IndianRupee', order: 4 },
      { title: 'Curated Itineraries', description: 'Hand-picked routes showcasing the best of Northeast.', iconName: 'Route', order: 5 },
      { title: 'Flexible Booking', description: 'Easy cancellation and rescheduling policies.', iconName: 'Calendar', order: 6 },
      { title: 'Community', description: 'Join a vibrant community of fellow travelers.', iconName: 'Heart', order: 7 },
      { title: 'Eco Friendly', description: 'Responsible tourism that respects local culture.', iconName: 'Leaf', order: 8 },
      { title: 'All Inclusive', description: 'Transport, stay, and meals covered in most packages.', iconName: 'Package', order: 9 },
    ],
  });

  await prisma.faq.deleteMany();
  await prisma.faq.createMany({
    data: [
      { question: 'What is included in the trip price?', answer: 'Most trips include accommodation, transportation, guide fees, and some meals. Check individual trip details for specifics.', order: 1 },
      { question: 'How do I book a trip?', answer: 'Browse our trips, click View Details, and contact us or fill the inquiry form. Our team will confirm your booking.', order: 2 },
      { question: 'What is the cancellation policy?', answer: 'Cancellations made 15+ days before departure receive a full refund minus processing fees. See our terms for details.', order: 3 },
      { question: 'Are solo travelers welcome?', answer: 'Absolutely! Our Stranger Trips are designed for solo travelers looking to meet like-minded adventurers.', order: 4 },
      { question: 'What should I pack for Northeast trips?', answer: 'Pack layers, rain gear, comfortable trekking shoes, and any personal medications. We send a detailed packing list after booking.', order: 5 },
    ],
  });

  await prisma.instagramReel.deleteMany();
  await prisma.instagramReel.createMany({
    data: [
      { reelUrl: 'https://instagram.com/reel/example1', thumbnailUrl: PLACEHOLDER, order: 1 },
      { reelUrl: 'https://instagram.com/reel/example2', thumbnailUrl: PLACEHOLDER, order: 2 },
      { reelUrl: 'https://instagram.com/reel/example3', thumbnailUrl: PLACEHOLDER, order: 3 },
      { reelUrl: 'https://instagram.com/reel/example4', thumbnailUrl: PLACEHOLDER, order: 4 },
      { reelUrl: 'https://instagram.com/reel/example5', thumbnailUrl: PLACEHOLDER, order: 5 },
      { reelUrl: 'https://instagram.com/reel/example6', thumbnailUrl: PLACEHOLDER, order: 6 },
    ],
  });

  await prisma.blog.deleteMany();
  await prisma.blog.createMany({
    data: [
      {
        title: 'Top 5 Places to Visit in Meghalaya',
        slug: 'top-5-places-meghalaya',
        excerpt: 'From living root bridges to crystal-clear rivers, discover the best of Meghalaya.',
        content: 'Meghalaya, the abode of clouds, offers breathtaking landscapes...',
        imageUrl: PLACEHOLDER,
        status: BlogStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      {
        title: 'Winter Travel Guide: Tawang & Beyond',
        slug: 'winter-travel-guide-tawang',
        excerpt: 'Everything you need to know for a magical winter trip to Arunachal Pradesh.',
        content: 'Winter in Tawang transforms the landscape into a snowy wonderland...',
        imageUrl: PLACEHOLDER,
        status: BlogStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      {
        title: 'Why Group Travel is the Best Way to Explore Northeast',
        slug: 'why-group-travel-northeast',
        excerpt: 'Meet new people, share costs, and create unforgettable memories together.',
        content: 'Group travel opens doors to experiences you might miss traveling solo...',
        imageUrl: PLACEHOLDER,
        status: BlogStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    ],
  });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
