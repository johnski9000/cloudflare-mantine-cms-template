import BookingBanner, {
  BookingBannerProps,
} from "../../ComponentLibrary/Hero/BookingBanner";
import HeroBanner, {
  HeroBannerProps,
} from "../../ComponentLibrary/Hero/HeroBanner";
import HeroCarousel, {
  HeroCarouselProps,
} from "../../ComponentLibrary/Hero/HeroCarousel/HeroCarousel";
import ImageBanner, {
  ImageBannerProps,
} from "../../ComponentLibrary/Hero/ImageBanner";
import TextBanner, {
  TextBannerProps,
} from "../../ComponentLibrary/Hero/TextBanner";

export const HeroMap = {
  BookingBanner: {
    category: "Hero",
    component: BookingBanner,
    name: "Hero Booking Banner",
    metadata: {
      props: BookingBannerProps,
    },
  },
  HeroCarousel: {
    category: "Hero",
    component: HeroCarousel,
    name: "Hero Carousel",
    metadata: {
      props: HeroCarouselProps,
    },
  },
  HeroBanner: {
    category: "Hero",
    component: HeroBanner,
    name: "Hero Banner",
    metadata: {
      props: HeroBannerProps,
    },
  },
  ImageBanner: {
    category: "Hero",
    component: ImageBanner,
    name: "Hero Image Banner",
    metadata: {
      props: ImageBannerProps,
    },
  },
  TextBanner: {
    category: "Hero",
    component: TextBanner,
    name: "Hero Text Banner",
    metadata: {
      props: TextBannerProps,
    },
  },
};
