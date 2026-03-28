import { createContext, useContext, useState, type ReactNode, useEffect } from "react";

type ModalContextType = {
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isMenuOpen: boolean;
  setIsCheckoutOpen: (value: boolean) => void;
  setIsCartOpen: (value: boolean) => void;
  setIsMenuOpen: (value: boolean) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isCartOpen || isCheckoutOpen) {
      document.body.style.overflow = "hidden";
    } else if (isMenuOpen) {
      document.body.style.overflow = "unset";

      const handleScroll = () => {
        if (window.scrollY > 200) {
          window.scrollTo(0, 200);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, isCheckoutOpen, isMenuOpen]);

  return (
    <ModalContext.Provider value={{ isCartOpen, setIsCartOpen, isCheckoutOpen, setIsCheckoutOpen, isMenuOpen, setIsMenuOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
