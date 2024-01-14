"use client";
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

type ProductImage = {
  url: string;
};

type ProductNode = {
  handle: string;
  title: string;
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
};

type RecommenedProductsProps = {
  title: string;
  products: ProductNode[];
};

function RecommenedProducts({ title, products }: RecommenedProductsProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

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

  return (
    <div className="h-[60vh] md:h-[50vh] w-[75vw] mx-auto lg:h-[100vh] flex flex-col items-center justify-evenly  relative">
      <h1 className="uppercase text-center text-[#c40d2e] text-3xl lg:text-[42px] font-[300] tracking-[3px]">
        {title}
      </h1>
      <div className="w-[125%] lg:w-[100%] flex items-center justify-between absolute top-1/2">
        <button
          onClick={() => scrollSlider(-1)}
          className={`bg-[#f2f2f2] border-none p-3 flex items-center justify-center btn-secondary cursor-pointer ${
            isAtStart && "opacity-0 cursor-default"
          }`}
        >
          <ArrowBackIosNewOutlined className="text-lg" />
        </button>
        <button
          onClick={() => scrollSlider(1)}
          className={`bg-[#f2f2f2] border-none p-3 flex items-center justify-center btn-secondary cursor-pointer ${
            isAtEnd && "opacity-0 cursor-default"
          }`}
        >
          <ArrowForwardIosOutlined className="text-lg" />
        </button>
      </div>
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="h-[30vh] lg:h-[60vh] w-[100%] flex overflow-x-scroll scrollbar-hide snap-scroll"
      >
        {products.map((item: ProductNode) => (
          <div
            key={item.handle}
            className="flex flex-col items-center justify-evenly snap-start relative"
          >
            <Link
              href={`/yourwatch/${item.handle}`}
              className="h-[25vh] w-[37.5vw] md:w-[25vw] lg:h-[45vh] relative"
            >
              <Image
                src={item.images.edges[0].node.url}
                alt={item.title}
                fill
                className="object-contain"
              />
            </Link>
            <span className="w-[90%] text-center uppercase font-[300] text-xs">
              {item.title}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 w-[75vw]">
        <div className="h-[5px] w-[90%] bg-[#f2f2f2] relative">
          <div
            className="h-[5px] w-[25%] bg-[#c40d2e] absolute top-0 left-0"
            ref={progressBarRef}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default RecommenedProducts;
