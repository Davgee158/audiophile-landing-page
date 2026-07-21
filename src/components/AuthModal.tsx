import { useState } from "react";
import { useAuth } from "../context/authContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { signUp, signIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setSuccessMessage("Account created! Please sign in.");
        setIsSignUp(false);
        setEmail("");
        setPassword("");
      } else {
        await signIn(email, password);
        setSuccessMessage("Logged in successfully!");
        setTimeout(() => onClose(), 1000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {isSignUp ? "Create Account" : "Sign In"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-orange-500"
            required
          />
          <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded mb-6 focus:outline-none focus:border-orange-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 rounded font-semibold transition-colors"
            style={{ backgroundColor: "#D87D4A" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
            setSuccessMessage("");
            setEmail("");
            setPassword("");
          }}
          className="w-full text-blue-600 font-semibold py-2 hover:underline"
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Create one"}
        </button>
      </div>
    </div>
  );
};
