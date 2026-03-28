import { useCart } from "../context/cartContext";
import Bar from "./Bar";
import DeleteIcon from "/assets/cart/delete-2-svgrepo-com.svg";
import { Link } from "react-router-dom";
import { useModal } from "../context/modalContext";
import { formatCurrency } from "../utils/formatting";

const CartModal = () => {
  const { items, setItems, updateQuantity, removeItem } = useCart();
  const { setIsCartOpen } = useModal();

  const removeWords = ["speaker", "headphones", "wireless", "earphones"];

  const removeAllItems = () => {
    setItems([]);
  };

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="bg-white shadow-md mx-5 md:mx-12 rounded-lg p-6 fixed top-20 md:top-25 md:right-0 w-[90%] max-w-sm z-50 max-h-[80vh] flex flex-col overflow-hidden">
      {items.length === 0 ? (
        <div>Your cart is empty</div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="font-bold mr-1 tracking-wider">CART</div>
              <span className="font-bold">({items.length})</span>
            </div>

            <button
              className="text-sm opacity-50 hover:opacity-100 hover:text-[#D87D4A] transition-all duration-300 cursor-pointer"
              onClick={removeAllItems}
            >
              Remove all
            </button>
          </div>
          <div>
            <div className="mb-8 max-h-[40vh] overflow-y-auto">
              {items?.map((item: any) => {
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

                    <div>
                      <Bar
                        onQuantity={item.quantity}
                        onSetQuantity={(quantity) =>
                          updateQuantity(item.id, quantity)
                        }
                        width="w-26"
                        height="h-8"
                        top="top-1"
                      />
                      <button
                        className="float-right"
                        onClick={() => removeItem(item.id)}
                      >
                        <img
                          src={DeleteIcon}
                          alt=""
                          className="w-5 h-5 mt-2 opacity-60"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div></div>
          </div>
          <div className="flex justify-between mb-4">
            <span className="opacity-50">TOTAL</span>
            <span className="font-bold text-lg">
              {formatCurrency(total)}
            </span>
          </div>
          <Link to="/checkout">
            <button
              className="bg-[#D87D4A] w-full text-white py-3 px-6 text-sm font-semibold tracking-widest hover:bg-[#FBAF85] transition-all duration-300 cursor-pointer"
              onClick={() => setIsCartOpen(false)}
            >
              CHECKOUT
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default CartModal;
