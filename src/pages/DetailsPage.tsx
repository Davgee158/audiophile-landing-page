import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import CategoriesGrid from "../components/CategoriesGrid";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import Bar from "../components/Bar";
import { useCart } from "../context/cartContext";
import Spinner from "../components/Spinner";

const DetailsPage = () => {
  const { type, id } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const { items, removeItem, updateQuantity, addItem } = useCart();

  useEffect(() => {
    // Reset states when navigating to a new product
    setLoading(true);
    setError(null);
    setProducts([]);

    const fetchProduct = async () => {
      try {
        const { data: products, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("slug", id);
        if (!fetchError) {
          setProducts(products);
          // Preload main product image
          if (products && products[0]) {
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = "image";
            link.href = products[0].image.mobile.replace("./", "/");
            document.head.appendChild(link);
          }
        } else {
          setError("Failed to load product. Please try again.");
        }
      } catch (err: any) {
        setError(
          "Network error loading product. Please check your connection.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    setQuantity(1);
  }, [id]);

  if (loading) return <Spinner />;
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ paddingTop: "64px" }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#D87D4A] text-white px-8 py-3 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  if (products.length === 0) return <div>Product not Found</div>;

  const productData = products[0];
  const isInCart = items.some((item) => item.id === productData?.slug);

  function handleAddToCart(): void {
    if (!productData) return;
    const existingItem = items.find((item) => item.id === productData.slug);

    if (existingItem) {
      updateQuantity(productData.slug, existingItem.quantity + quantity);
    } else {
      const cartItem = {
        id: productData.slug,
        name: productData.name,
        price: productData.price,
        quantity: quantity,
        image: `/assets/cart/image-${productData.slug}.jpg`,
      };
      addItem(cartItem);
    }
    setQuantity(1);
  }

  if (!productData || productData.category.toLowerCase() !== type) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p>
            Please select from: xx99-mark-ii, xx99-mark-i, xx59, zx9, zx7, yx1
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ paddingTop: "64px" }}>
      <div>
        <Navigation marginBottom="mb-6" />
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mx-6 md:mx-12 lg:mx-24 opacity-50 block pt-6"
      >
        Go Back
      </button>

      <div className="mx-6 md:mx-12 lg:mx-24 mt-8 mb-20 md:flex md:items-center md:gap-16 lg:gap-24">
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet={productData.image.desktop.replace("./", "/")}
          />
          <source
            media="(min-width: 768px)"
            srcSet={productData.image.tablet.replace("./", "/")}
          />
          <img
            src={productData.image.mobile.replace("./", "/")}
            alt={productData.name}
            className="rounded-lg mb-6"
            loading="lazy"
          />
        </picture>

        <div className="md:w-4/5 md:mt-6">
          {productData.new && (
            <h3
              style={{ color: "#D87D4A" }}
              className="font-light text-sm tracking-[0.5em] mb-6"
            >
              NEW PRODUCT
            </h3>
          )}
          <h2 className="text-3xl/10 lg:text-4xl font-bold mb-4">
            {productData.name.toUpperCase()}
          </h2>
          <p className="opacity-50 text-base/7 mb-6">
            {productData.description}
          </p>

          <strong className="text-xl font-bold">
            {productData.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </strong>
          <div className="mt-8 flex flex-col gap-6 mb-16">
            {isInCart ? (
              <>
                <button
                  className="bg-[#D87D4A] text-white py-3 px-6 text-sm font-semibold tracking-widest w-full hover:bg-[#FBAF85] transition-all duration-300 cursor-pointer"
                  onClick={() => removeItem(productData!.slug)}
                >
                  REMOVE FROM CART
                </button>
              </>
            ) : (
              <>
                <div className="flex gap-4">
                  <Bar onQuantity={quantity} onSetQuantity={setQuantity} />
                  <button
                    className="bg-[#D87D4A] text-white py-3 px-8 text-sm font-semibold tracking-widest flex-1 hover:bg-[#FBAF85] transition-all duration-300 cursor-pointer"
                    onClick={handleAddToCart}
                  >
                    ADD TO CART
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mx-6 md:mx-12 lg:mx-24 lg:flex lg:gap-24 mb-24">
        <div className="mb-18 lg:w-3/5 ">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">FEATURES</h2>
          <p className="opacity-50 whitespace-pre-wrap">
            {productData.features.replace(/\\n/g, "\n")}
          </p>
        </div>
        <div className="mb-16 md:flex lg:flex-col md:gap-48 lg:gap-0 md:mb-24 lg:mb-0">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">IN THE BOX</h2>
          <ul>
            {productData.includes.map((item: any, index: number) => (
              <li key={index} className="flex items-center gap-6 mb-2 ">
                <span className="font-bold" style={{ color: "#D87D4A" }}>
                  {item.quantity}x
                </span>
                <span className="opacity-50">{item.item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-24 mx-8 md:mx-12 lg:mx-24">
        <div className="md:grid md:grid-cols-2 md:gap-6 gap-6 lg:gap-8">
          {Object.entries(productData.gallery).map(([key, image]: [string, any], index: number) => (
            <picture key={key} className={index === 1 ? "md:row-span-2 " : ""}>
              <source
                media="(min-width: 1024px)"
                srcSet={image.desktop.replace("./", "/")}
              />
              <source
                media="(min-width: 768px)"
                srcSet={image.tablet.replace("./", "/")}
              />
              <img
                src={image.mobile.replace("./", "/")}
                alt={productData.name}
                className="rounded-lg w-full h-full object-cover mb-4 md:mb-0"
                loading="lazy"
              />
            </picture>
          ))}
        </div>
      </div>

      <div className="mx-6 md:mx-12 lg:mx-24 text-center mb-32">
        <h2 className="text-2xl md:text-4xl font-bold mb-10">
          YOU MAY ALSO LIKE
        </h2>
        <div className="md:flex md:gap-4 lg:gap-6">
          {productData.others.map((item: any, index: number) => (
            <div key={index} className="mb-12 mt-6">
              <picture>
                <source
                  media="(min-width: 1024px)"
                  srcSet={item.image.desktop.replace("./", "/")}
                />
                <source
                  media="(min-width: 768px)"
                  srcSet={item.image.tablet.replace("./", "/")}
                />
                <img
                  src={item.image.mobile.replace("./", "/")}
                  alt={item.name}
                  className="rounded-lg mb-6"
                  loading="lazy"
                />
              </picture>
              <h3 className="text-2xl font-bold mt-4 mb-6">
                {item.name.toUpperCase()}
              </h3>
              <Link
                to={`/category/${item.slug.split("-").pop() === "speaker" ? "speakers" : item.slug.split("-").pop()}/${item.slug}`}
              >
                <button className="bg-[#D87D4A] text-white py-3 px-6 text-sm font-semibold tracking-widest hover:bg-[#FBAF85] transition-all duration-300 cursor-pointer">
                  SEE PRODUCT
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <CategoriesGrid />
      <Footer />
    </div>
  );
};

export default DetailsPage;
