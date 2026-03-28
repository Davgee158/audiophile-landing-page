import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import CategoriesGrid from "../components/CategoriesGrid";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import Spinner from "../components/Spinner";

const CategoryPage = () => {
  const { type } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null);
        const { data: products, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("category", type);
        if (!fetchError) {
          setProducts(products.reverse());
        } else {
          setError("Failed to load products. Please try again.");
        }
      } catch (err: any) {
        setError(
          "Network error loading products. Please check your connection.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [type]);

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
          <Link to="/">
            <button className="bg-[#D87D4A] text-white px-8 py-3 rounded">
              Go Home
            </button>
          </Link>
        </div>
      </div>
    );
  }
  if (products.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ paddingTop: "64px" }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p>Please select from: headphones, speakers, earphones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-black text-center mb-12 md:mb-24 pt-28 pb-10 md:pb-20 md:pt-38">
        <Navigation />
        <h1 className="text-white font-bold text-3xl md:text-4xl tracking-[0.1em]">
          {type?.toLocaleUpperCase()}
        </h1>
      </div>

      <div className="mx-6 md:mx-12 lg:mx-24 ">
        {products.map((product, index) => (
          <div
            key={index}
            className={`text-center lg:text-left mb-24 last:mb-32 lg:flex lg:items-center lg:gap-24 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
          >
            <picture>
              <source
                media="(min-width: 1024px)"
                srcSet={product.category_image.desktop.replace("./", "/")}
              />
              <source
                media="(min-width: 768px)"
                srcSet={product.category_image.tablet.replace("./", "/")}
              />
              <img
                src={product.category_image.mobile.replace("./", "/")}
                alt={product.name}
                className="rounded-lg mb-6 md:mb-12"
                loading="lazy"
              />
            </picture>

            <div>
              {product.new && (
                <h3
                  style={{ color: "#D87D4A" }}
                  className="font-light text-sm tracking-[0.5em] mb-6"
                >
                  NEW PRODUCT
                </h3>
              )}
              <h2 className="font-bold text-3xl/10 md:text-4xl mb-6 mx-8 md:mx-48 lg:mx-0">
                {product.name.toLocaleUpperCase()}
              </h2>
              <p className="opacity-50 mb-8 text-base/7 md:mx-16  lg:mx-0">
                {product.description}
              </p>
              <Link to={`/category/${type}/${product.slug}`}>
                <button className="bg-[#D87D4A] text-white text-sm tracking-[0.1em] py-3 px-8 hover:bg-[#FBAF85] transition-all duration-300 cursor-pointer">
                  SEE PRODUCT
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <CategoriesGrid />
      <Footer />
    </div>
  );
};

export default CategoryPage;
