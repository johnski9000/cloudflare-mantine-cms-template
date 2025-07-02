const otherComponentProps = {
  BannerCentered: {
    component: BannerCentered,
    name: "Banner Centered",
    metadata: {
      props: {
        title: { type: "string", value: "Explore the World", active: true },
        subtitle: {
          type: "string",
          value: "Book your dream vacation today!",
          active: true,
        },
        image: {
          type: "image",
          format: "image",
          value: "https://readymadeui.com/cardImg.webp",
          active: true,
        }, // Image
        buttonText: { type: "string", value: "Book Now", active: true },
        buttonLink: { type: "string", value: "#", active: true },
      },
    },
  },
  TextBanner: {
    component: TextBanner,
    name: "Text Banner",
    metadata: {
      props: {
        overTitle: { type: "string", value: "Special Offer", active: true },
        title: { type: "string", value: "Discover Our", active: true },
        italic: { type: "string", value: "Exclusive Services", active: true },
        description: {
          type: "string",
          value:
            "Providing top-tier web solutions tailored to your business needs.",
          active: true,
        },

        buttonText: { type: "string", value: "Book Now", active: true },
        buttonLink: { type: "string", value: "#", active: true },
      },
    },
  },
  ImageBanner: {
    component: ImageBanner,
    name: "Image Banner",
    metadata: {
      props: {
        image: {
          type: "image",
          format: "image",
          value: "https://readymadeui.com/cardImg.webp",
          active: true,
        }, // Image
        alt: { type: "string", value: "Default banner image", active: true },
        main: { type: "boolean", value: true, active: true },
        title: {
          type: "string",
          value: "Welcome to Our Website",
          active: true,
        },
        description: {
          type: "string",
          value: "Providing top-tier solutions",
          active: true,
        },
        owner: { type: "string", value: "Janusz Wozniak", active: true },
        linkLabel: { type: "string", value: "Free Consultation", active: true },
        linkUrl: { type: "string", value: "Free Consultation", active: true },
      },
    },
  },
};
