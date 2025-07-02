"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

// Types
interface SeasonPrice {
  color: string;
  seasonName: string;
  adultPrice: number;
  childPrice: number;
}

interface SelectedDate {
  day: number;
  month: number;
  year: number;
  seasonPrice?: SeasonPrice;
}

interface SelectedOffer {
  name: string;
  price: number;
}

interface BasketItem {
  product_id: string;
  title: string;
  description: string;
  baseAdultPrice: number;
  baseChildPrice: number;
  image: string;
  quantity: number;

  // New fields for booking details
  numAdults: number;
  numChildren: number;
  adultNames: string[];
  childrenNames: string[];
  selectedDate?: SelectedDate;
  selectedOffer?: SelectedOffer;
  selectedFreeGift?: string;

  // Calculated pricing
  finalAdultPrice: number; // After season pricing applied
  finalChildPrice: number; // After season pricing applied
  totalPrice: number; // Total for this item including offers
}

interface BasketState {
  items: BasketItem[];
  totalItems: number;
  totalPrice: number;
  currency: string;
  isLoading: boolean;
  error: string | null;
}

interface BasketContextType extends BasketState {
  // Item management
  addItem: (item: Omit<BasketItem, "quantity">, quantity?: number) => void;
  removeItem: (product_id: string) => void;
  updateQuantity: (product_id: string, quantity: number) => void;
  clearBasket: () => void;

  // Utility functions
  getItem: (product_id: string) => BasketItem | undefined;
  isItemInBasket: (product_id: string) => boolean;
  getItemQuantity: (product_id: string) => number;

  // Discount and coupon functionality
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  appliedCoupon?: {
    code: string;
    discount: number;
    type: "percentage" | "fixed";
  };

  // Calculated totals
  subtotal: number;
  discountAmount: number;
  finalTotal: number;
}

// Action types
type BasketAction =
  | {
      type: "ADD_ITEM";
      payload: { item: Omit<BasketItem, "quantity">; quantity: number };
    }
  | { type: "REMOVE_ITEM"; payload: { product_id: string } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { product_id: string; quantity: number };
    }
  | { type: "CLEAR_BASKET" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "APPLY_COUPON";
      payload: { code: string; discount: number; type: "percentage" | "fixed" };
    }
  | { type: "REMOVE_COUPON" }
  | { type: "LOAD_FROM_STORAGE"; payload: BasketState };

// Initial state
const initialState: BasketState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  currency: "£",
  isLoading: false,
  error: null,
};

// Helper functions
const calculateItemTotal = (item: BasketItem): number => {
  const guestTotal =
    item.finalAdultPrice * item.numAdults +
    item.finalChildPrice * item.numChildren;
  const offerTotal = item.selectedOffer ? item.selectedOffer.price : 0;
  return (guestTotal + offerTotal) * item.quantity;
};

const calculateTotals = (items: BasketItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );
  return { totalItems, totalPrice };
};

const saveToLocalStorage = (state: BasketState) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "basket",
        JSON.stringify({
          items: state.items,
          appliedCoupon: (state as any).appliedCoupon,
          currency: state.currency,
        })
      );
    }
  } catch (error) {
    console.warn("Failed to save basket to localStorage:", error);
  }
};

const loadFromLocalStorage = (): Partial<BasketState> | null => {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("basket");
      if (stored) {
        const parsed = JSON.parse(stored);
        const { totalItems, totalPrice } = calculateTotals(parsed.items || []);
        return {
          ...parsed,
          totalItems,
          totalPrice,
          isLoading: false,
          error: null,
        };
      }
    }
  } catch (error) {
    console.warn("Failed to load basket from localStorage:", error);
  }
  return null;
};

