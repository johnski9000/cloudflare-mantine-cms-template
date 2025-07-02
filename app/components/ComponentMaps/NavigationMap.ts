// NavigationMap.js

import CenteredLogoNavigation, {
  CenteredLogoNavigationProps,
} from "../ComponentLibrary/Navigation/CenteredLogoNavigation";
import NavigationWithBasket, {
  NavigationWithBasketProps,
} from "../ComponentLibrary/Navigation/NavigationWithBasket";

export const NavigationMap = {
  CenteredLogoNavigation: {
    component: CenteredLogoNavigation,
    name: "Centered Logo Navigation",
    metadata: {
      props: CenteredLogoNavigationProps,
    },
  },
  NavigationWithBasket: {
    component: NavigationWithBasket,
    name: "Navigation with Basket",
    metadata: {
      props: NavigationWithBasketProps,
    },
  },
};
