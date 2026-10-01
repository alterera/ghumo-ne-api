import { Module } from '@nestjs/common';
import { BannersModule } from '../banners/banners.module.js';
import { BlogsModule } from '../blogs/blogs.module.js';
import { CategoriesModule } from '../categories/categories.module.js';
import { FaqsModule } from '../faqs/faqs.module.js';
import { FeaturesModule } from '../features/features.module.js';
import { InstagramModule } from '../instagram/instagram.module.js';
import { LocationsModule } from '../locations/locations.module.js';
import { NavigationModule } from '../navigation/navigation.module.js';
import { SiteSettingsModule } from '../site-settings/site-settings.module.js';
import { TripsModule } from '../trips/trips.module.js';
import { HomeController } from './home.controller.js';
import { HomeService } from './home.service.js';

@Module({
  imports: [
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
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
