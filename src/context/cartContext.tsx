import {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from "react";

type CartContextType = {
  items: cartItem[];
  setItems: (items: cartItem[]) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  addItem: (item: cartItem) => void;
};

type cartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

const cartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<cartItem[]>([]);

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item,
        ),
      );
    }
  };

  const addItem = (item: cartItem) => {
    setItems([...items, item]);
  };

  return (
    <cartContext.Provider
      value={{
        items,
        setItems,
        removeItem,
        updateQuantity,
        addItem,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(cartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
