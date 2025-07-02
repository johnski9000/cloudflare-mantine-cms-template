import ResearchDataCard, {
  ResearchDataCardProps,
} from "../../ComponentLibrary/Cards/ResearchDataCard";
import ServiceProcessCard, {
  serviceProcessCardProps,
} from "../../ComponentLibrary/Cards/ServiceProcessCard";
import StatisticsHighlightCard, {
  StatisticsHighlightCardProps,
} from "../../ComponentLibrary/Cards/StatisticsHighlightCard";

export const CardsMap = {
  ServiceProcessCard: {
    category: "Cards",
    component: ServiceProcessCard,
    name: "Service Process Card",
    metadata: {
      props: serviceProcessCardProps,
    },
  },
  ResearchDataCard: {
    category: "Cards",
    component: ResearchDataCard,
    name: "Research Data Card",
    metadata: {
      props: ResearchDataCardProps,
    },
  },

  StatisticsHighlightCard: {
    category: "Cards",
    component: StatisticsHighlightCard,
    name: "Statistics Highlight Card",
    metadata: {
      props: StatisticsHighlightCardProps,
    },
  },
};
