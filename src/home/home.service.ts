import { Injectable } from '@nestjs/common';
import { BannerType } from '@prisma/client';
import { BannersService } from '../banners/banners.service.js';
import { BlogsService } from '../blogs/blogs.service.js';
import { CategoriesService } from '../categories/categories.service.js';
import { FaqsService } from '../faqs/faqs.service.js';
import { FeaturesService } from '../features/features.service.js';
import { InstagramService } from '../instagram/instagram.service.js';
import { LocationsService } from '../locations/locations.service.js';
import { NavigationService } from '../navigation/navigation.service.js';
import { SiteSettingsService } from '../site-settings/site-settings.service.js';
import { TripsService } from '../trips/trips.service.js';

@Injectable()
export class HomeService {
  constructor(
    private siteSettings: SiteSettingsService,
    private navigation: NavigationService,
    private trips: TripsService,
    private categories: CategoriesService,
    private locations: LocationsService,
    private banners: BannersService,
    private features: FeaturesService,
    private faqs: FaqsService,
    private instagram: InstagramService,
    private blogs: BlogsService,
  ) {}

  async getHomeData() {
    const [
      siteSettings,
      navigation,
      featuredTrips,
      categories,
      locations,
      heroBanners,
      offerBanners,
      features,
      faqs,
      instagramReels,
      blogs,
    ] = await Promise.all([
      this.siteSettings.getPublic(),
      this.navigation.getPublicTree(),
      this.trips.findPublic({ featured: true, limit: 8 }),
      this.categories.findPublic(),
      this.locations.findPublic(),
      this.banners.findPublic(BannerType.HERO),
      this.banners.findPublic(BannerType.OFFER),
      this.features.findPublic(),
      this.faqs.findPublic(),
      this.instagram.findPublic(8),
      this.blogs.findPublic(1, 6),
    ]);

    return {
      siteSettings,
      navigation,
      featuredTrips: featuredTrips.data,
      categories,
      locations,
      heroBanners,
      offerBanners,
      features,
      faqs,
      instagramReels,
      blogs: blogs.data,
    };
  }
}
