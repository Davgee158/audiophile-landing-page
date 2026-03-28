import Navigation from "../components/Navigation";
import CategoriesGrid from "../components/CategoriesGrid";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen ">
      <div className="bg-[url(/assets/home/mobile/image-header.jpg)] md:bg-[url(/assets/home/tablet/image-header.jpg)] lg:bg-[url(/assets/home/desktop/image-hero.jpg)] bg-cover bg-no-repeat bg-center pt-[190px] md:pt-[200px] h-[630px] md:h-[700px] text-white text-center px-4">
        <Navigation />
        <div className="text-white text-center lg:text-left px-6 lg:px-24 ">
          <h3
            className="font-extralight tracking-[0.5em] mb-4"
            style={{ color: "#F1F1F1" }}
          >
            NEW PRODUCT
          </h3>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            XX99 MARKII <br />
            HEADPHONES
          </h2>
          <p
            className="px-4 md:px-48 lg:px-0 lg:w-[370px] mb-6"
            style={{ color: "#F1F1F1" }}
          >
            Experience natural lifelike audio and exceptional build quality made
            for passionate music enthusiast.
          </p>
          <Link to="/category/headphones/xx99-mark-two-headphones">
            <button className="bg-[#D47D4A] text-white border-none text-sm font-semibold tracking-wider py-3 md:py-4 px-6 md:px-8 mt-4 transition-all duration-300 hover:bg-[#FBAF85] cursor-pointer">
              SEE PRODUCT
            </button>
          </Link>
        </div>
      </div>

      <CategoriesGrid />

      <div className="bg-[url(/assets/home/desktop/pattern-circles.svg)] bg-[#D47D4A] bg-size-[630px] md:bg-size-[900px] lg:bg-size-[800px]  h-[590px] md:h-[720px] lg:h-[600px] xl:h-[650px] [background-position:center_330%] md:[background-position:center_140%] lg:[background-position:left_0%]  bg-no-repeat mx-8 md:mx-12 lg:mx-24 pt-18  text-center lg:text-left text-white rounded-xl mb-8 overflow-hidden lg:relative lg:flex l ">
        <div className="flex justify-center lg:absolute lg:-bottom-5  lg:w-3/5 lg:h-full lg:items-end">
          <picture>
            <source
              media="(min-width: 1024px)"
              srcSet="/assets/home/desktop/image-speaker-zx9.png"
            />
            <source
              media="(min-width: 768px)"
              srcSet="/assets/home/tablet/image-speaker-zx9.png"
            />
            <img
              src="/assets/home/mobile/image-speaker-zx9.png"
              alt="speaker"
              className="w-42 md:w-48 mb-8 lg:mb-0 lg:w-108  "
            />
          </picture>
        </div>
        <div className="lg:w-[45%] lg:ml-auto lg:px-16">
          <h2 className="text-4xl md:text-6xl font-semibold lg:font-bold mb-4 md:mb-8 md:mt-8 xl:mt-18  ">
            ZX9
            <br />
            SPEAKER
          </h2>
          <p
            className="text-sm/6 font-extralight tracking-wider px-4 md:px-48 lg:px-0 lg:w-[350px] mb-6"
            style={{ color: "#F1F1F1" }}
          >
            Upgrade to premium speakers that are phenomenally built to deliver
            truly remarkable sound.
          </p>
          <Link to="/category/speakers/zx9-speaker">
            <button className="py-3 px-8 bg-black my-5 text-sm font-semibold tracking-wider hover:bg-gray-600 transition-all duration-300 cursor-pointer">
              SEE PRODUCT
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-[url(/assets/home/mobile/image-speaker-zx7.jpg)] md:bg-[url(/assets/home/tablet/image-speaker-zx7.jpg)] lg:bg-[url(/assets/home/desktop/image-speaker-zx7.jpg)] bg-cover bg-no-repeat bg-center h-[320px] mx-8 md:mx-12 lg:mx-24 mb-8 rounded-xl py-[25%] md:py-[15%] px-6 md:px-12">
        <h2 className="text-3xl font-semibold md:font-bold tracking-wider">
          ZX7 SPEAKER
        </h2>
        <Link to="/category/speakers/zx7-speaker">
          <button className="py-3 px-8 my-5 text-sm font-semibold border border-black tracking-wider hover:bg-[#101010] hover:text-white transition-all duration-300 cursor-pointer">
            SEE PRODUCT
          </button>
        </Link>
      </div>

      <div className="mb-6 md:grid grid-cols-2 auto-rows-2fr md:mx-12 lg:mx-24 md:gap-3 lg:gap-6 md:h-[300px]">
        <div className="bg-[url(/assets/home/mobile/image-earphones-yx1.jpg)] md:bg-[url(/assets/home/tablet/image-earphones-yx1.jpg)] lg:bg-[url(/assets/home/desktop/image-earphones-yx1.jpg)] bg-cover bg-no-repeat bg-center h-[200px] md:h-full md:w-full mx-8 md:mx-0 mb-8 rounded-xl"></div>
        <div
          style={{ backgroundColor: "#f1f1f1" }}
          className="mx-8 md:mx-0 rounded-xl p-8 md:pt-[25%] md:px-10"
        >
          <h2 className="text-3xl font-semibold md:font-bold tracking-wider mb-4">
            YX1 EARPHONES
          </h2>
          <Link to="/category/earphones/yx1-earphones">
            <button className="py-3 px-8 my-5 text-sm font-semibold border border-black tracking-wider hover:bg-[#101010] hover:text-white transition-all duration-300 cursor-pointer">
              SEE PRODUCT
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
