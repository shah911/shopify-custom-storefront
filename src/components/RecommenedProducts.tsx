"use client";
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import gql from "graphql-tag";
import { print } from "graphql";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { storeFront } from "../../utils";
import { useQuery } from "react-query";
// import Loader from "./Loader";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "framer-motion";

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
  productId: string;
  //products: ProductNode[];
};

const RelatedProducts = gql`
  query relatedProducts($productId: ID!) {
    productRecommendations(productId: $productId, intent: RELATED) {
      handle
      title
      images(first: 1) {
        edges {
          node {
            url
          }
        }
      }
    }
  }
`;

function RecommenedProducts({ title, productId }: RecommenedProductsProps) {
  const swiperRef = useRef<SwiperRef>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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

  const fetchProducts = async () => {
    const { data, errors } = await storeFront(print(RelatedProducts), {
      productId: productId,
    });

    if (errors) {
      throw new Error("Failed to fetch products");
    }

    return data;
  };

  const { data, isLoading, error } = useQuery(productId, fetchProducts, {
    staleTime: 60000,
  });

  const products = data?.productRecommendations;

  // if (isLoading) {
  //   return <Loader />;
  // }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <p className="text-sm font-[300]">
          Sorry, something went wrong while fetching the recommended products.
        </p>
        <button
          className="btn"
          onClick={() => {
            window.location.reload();
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-[90vw] md:w-[75vw] 2xl:h-[768px] mx-auto  flex flex-col items-center justify-evenly  relative">
      <h1 className="uppercase text-center text-[#c40d2e] text-3xl lg:text-[42px] 4xl:text-5xl font-[300] tracking-[3px]">
        {title}
      </h1>
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
            350: { slidesPerView: 2 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3 },
          }}
        >
          {products?.map((item: ProductNode, i: number) => (
            <SwiperSlide key={i}>
              <div className="h-[400px] flex flex-col items-center justify-evenly snap-start">
                <Link
                  href={`/yourwatch/${item.handle}`}
                  className="p-4 h-[270px] w-[50vw] md:w-[33.33vw] lg:w-[25vw] relative"
                >
                  <Image
                    src={item.images.edges[0]?.node?.url}
                    alt={item.handle}
                    fill
                    priority={true}
                    className="object-contain"
                  />
                </Link>
                <span className="w-[80%] text-center uppercase font-[300] text-xs 2xl:text-sm">
                  {item.title}
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

export default RecommenedProducts;
