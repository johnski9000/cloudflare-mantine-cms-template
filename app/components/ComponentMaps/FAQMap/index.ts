import SidebarFAQWithCategories, {
  SidebarFAQWithCategoriesProps,
} from "../../ComponentLibrary/FAQSections/SidebarFAQWithCategories";
import SimpleFAQAccordion, {
  SimpleFAQAccordionProps,
} from "../../ComponentLibrary/FAQSections/SimpleFAQAccordion";

export const FAQMap = {
  SidebarFAQWithCategories: {
    category: "FAQ Sections",
    component: SidebarFAQWithCategories,
    name: "Sidebar FAQ with Categories",
    metadata: {
      props: SidebarFAQWithCategoriesProps,
    },
  },
  SimpleFAQAccordion: {
    category: "FAQ Sections",
    component: SimpleFAQAccordion,
    name: "Simple FAQ Accordion",
    metadata: {
      props: SimpleFAQAccordionProps,
    },
  },
};