// Reducer
const basketReducer = (
  state: BasketState & { appliedCoupon?: any },
  action: BasketAction
): BasketState & { appliedCoupon?: any } => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (i) => i.product_id === item.product_id
      );

      let newItems: BasketItem[];
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((existingItem, index) =>
          index === existingItemIndex
            ? { ...existingItem, quantity: existingItem.quantity + quantity }
            : existingItem
        );
      } else {
        // Add new item with calculated total
        const itemWithTotal = {
          ...item,
          quantity,
          totalPrice: calculateItemTotal({ ...item, quantity }),
        };
        newItems = [...state.items, itemWithTotal];
      }

      const { totalItems, totalPrice } = calculateTotals(newItems);
      const newState = {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
        error: null,
      };

      saveToLocalStorage(newState);
      return newState;
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.product_id !== action.payload.product_id
      );
      const { totalItems, totalPrice } = calculateTotals(newItems);
      const newState = {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };

      saveToLocalStorage(newState);
      return newState;
    }

    case "UPDATE_QUANTITY": {
      const { product_id, quantity } = action.payload;

      if (quantity <= 0) {
        return basketReducer(state, {
          type: "REMOVE_ITEM",
          payload: { product_id },
        });
      }

      const newItems = state.items.map((item) =>
        item.product_id === product_id
          ? {
              ...item,
              quantity,
              totalPrice: calculateItemTotal({ ...item, quantity }),
            }
          : item
      );

      const { totalItems, totalPrice } = calculateTotals(newItems);
      const newState = {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };

      saveToLocalStorage(newState);
      return newState;
    }

    case "CLEAR_BASKET": {
      const newState = {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        appliedCoupon: undefined,
      };

      saveToLocalStorage(newState);
      return newState;
    }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "APPLY_COUPON":
      return { ...state, appliedCoupon: action.payload };

    case "REMOVE_COUPON":
      return { ...state, appliedCoupon: undefined };

    case "LOAD_FROM_STORAGE":
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

// Create context
const BasketContext = createContext<BasketContextType | undefined>(undefined);

// Provider component
interface BasketProviderProps {
  children: ReactNode;
  defaultCurrency?: string;
}

export const BasketProvider: React.FC<BasketProviderProps> = ({
  children,
  defaultCurrency = "£",
}) => {
  const [state, dispatch] = useReducer(basketReducer, {
    ...initialState,
    currency: defaultCurrency,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromLocalStorage();
    if (stored) {
      dispatch({ type: "LOAD_FROM_STORAGE", payload: stored as BasketState });
    }
  }, []);

  // Item management functions
  const addItem = (
    item: Omit<BasketItem, "quantity">,
    quantity: number = 1
  ) => {
    dispatch({ type: "ADD_ITEM", payload: { item, quantity } });
  };

  const removeItem = (product_id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { product_id } });
  };

  const updateQuantity = (product_id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { product_id, quantity } });
  };

  const clearBasket = () => {
    dispatch({ type: "CLEAR_BASKET" });
  };

  // Utility functions
  const getItem = (product_id: string): BasketItem | undefined => {
    return state.items.find((item) => item.product_id === product_id);
  };

  const isItemInBasket = (product_id: string): boolean => {
    return state.items.some((item) => item.product_id === product_id);
  };

  const getItemQuantity = (product_id: string): number => {
    const item = getItem(product_id);
    return item ? item.quantity : 0;
  };

  // Coupon functionality
  const applyCoupon = async (code: string): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Simulate API call for coupon validation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock coupon validation
      const mockCoupons: Record<
        string,
        { discount: number; type: "percentage" | "fixed" }
      > = {
        SAVE10: { discount: 10, type: "percentage" },
        WELCOME20: { discount: 20, type: "fixed" },
        SUMMER15: { discount: 15, type: "percentage" },
      };

      const coupon = mockCoupons[code.toUpperCase()];
      if (coupon) {
        dispatch({
          type: "APPLY_COUPON",
          payload: { code: code.toUpperCase(), ...coupon },
        });
        dispatch({ type: "SET_ERROR", payload: null });
      } else {
        throw new Error("Invalid coupon code");
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to apply coupon",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const removeCoupon = () => {
    dispatch({ type: "REMOVE_COUPON" });
  };

  // Calculate totals with discounts
  const subtotal = state.totalPrice;
  const appliedCoupon = (state as any).appliedCoupon;

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? (subtotal * appliedCoupon.discount) / 100
      : appliedCoupon.discount
    : 0;

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const contextValue: BasketContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearBasket,
    getItem,
    isItemInBasket,
    getItemQuantity,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    subtotal,
    discountAmount,
    finalTotal,
  };

  return (
    <BasketContext.Provider value={contextValue}>
      {children}
    </BasketContext.Provider>
  );
};

// Custom hook to use the basket context
export const useBasket = (): BasketContextType => {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
};

// Export types for external use
export type {
  BasketItem,
  BasketContextType,
  SeasonPrice,
  SelectedDate,
  SelectedOffer,
};

export default BasketContext;
