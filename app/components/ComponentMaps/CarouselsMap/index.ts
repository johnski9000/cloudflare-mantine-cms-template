import ServiceCarousel, {
  ServiceCarouselProps,
} from "../../ComponentLibrary/Carousel/ServiceCarousel";

export const CarouselsMap = {
  ServiceCarousel: {
    category: "Carousels",
    component: ServiceCarousel,
    name: "Service Carousel",
    metadata: {
      props: ServiceCarouselProps,
    },
  },
};
