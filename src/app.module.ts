import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module.js';
import { BannersModule } from './banners/banners.module.js';
import { BlogsModule } from './blogs/blogs.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { validateEnv } from './common/config/env.validation.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { FaqsModule } from './faqs/faqs.module.js';
import { FeaturesModule } from './features/features.module.js';
import { HomeModule } from './home/home.module.js';
import { InquiriesModule } from './inquiries/inquiries.module.js';
import { InstagramModule } from './instagram/instagram.module.js';
import { LocationsModule } from './locations/locations.module.js';
import { NavigationModule } from './navigation/navigation.module.js';
import { SiteSettingsModule } from './site-settings/site-settings.module.js';
import { TripsModule } from './trips/trips.module.js';
import { UploadModule } from './upload/upload.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    UploadModule,
    SiteSettingsModule,
    NavigationModule,
    TripsModule,
    CategoriesModule,
    LocationsModule,
    BannersModule,
    FeaturesModule,
    FaqsModule,
    InstagramModule,
    BlogsModule,
    InquiriesModule,
    HomeModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
