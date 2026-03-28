import Navigation from "../components/Navigation";
import { useState } from "react";
import { useCart } from "../context/cartContext";
import Footer from "../components/Footer";
import CheckoutModal from "../components/CheckoutModal";
import { useModal } from "../context/modalContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { supabase } from "../lib/supabase";
import { formatCurrency, validateEmail } from "../utils/formatting";

const CheckoutPage = () => {
  const [selectedPayment, setSelectedPayment] = useState<string>("e-Money");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
    city: "",
    country: "",
    eMoneyNumber: "",
    eMoneyPin: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const { items, setItems } = useCart();
  const { user } = useAuth();
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    isCartOpen,
    setIsCartOpen,
    isMenuOpen,
    setIsMenuOpen,
  } = useModal();
  const navigate = useNavigate();

  // If cart is empty, redirect to home
  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ paddingTop: "64px" }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Authorized</h1>
          <p className="text-gray-600 mb-6">
            You must be logged in to checkout
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#D87D4A] text-white px-8 py-3 rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ paddingTop: "64px" }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cart is Empty</h1>
          <p className="text-gray-600 mb-6">
            Add items to your cart before checking out
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#D87D4A] text-white px-8 py-3 rounded"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP Code is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    if (selectedPayment === "e-Money") {
      if (!formData.eMoneyNumber.trim())
        newErrors.eMoneyNumber = "e-Money Number is required";
      if (!formData.eMoneyPin.trim())
        newErrors.eMoneyPin = "e-Money PIN is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveOrderToSupabase = async () => {
    if (!user) {
      setCheckoutError("You must be logged in to place an order");
      return false;
    }

    if (items.length === 0) {
      setCheckoutError("Your cart is empty. Add items before checking out.");
      return false;
    }

    try {
      const { error } = await supabase.from("orders").insert([
        {
          user_id: user.id,
          items: items,
          total: total,
          shipping: shipping,
          vat: vat,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          address: formData.address,
          zip_code: formData.zipCode,
          city: formData.city,
          country: formData.country,
          payment_method: selectedPayment,
          status: "completed",
        },
      ]);

      if (error) {
        setCheckoutError(
          "Failed to save order. Please check your connection and try again.",
        );
        return false;
      }

      return true;
    } catch (err: any) {
      setCheckoutError(
        `Error: ${err.message || "An error occurred while placing your order."}`,
      );
      return false;
    }
  };

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = 50;
  const vat = Math.round(total * 0.2);
  const grandTotal = Math.round(total + shipping + vat);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#f1f1f1", paddingTop: "64px" }}
    >
      <Navigation marginBottom="mb-6" />

      <div className="mx-6 md:mx-12 lg:mx-24 mb-20 mt-4">
        <button onClick={() => navigate(-1)} className="opacity-50">
          Go Back
        </button>
        <div className="lg:flex lg:gap-12">
          <form
            className="bg-white mt-10 rounded-lg p-6 lg:p-12"
            id="checkoutForm"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!validateForm()) return;

              setCheckoutError(null);
              setLoading(true);

              const orderSaved = await saveOrderToSupabase();

              if (orderSaved) {
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  address: "",
                  zipCode: "",
                  city: "",
                  country: "",
                  eMoneyNumber: "",
                  eMoneyPin: "",
                });
                setIsCheckoutOpen(true);
                setIsCartOpen(false);
                setIsMenuOpen(false);
              } else {
                setCheckoutError("Failed to place order. Please try again.");
              }

              setLoading(false);
            }}
          >
            <h2 className="text-3xl font-bold mb-6">CHECKOUT</h2>

            <h3
              style={{ color: "#D87D4A" }}
              className="text-sm font-semibold tracking-wider mb-4"
            >
              BILLING DETAILS
            </h3>
            <div className="md:grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="font-semibold text-sm">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className={`w-full text-sm font-semibold border rounded-lg p-4 mb-2 mt-2 focus:border-[#D87D4A] focus:outline-none transition-colors duration-300 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Alexei Ward"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <span className="text-red-500 text-xs mb-4 block">
                    {errors.name}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="email" className="font-semibold text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full text-sm font-semibold border rounded-lg p-4 mb-2 mt-2 focus:border-[#D87D4A] focus:outline-none transition-colors duration-300 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="alexei@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mb-4 block">
                    {errors.email}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="font-semibold text-sm">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className={`w-full text-sm font-semibold border rounded-lg p-4 mb-2 mt-2 focus:border-[#D87D4A] focus:outline-none transition-colors duration-300 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="+1 202-555-0136"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && (
                  <span className="text-red-500 text-xs mb-4 block">
                    {errors.phone}
                  </span>
                )}
              </div>
            </div>

            <h3
              style={{ color: "#D87D4A" }}
              className="text-sm font-semibold tracking-wider my-4"
            >
              SHIPPING INFO
            </h3>
            <div className="md:grid grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="address" className="font-semibold text-sm">
                  Your Address
                </label>
                <input
                  type="text"
                  id="address"
                  className={`w-full text-sm font-semibold border rounded-lg p-4 mb-2 mt-2 focus:border-[#D87D4A] focus:outline-none transition-colors duration-300 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1137 Williams Avenue"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {errors.address && (
                  <span className="text-red-500 text-xs mb-4 block">
                    {errors.address}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="zipCode" className="font-semibold text-sm">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  className={`w-full text-sm font-semibold border rounded-lg p-4 mb-2 mt-2 focus:border-[#D87D4A] focus:outline-none transition-colors duration-300 ${
                    errors.zipCode ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="10001"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
                {errors.zipCode && (
                  <span className="text-red-500 text-xs mb-4 block">
                    {errors.zipCode}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="city" className="font-semibold text-sm">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  className={`w-full text-sm font-semibold border rounded-lg p-4 mb-2 mt-2 focus:border-[#D87D4A] focus:outline-none transition-colors duration-300 ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="New York"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                {errors.city && (
                  <span className="text-red-500 text-xs mb-4 block">
                    {errors.city}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="country" className="font-semibold text-sm">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  className={`w-full text-sm font-semibold border rounded-lg p-4 mb-2 mt-2 focus:border-[#D87D4A] focus:outline-none transition-colors duration-300 ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="United States"
                  value={formData.country}
                  onChange={handleInputChange}
                />
                {errors.country && (
                  <span className="text-red-500 text-xs mb-4 block">
                    {errors.country}
                  </span>
                )}
              </div>
            </div>

            <h3
              style={{ color: "#D87D4A" }}
              className="text-sm font-semibold tracking-wider my-4"
            >
              PAYMENT DETAILS
            </h3>
            <div className="md:flex justify-between items-start">
              <label className="font-semibold text-sm">Payment Method</label>
              <div className="md:w-1/2">
                <div
                  className="flex items-center gap-3 p-4 rounded-lg mb-4 mt-3 font-semibold text-sm cursor-pointer"
                  style={{
                    border:
                      selectedPayment === "e-Money"
                        ? "2px solid #D87D4A"
                        : "1px solid #cccccc",
                  }}
                >
                  <input
                    type="radio"
                    id="e-money"
                    name="payment-method"
                    value="e-Money"
                    checked={selectedPayment === "e-Money"}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="w-4 h-4 cursor-pointer"
                    style={{ accentColor: "#D87D4A" }}
                  />
                  <label htmlFor="e-money" className="cursor-pointer flex-1">
                    e-Money
                  </label>
                </div>
                <div
                  className="flex items-center gap-3 p-4 rounded-lg mb-6 mt-3 font-semibold text-sm cursor-pointer"
                  style={{
                    border:
                      selectedPayment === "cash-on-delivery"
                        ? "2px solid #D87D4A"
                        : "1px solid #cccccc",
                  }}
                >
                  <input
                    type="radio"
                    id="cash-delivery"
                    name="payment-method"
                    value="cash-on-delivery"
                    checked={selectedPayment === "cash-on-delivery"}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="w-4 h-4 cursor-pointer "
                    style={{ accentColor: "#D87D4A" }}
                  />
                  <label
                    htmlFor="cash-delivery"
                    className="cursor-pointer flex-1"
                  >
                    Cash on Delivery
                  </label>
                </div>
              </div>
            </div>

            {selectedPayment === "e-Money" && (
              <div className="md:flex gap-4">
                <div className="md:w-1/2">
                  <label
                    htmlFor="eMoneyNumber"
                    className="font-semibold text-sm"
                  >
                    e-Money Number
                  </label>
                  <input
                    type="text"
                    id="eMoneyNumber"
                    className={`w-full text-sm font-semibold border rounded-lg p-4 mb-2 mt-2 focus:border-[#D87D4A] focus:outline-none transition-colors duration-300 ${
                      errors.eMoneyNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="238521993"
                    value={formData.eMoneyNumber}
                    onChange={handleInputChange}
                  />
                  {errors.eMoneyNumber && (
                    <span className="text-red-500 text-xs mb-4 block">
                      {errors.eMoneyNumber}
                    </span>
                  )}
                </div>
                <div className="md:w-1/2">
                  <label htmlFor="eMoneyPin" className="font-semibold text-sm">
                    e-Money PIN
                  </label>
                  <input
                    type="text"
                    id="eMoneyPin"
                    className={`w-full text-sm font-semibold border rounded-lg p-4 mb-4 mt-2 focus:border-[#D87D4A] focus:outline-none transition-colors duration-300 ${
                      errors.eMoneyPin ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="6891"
                    value={formData.eMoneyPin}
                    onChange={handleInputChange}
                  />
                  {errors.eMoneyPin && (
                    <span className="text-red-500 text-xs mb-4 block">
                      {errors.eMoneyPin}
                    </span>
                  )}
                </div>
              </div>
            )}
          </form>

          <div className="bg-white mt-10 rounded-lg p-6 lg:w-1/3 lg:h-fit">
            <h2 className="text-lg font-semibold mb-6 tracking-wider">
              SUMMARY
            </h2>
            <div className="mb-8">
              {(() => {
                const removeWords = ["speaker", "headphones", "wireless", "earphones"];
                const cleanedItems = items.map((item: any) => {
                  const cleanedName = item.name
                    .split(" ")
                    .map((word: string) => (word === "Mark" ? "MK" : word))
                    .filter(
                      (word: string) =>
                        !removeWords.includes(word.toLowerCase()),
                    )
                    .join(" ");
                  return { ...item, name: cleanedName };
                });

                return items?.map((item: any) => {
                  return (
                    <div
                      key={item.id}
                      className="flex justify-between items-center gap-4 mb-5"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 rounded-lg"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold">
                            {cleanedItems
                              .find(
                                (cleanedItem: any) => cleanedItem.id === item.id,
                              )
                              ?.name.toUpperCase()}
                          </span>
                          <span className="opacity-50 font-bold">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                      <div className="font-bold opacity-50">x{item.quantity}</div>
                    </div>
                  );
                });
              })()}
            </div>
            <div className="flex justify-between mb-2">
              <span className="opacity-50">TOTAL</span>
              <span className="font-bold text-lg">
                {formatCurrency(total)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="opacity-50">SHIPPING</span>
              <span className="font-bold text-lg">
                {formatCurrency(shipping)}
              </span>
            </div>
            <div className="flex justify-between mb-7">
              <span className="opacity-50">VAT (INCLUDED)</span>
              <span className="font-bold text-lg">
                {formatCurrency(vat)}
              </span>
            </div>
            <div className="flex justify-between mb-6">
              <span className="opacity-50">GRAND TOTAL</span>
              <span className="font-bold text-lg" style={{ color: "#D87D4A" }}>
                {formatCurrency(grandTotal)}
              </span>
            </div>
            <button
              type="submit"
              form="checkoutForm"
              disabled={loading || items.length === 0}
              className="w-full bg-[#D87D4A] text-white text-sm py-4 font-semibold tracking-wider hover:bg-[#FBAF85] mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "PROCESSING..." : "CONTINUE & PAY"}
            </button>
            {checkoutError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {checkoutError}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer hero={false} />
      {isCheckoutOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-10"
            onClick={() => setIsCheckoutOpen(false)}
          />
          <CheckoutModal />
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
