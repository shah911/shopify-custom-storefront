"use client";
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import Loader from "./Loader";
import ErrPage from "./ErrPage";
import { AnimatePresence, motion } from "framer-motion";

type ImageNode = {
  node: {
    url: string;
  };
};

type ProductNode = {
  node: {
    handle: string;
    title: string;
    images: {
      edges: ImageNode[];
    };
  };
};

type ProductsListType = {
  edges: {
    node: {
      description: string;
      products: {
        edges: ProductNode[];
      };
    };
  }[];
};

type Props = {
  title: string;
  ProductsList: ProductsListType;
};

const accordian = {
  initial: {
    //height: 0,
    opacity: 0,
  },
  animate: {
    //height: "auto",
    opacity: 1,
    transition: { type: "tween", duration: 0.5 },
  },
  exit: {
    //height: 0,
    opacity: 0,
    transition: { type: "tween", duration: 0.5 },
  },
};

function ProductsSlider({ title, ProductsList }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [show, setShow] = useState(false);
  const [desc, setDesc] = useState(false);
  const [loading, setLoading] = useState(true);
  const [maxChars, setMaxChars] = useState(0);

  const scrollSlider = (direction: number) => {
    if (sliderRef.current) {
      const offsetWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollBy({
        left: direction * offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current && progressBarRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const maxScrollLeft =
        sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
      const left = `${(scrollLeft / maxScrollLeft) * 75}%`;
      progressBarRef.current.style.left = left;

      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft >= maxScrollLeft - 5);
    }
  };

  useEffect(() => {
    handleScroll();
  }, []);

  useEffect(() => {
    const updateMaxChars = () => {
      const descriptionLength = ProductsList?.edges[0].node.description.length;
      const viewportWidth = window.innerWidth;

      const maxChars = Math.floor(viewportWidth / 3);

      if (descriptionLength > maxChars) {
        setShow(true);
        setDesc(true);
        setMaxChars(maxChars);
      } else if (descriptionLength <= maxChars) {
        setShow(false);
        setDesc(false);
        setMaxChars(descriptionLength);
      }
      setLoading(false);
    };

    updateMaxChars();

    window.addEventListener("resize", updateMaxChars);

    return () => window.removeEventListener("resize", updateMaxChars);
  }, []);

  const Products = ProductsList?.edges[0].node.products;

  return !ProductsList ? (
    <ErrPage />
  ) : (
    <div className="h-[840px] flex flex-col items-center justify-evenly">
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="uppercase text-center text-[#c40d2e] text-3xl lg:text-[42px] font-[300] tracking-[3px]">
          {title}
        </h1>
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-center text-[#555555] font-[300] mx-auto w-[90%]">
              {show
                ? `${ProductsList?.edges[0].node.description.substring(
                    0,
                    maxChars
                  )}...`
                : ProductsList?.edges[0].node.description}
            </p>
            {desc && (
              <button onClick={() => setShow(!show)} className="btn">
                {show ? "Read more" : "Show less"}
              </button>
            )}
          </div>
        )}
      </div>
      <hr className="w-[90%]" />
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="w-[100%] flex overflow-x-scroll scrollbar-hide snap-scroll"
      >
        {Products?.edges.map((item: ProductNode) => (
          <div
            key={item.node.handle}
            className="h-[400px] flex flex-col items-center justify-evenly snap-start"
          >
            <Link
              href={`/yourwatch/${item.node.handle}`}
              className="p-4 h-[350px] lg:h-[270px] w-[50vw] md:w-[33.33vw] lg:w-[25vw] 2xl:w-[20vw] relative"
            >
              <Image
                src={item.node.images.edges[0]?.node?.url}
                alt={item.node.handle}
                fill
                className="object-contain"
              />
            </Link>
            <span className="w-[80%] text-center uppercase font-[300] text-xs">
              {item.node.title}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 w-[90vw]">
        <div className="h-[5px] w-[90%] bg-[#f2f2f2] relative">
          <div
            className="h-[5px] w-[25%] bg-[#c40d2e] absolute top-0 left-0"
            ref={progressBarRef}
          ></div>
        </div>
        <div className="flex items-center justify-center gap-[3px]">
          <button
            onClick={() => scrollSlider(-1)}
            className="bg-[#f2f2f2] border-none p-3 flex items-center justify-center btn-secondary cursor-pointer"
            disabled={isAtStart}
          >
            <ArrowBackIosNewOutlined className="text-lg" />
          </button>
          <button
            onClick={() => scrollSlider(1)}
            className="bg-[#f2f2f2] border-none p-3 flex items-center justify-center btn-secondary cursor-pointer"
            disabled={isAtEnd}
          >
            <ArrowForwardIosOutlined className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductsSlider;
