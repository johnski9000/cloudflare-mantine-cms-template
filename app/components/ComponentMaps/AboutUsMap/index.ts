import BenefitsList, {
  BenefitsListProps,
} from "../../ComponentLibrary/AboutUs/BenefitsList";
import ContentBlock, {
  ContentBlockProps,
} from "../../ComponentLibrary/AboutUs/ContentBlock";
import ContentWithStats, {
  ContentWithStatsProps,
} from "../../ComponentLibrary/AboutUs/ContentWithStats";
import ImageWithText, {
  ImageWithTextProps,
} from "../../ComponentLibrary/AboutUs/ImageWithText";
import InfoWithList, {
  InfoWithListProps,
} from "../../ComponentLibrary/AboutUs/InfoWithList";
import ServicesGrid, {
  ServicesGridProps,
} from "../../ComponentLibrary/AboutUs/ServicesGrid";
import TextComponent, {
  TextComponentProps,
} from "../../ComponentLibrary/AboutUs/TextComponent";
import TextWithImage, {
  TextWithImageProps,
} from "../../ComponentLibrary/AboutUs/TextWithImage";
import TextWithImageGrid, {
  TextWithImageGridProps,
} from "../../ComponentLibrary/AboutUs/TextWithImageGrid";
import VideoWithStats, {
  VideoWithStatsProps,
} from "../../ComponentLibrary/AboutUs/VideoWithStats";
import WhatsIncluded, {
  WhatsIncludedProps,
} from "../../ComponentLibrary/AboutUs/WhatsIncluded";

export const AboutUsMap = {
  ContentWithStats: {
    category: "About Us",
    component: ContentWithStats,
    name: "Content with Stats",
    metadata: {
      props: ContentWithStatsProps,
    },
  },
  ServicesGrid: {
    category: "About Us",

    component: ServicesGrid,
    name: "Services Grid",
    metadata: {
      props: ServicesGridProps,
    },
  },
  TextWithImageGrid: {
    category: "About Us",

    component: TextWithImageGrid,
    name: "Text with Image Grid",
    metadata: {
      props: TextWithImageGridProps,
    },
  },
  TextWithImage: {
    category: "About Us",

    component: TextWithImage,
    name: "Text with Image",
    metadata: {
      props: TextWithImageProps,
    },
  },
  ImageWithText: {
    category: "About Us",

    component: ImageWithText,
    name: "Image with Text",
    metadata: {
      props: ImageWithTextProps,
    },
  },
  VideoWithStats: {
    category: "About Us",

    component: VideoWithStats,
    name: "Video with Stats",
    metadata: {
      props: VideoWithStatsProps,
    },
  },
  TextComponent: {
    category: "About Us",
    component: TextComponent,
    name: "Text Component",
    metadata: {
      props: TextComponentProps,
    },
  },
  ContentBlock: {
    category: "About Us",
    component: ContentBlock,
    name: "Content Block",
    metadata: {
      props: ContentBlockProps,
    },
  },
  BenefitsList: {
    category: "About Us",
    component: BenefitsList,
    name: "Benefits List",
    metadata: {
      props: BenefitsListProps,
    },
  },
  WhatsIncluded: {
    category: "About Us",
    component: WhatsIncluded,
    name: "What is Included",
    metadata: {
      props: WhatsIncludedProps,
    },
  },
  InfoWithList: {
    category: "About Us",
    component: InfoWithList,
    name: "Info with List",
    metadata: {
      props: InfoWithListProps,
    },
  },
};
