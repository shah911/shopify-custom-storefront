"use client";
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import Loader from "./Loader";

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
  collections: {
    edges: {
      node: {
        description: string;
        products: {
          edges: ProductNode[];
        };
      };
    }[];
  };
};

type Props = {
  title: string;
  ProductsList: ProductsListType;
};

function ProductsSlider({ title, ProductsList }: Props) {
  const [show, setShow] = useState(false);
  const [desc, setDesc] = useState(false);
  const [maxChars, setMaxChars] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateMaxChars = () => {
      const descriptionLength =
        ProductsList?.collections.edges[0].node.description.length;
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
    };

    updateMaxChars();

    window.addEventListener("resize", updateMaxChars);

    return () => window.removeEventListener("resize", updateMaxChars);
  }, []);

  const Products = ProductsList?.collections.edges[0].node.products;

  const swiperRef = useRef<SwiperRef>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // setIsLoading(false);
    const swiperInstance = swiperRef.current?.swiper;

    const updateNavButtons = () => {
      if (swiperInstance) {
        setIsBeginning(swiperInstance.isBeginning);
        setIsEnd(swiperInstance.isEnd);
      }
    };

    const updateProgress = () => {
      if (swiperInstance) {
        const currentSlide = swiperInstance.activeIndex;
        const totalSlides = swiperInstance.slides.length;

        // Calculate the fixed 25% width per slide progress
        const totalVisibleSlides = Number(swiperInstance.params.slidesPerView);
        const translateX =
          (currentSlide / (totalSlides - totalVisibleSlides)) * 75;
        setProgress(translateX);
      }
    };

    const updateProgressWhileDragging = () => {
      if (swiperInstance) {
        // Use Swiper's progress directly for smoother dragging
        const progress = swiperInstance.progress; // Value from 0 to 1
        const translateX = progress * 75; // Fixed 75% movement range for the bar
        if (progress < 0) {
          setProgress(0);
        } else if (progress > 1) {
          setProgress(75);
        } else {
          setProgress(translateX);
        }
      }
    };

    if (swiperInstance) {
      swiperInstance.on("slideChange", updateNavButtons);
      swiperInstance.on("slideChange", updateProgress);

      // Add the real-time progress update on dragging
      swiperInstance.on("progress", updateProgressWhileDragging);

      updateNavButtons();
    }

    return () => {
      if (swiperInstance) {
        swiperInstance.off("slideChange", updateNavButtons);
        swiperInstance.off("slideChange", updateProgress);
        swiperInstance.off("progress", updateProgressWhileDragging);
      }
    };
  }, []);

  // if (isLoading) {
  //   return (
  //     <div className="h-screen flex items-center justify-center">
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <div className="h-[840px] 2xl:h-[960px] flex flex-col items-center justify-evenly">
      <div className="flex flex-col items-center justify-center gap-6 2xl:gap-12">
        <h1 className="uppercase text-center text-[#c40d2e] text-3xl lg:text-[42px] 2xl:text-[52px] font-[300] tracking-[3px]">
          {title.replace(/\+/g, " ")}
        </h1>

        <div className="flex flex-col items-center gap-4">
          <p className="text-sm 2xl:text-base text-center text-[#555555] font-[300] mx-auto w-[90%]">
            {show
              ? `${ProductsList?.collections.edges[0].node.description.substring(
                  0,
                  maxChars
                )}...`
              : ProductsList?.collections?.edges[0].node.description}
          </p>
          {desc && (
            <button onClick={() => setShow(!show)} className="btn">
              {show ? "Read more" : "Show less"}
            </button>
          )}
        </div>
      </div>
      <hr className="w-[90%]" />
      <div className="flex w-full">
        <Swiper
          ref={swiperRef}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          modules={[Navigation]}
          speed={1000}
          breakpoints={{
            380: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {Products?.edges.map((item, i) => (
            <SwiperSlide key={i}>
              <div className="h-[400px] flex flex-col items-center justify-evenly snap-start">
                <Link
                  href={`/yourwatch/${item.node.handle}`}
                  className="p-4 h-[270px] w-[50vw] md:w-[33.33vw] lg:w-[25vw] relative"
                >
                  <Image
                    src={item.node.images.edges[0]?.node?.url}
                    alt={item.node.handle}
                    fill
                    className="object-contain"
                  />
                </Link>
                <span className="w-[80%] text-center uppercase font-[300] text-xs 2xl:text-sm">
                  {item.node.title}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="flex items-center justify-center gap-4 w-[90vw]">
        <div className="h-[5px] w-[90%] bg-[#f2f2f2] overflow-hidden relative">
          <motion.div
            animate={{
              left: progress + "%",
              transition: { duration: 1, ease: [0.645, 0.075, 0.275, 0.995] },
            }}
            className="h-[5px] w-[25%] bg-[#c40d2e] absolute top-0 left-0"
          ></motion.div>
        </div>
        <div className="flex items-center justify-center gap-[3px]">
          <button
            className="custom-prev bg-[#f2f2f2] border-none p-2 lg:p-3 flex items-center justify-center btn-secondary cursor-pointer"
            disabled={isBeginning}
          >
            <ArrowBackIosNewOutlined className="text-lg" />
          </button>
          <button
            className="custom-next bg-[#f2f2f2] border-none p-2 lg:p-3 flex items-center justify-center btn-secondary cursor-pointer"
            disabled={isEnd}
          >
            <ArrowForwardIosOutlined className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductsSlider;
