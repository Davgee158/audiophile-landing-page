import { Link } from "react-router-dom";
import { memo } from "react";

const CategoriesGrid = memo(() => {
  const categories = [
    {
      name: "HEADPHONES",
      image: "/assets/shared/desktop/image-category-thumbnail-headphones.png",
      alt: "Headphone",
    },
    {
      name: "SPEAKERS",
      image: "/assets/shared/desktop/image-category-thumbnail-speakers.png",
      alt: "Speaker",
    },
    {
      name: "EARPHONES",
      image: "/assets/shared/desktop/image-category-thumbnail-earphones.png",
      alt: "Earphone",
    },
  ];

  return (
    <div className="mt-24 lg:my-32 md:my-24 mx-8 md:mx-12 lg:mx-24 md:flex md:justify-around md:gap-4 lg:gap-6 md:items-center">
      {categories.map((category) => (
        <div
          key={category.name}
          className="relative w-full pt-18 rounded-lg pb-6 mb-20 md:mb-0 last:mb-24 md:last:mb-0"
          style={{ backgroundColor: "#f1f1f1" }}
        >
          <img
            src={category.image}
            alt={category.alt}
            className="w-[160px]  absolute top-[-50px] left-1/2 transform -translate-x-1/2"
            loading="lazy"
          />
          <h3 className="font-bold tracking-widest pt-6 pb-3 text-center text-black ">
            {category.name}
          </h3>
          <div className="flex items-center justify-center gap-3 text-center cursor-pointer group">
            <Link to={`/category/${category.name.toLocaleLowerCase()}`}>
              <h4 className="text-sm font-semibold tracking-widest text-gray-600 group-hover:text-[#D87D4A] transition-colors duration-300">
                SHOP
              </h4>
            </Link>
            <span>
              <img
                src="/assets/shared/desktop/icon-arrow-right.svg"
                alt="Right Arrow"
                loading="lazy"
              />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
});

CategoriesGrid.displayName = "CategoriesGrid";

export default CategoriesGrid;
