import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { AuthModal } from "./AuthModal";
import { useNavigate, Link } from "react-router-dom";

export const AccountDropdown = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Account Icon Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:opacity-80 transition p-1"
          title="Account"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 py-2">
            {loading ? (
              <div className="px-4 py-2 text-gray-600 text-sm">Loading...</div>
            ) : !user ? (
              <>
                <button
                  onClick={() => {
                    setIsAuthOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800 text-sm font-semibold"
                  style={{ color: "#D87D4A" }}
                >
                  Sign In / Create Account
                </button>
              </>
            ) : (
              <>
                <div className="px-4 py-2 border-b">
                  <p className="text-gray-600 text-xs">Logged in as</p>
                  <p className="text-gray-800 font-semibold truncate">
                    {user.email}
                  </p>
                </div>
                <Link
                  to="/orders"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-800 text-sm"
                >
                  Order History
                </Link>
                <div className="border-t my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-center px-4 py-2 hover:bg-gray-100 text-gray-800 text-sm font-semibold"
                  style={{ color: "#D87D4A" }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};
