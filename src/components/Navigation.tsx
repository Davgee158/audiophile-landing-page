import CartModal from "./CartModal";
import { useModal } from "../context/modalContext";
import CategoriesGrid from "./CategoriesGrid";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AccountDropdown } from "./AccountDropdown";

interface NavigationProps {
  className?: string;
  marginBottom?: string;
}

const Navigation = ({
  className = "",
  marginBottom = "mb-22",
}: NavigationProps) => {
  const { isCartOpen, setIsCartOpen, isMenuOpen, setIsMenuOpen } = useModal();
  const location = useLocation();
  const baseClasses =
    "fixed top-0 left-0 right-0 bg-black flex items-center justify-between pt-4 pb-6 px-2 md:px-6  border-b border-gray-600 z-50";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location, setIsMenuOpen]);

  return (
    <>
      <nav className={`${baseClasses} ${className} ${marginBottom}`}>
        <div className="flex w-2/3 lg:w-auto justify-between md:justify-normal md:gap-12 md:items-center">
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              if (!isMenuOpen) {
                setIsCartOpen(false);
              }
            }}
            className="lg:hidden"
          >
            <img
              src="/assets/shared/tablet/icon-hamburger.svg"
              alt="Hamburger"
              className="h-6"
            />
          </button>
          <div>
            <img
              src="/assets/shared/desktop/logo.svg"
              alt="Logo"
              className="h-6"
            />
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex gap-12 flex-1 justify-center items-center">
          <Link
            to="/"
            className="text-white text-sm font-semibold tracking-wider hover:text-[#D87D4A]"
          >
            HOME
          </Link>
          <Link
            to="/category/headphones"
            className="text-white text-sm font-semibold tracking-wider hover:text-[#D87D4A]"
          >
            HEADPHONES
          </Link>
          <Link
            to="/category/speakers"
            className="text-white text-sm font-semibold tracking-wider hover:text-[#D87D4A]"
          >
            SPEAKERS
          </Link>
          <Link
            to="/category/earphones"
            className="text-white text-sm font-semibold tracking-wider hover:text-[#D87D4A]"
          >
            EARPHONES
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <AccountDropdown />
          <button
            onClick={() => {
              setIsCartOpen(!isCartOpen);
              if (!isCartOpen) {
                setIsMenuOpen(false);
              }
            }}
          >
            <img
              src="/assets/shared/desktop/icon-cart.svg"
              alt="Cart"
              className="h-6"
            />
          </button>
        </div>
      </nav>
      {isMenuOpen && (
        <>
          <div
            className="fixed top-16 left-0 right-0 bottom-0 bg-black/50 z-30"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-white z-40 rounded-b-lg max-h-[calc(100vh-80px)] overflow-y-auto">
            <div>
              <CategoriesGrid />
            </div>
          </div>
        </>
      )}
      {isCartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-10"
            onClick={() => setIsCartOpen(false)}
          />
          <CartModal />
        </>
      )}
    </>
  );
};

export default Navigation;
