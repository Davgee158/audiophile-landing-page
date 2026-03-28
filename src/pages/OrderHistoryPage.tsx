import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { useAuth } from "../context/authContext";
import { supabase } from "../lib/supabase";
import Spinner from "../components/Spinner";

interface Order {
  id: number;
  created_at: string;
  total: number;
  items: any[];
  customer_name: string;
  status: string;
}

const OrderHistoryPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, loading, navigate]);

  const fetchOrders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setOrders(data || []);
    }
    setOrdersLoading(false);
  };

  if (loading || ordersLoading) {
    return <Spinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ paddingTop: "64px" }}>
      <Navigation marginBottom="mb-6" />

      <div className="mx-6 mt-8 mb-20 max-w-4xl">
        <Link to="/">
          <button className="opacity-50 hover:opacity-100 transition mb-8">
            ← Back to Home
          </button>
        </Link>

        <h1 className="text-4xl font-bold mb-2">Order History</h1>
        <p className="opacity-50 mb-12">
          Logged in as: <span className="font-semibold">{user.email}</span>
        </p>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
            <p className="opacity-50 mb-8">
              You haven't placed any orders yet. Start shopping now!
            </p>
            <Link to="/">
              <button
                className="text-white py-3 px-8 text-sm font-semibold tracking-widest"
                style={{ backgroundColor: "#D87D4A" }}
              >
                CONTINUE SHOPPING
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-300 rounded-lg p-6"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Order #{order.id}</h3>
                    <p className="text-sm opacity-50">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 rounded text-sm font-semibold capitalize"
                    style={{
                      backgroundColor:
                        order.status === "completed" ? "#D87D4A" : "#cccccc",
                      color: "white",
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="mb-4 bg-gray-50 rounded p-4">
                  <h4 className="font-semibold mb-3 text-sm">Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm items-center"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="opacity-50">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm opacity-50">
                    <span>Subtotal</span>
                    <span>${order.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm opacity-50">
                    <span>Shipping</span>
                    <span>$50</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span style={{ color: "#D87D4A" }} className="text-lg">
                      ${(order.total + 50).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Shipping Info */}
                {order.items && (
                  <div className="mt-4 pt-4 border-t text-xs opacity-50 space-y-1">
                    <p className="font-semibold text-gray-800 mb-2">
                      Shipping Address
                    </p>
                    <p>{order.customer_name}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer hero={false} />
    </div>
  );
};

export default OrderHistoryPage;
