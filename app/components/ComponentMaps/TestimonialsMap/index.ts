import TestimonialCards, {
  TestimonialCardsProps,
} from "../../ComponentLibrary/Testimonials/TestimonialCards";
import TestimonialCarousel, {
  TestimonialCarouselProps,
} from "../../ComponentLibrary/Testimonials/TestimonialCarousel";

export const TestimonialMap = {
  TestimonialCards: {
    category: "Testimonials",
    component: TestimonialCards,
    name: "Testimonial Cards",
    metadata: {
      props: TestimonialCardsProps,
    },
  },
  TestimonialCarousel: {
    category: "Testimonials",
    component: TestimonialCarousel,
    name: "Testimonial Carousel",
    metadata: {
      props: TestimonialCarouselProps,
    },
  },
};
