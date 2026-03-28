import confirmationIcon from "/assets/checkout/icon-order-confirmation.svg";
import { useCart } from "../context/cartContext";
import { useModal } from "../context/modalContext";
import { Link } from "react-router";
import { formatCurrency } from "../utils/formatting";

const CheckoutModal = () => {
  const { items, setItems } = useCart();
  const { setIsCheckoutOpen } = useModal();

  const firstItem = items[0];
  const cleanedItems = (firstItem ? [firstItem] : []).map((item: any) => {
    const cleanedName = item.name
      .split(" ")
      .map((word: string) => (word === "Mark" ? "MK" : word))
      .filter(
        (word: string) =>
          !["speaker", "headphones", "wireless", "earphones"].includes(
            word.toLowerCase(),
          ),
      )
      .join(" ");
    return { ...item, name: cleanedName };
  });
  const totalItems = firstItem ? items.filter((item) => item.id !== firstItem.id).length : 0;

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = 50;
  const vat = Math.round(total * 0.2);
  const grandTotal = Math.round(total + shipping + vat);

  return (
    <div className="bg-white rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 mx-6 p-8 md:p-12 z-20 w-[90%] max-w-lg">
      <img src={confirmationIcon} alt="order-confirmation" className="mb-4 md:mb-6" />
      <p className="text-2xl md:text-3xl font-semibold md:font-bold mb-4 ">
        THANK YOU <br /> FOR YOUR ORDER
      </p>
      <p className="text-sm opacity-50 mb-6">
        You will receive an email confirmation shortly.
      </p>
      <div className="bg-[#f1f1f1] rounded-lg mb-6 md:mb-8 md:grid md:grid-cols-2">
        <div className="divide-y divide-gray-300 p-4">
          <div className="flex justify-between items-center pb-3">
            <div className="flex items-center">
              <img
                src={cleanedItems[0]?.image}
                alt={cleanedItems[0]?.name}
                className="w-12 h-12 mr-4"
              />
              <div className="font-semibold text-sm">
                <p className="mb-1">{cleanedItems[0]?.name.toUpperCase()}</p>
                <span className="opacity-50 tracking-wider">
                  {formatCurrency(cleanedItems[0]?.price || 0)}
                </span>
              </div>
            </div>

            <span className="font-semibold opacity-50 text-sm">
              x{cleanedItems[0]?.quantity}
            </span>
          </div>
          <div className="text-center my-3">
            <span className="font-semibold opacity-50 text-xs ">
              and {totalItems} other item{totalItems > 1 ? "(s)" : ""}
            </span>
          </div>
        </div>
        <div className="bg-black text-white p-4 md:py-10 lg:px-8 rounded-b-lg md:rounded-bl-none md:rounded-r-lg">
          <h2 className="opacity-50 font-light mb-2">GRAND TOTAL</h2>
          <h3 className="font-semibold text-lg">
            {formatCurrency(grandTotal)}
          </h3>
        </div>
      </div>
      <div className="text-center">
        <Link to="/">
          <button
            className="bg-[#D87D4A] w-full text-white py-3 text-sm font-semibold tracking-widest hover:bg-[#D87D4A]/90"
            onClick={() => {
              setIsCheckoutOpen(false);
              setItems([]);
            }}
          >
            BACK TO HOME
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutModal;
