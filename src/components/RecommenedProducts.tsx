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
import Loader from "./Loader";

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

  if (isLoading) {
    return <Loader />;
  }

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
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="h-[360px] w-[100%] flex overflow-x-scroll scrollbar-hide snap-scroll"
      >
        {products?.map((item: ProductNode) => (
          <div
            key={item.handle}
            className="flex flex-col items-center justify-evenly snap-start"
          >
            <Link
              href={`/yourwatch/${item.handle}`}
              className="h-[250px] w-[45vw] md:w-[25vw] lg:h-[270px] relative"
            >
              <Image
                src={item.images.edges[0].node.url}
                alt={item.title}
                fill
                className="object-contain"
              />
            </Link>
            <span className="w-[90%] text-center uppercase font-[300] text-xs 4xl:text-sm">
              {item.title}
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
            className="bg-[#f2f2f2] border-none p-2 lg:p-3 flex items-center justify-center btn-secondary cursor-pointer"
            disabled={isAtStart}
          >
            <ArrowBackIosNewOutlined className="text-lg" />
          </button>
          <button
            onClick={() => scrollSlider(1)}
            className="bg-[#f2f2f2] border-none p-2 lg:p-3 flex items-center justify-center btn-secondary cursor-pointer"
            disabled={isAtEnd}
          >
            <ArrowForwardIosOutlined className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecommenedProducts;
