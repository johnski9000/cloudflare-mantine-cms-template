import PackageGrid, {
  PackageGridProps,
} from "../../ComponentLibrary/ProductList/PackageGrid";
import StorePage from "../../ComponentLibrary/ProductList/ProductList";

export const ProductListMap = {
  StorePage: {
    category: "Product List",
    component: StorePage,
    name: "Store Page",
    metadata: {
      props: {},
    },
  },
  PackageGrid: {
    category: "Product List",
    component: PackageGrid,
    name: "Package Grid",
    metadata: {
      props: PackageGridProps,
    },
  },
};
