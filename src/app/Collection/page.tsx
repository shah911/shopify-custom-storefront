"use client";
import { useState, useEffect, useRef } from "react";
import OptionAccordion from "@/components/OptionAccordion";
import Card from "@/components/Card";
import { option1, option3 } from "@/components/Data";
import Filters from "@/components/Filters";
import SortAccordion from "@/components/SortAccordion";
import { storeFront } from "../../../utils";
import gql from "graphql-tag";
import { print } from "graphql";
import Loader from "@/components/Loader";
import ErrPage from "@/components/ErrPage";
import { motion } from "framer-motion";
import Link from "next/link";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "next/navigation";

type ImageNode = {
  url: string;
};

type ImageEdge = {
  node: ImageNode;
};

type ProductNode = {
  handle: string;
  title: string;
  tags: string[];
  createdAt: string;
  images: {
    edges: ImageEdge[];
  };
};

type ProductEdge = {
  node: ProductNode;
};

type PageInfo = {
  hasNextPage: boolean;
  endCursor: string;
};

type Products = {
  edges: ProductEdge[];
  pageInfo: PageInfo;
};

type Data = {
  products: Products;
};

type FetchDataResponse = {
  data: Data;
};

type ProductList = ProductEdge[];

const productQuery = gql`
  query Products(
    $tag: String!
    $cursor: String
    $sortKeyValue: ProductSortKeys
    $sortOrder: Boolean
  ) {
    products(
      first: 6
      query: $tag
      after: $cursor
      sortKey: $sortKeyValue
      reverse: $sortOrder
    ) {
      edges {
        node {
          handle
          title
          tags
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

function ProductCollection() {
  const searchParam = useSearchParams();
  const q = searchParam.get("q");
  const sortKey = searchParam.get("sortKey");

  const fetchProducts = async ({ pageParam = null }) => {
    const { data, errors } = await storeFront(print(productQuery), {
      tag: `tag:${!q ? "watches" : q}`,
      sortKeyValue: sortKey,
      sortOrder: !sortKey ? false : true,
      cursor: pageParam,
    });

    if (errors) {
      throw new Error("Failed to fetch products");
    }

    return data;
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(["watches", q, sortKey], fetchProducts, {
    getNextPageParam: (lastPage) => lastPage?.products?.pageInfo.endCursor,
    staleTime: 6000,
  });

  const { ref, inView } = useInView({
    threshold: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    return <ErrPage />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`h-[100vh] w-[100%] flex items-center justify-center fixed top-0 bg-[rgba(255,255,255,.5)] ${
          isLoading ? "opacity-[1] z-30 lg:z-[1]" : "opacity-0 z-[-1]"
        }`}
      >
        <Loader />
      </div>
      <h1 className="uppercase md:text-4xl text-2xl font-[300] tracking-[6px] py-10">
        Watch finder
      </h1>
      <div className="h-6">
        {q || sortKey ? (
          <div className="flex justify-end">
            <Link href="/Collection">
              <button className="btn h-6 font-[200] text-sm">Reset</button>
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>
      <Filters notWatches={false} />

      <div className="flex w-[100vw] lg:w-[95vw]">
        <div className="lg:flex-[1] hidden md:block md:flex-[1.5]">
          <div className="p-5 flex flex-col justify-center gap-8 pt-10">
            <OptionAccordion accessories={false} data={option1} />
            <SortAccordion onAccessories={false} data={option3} />
          </div>
        </div>
        <div className="flex-[3] flex flex-col">
          <div className="min-h-[100vh] flex flex-wrap items-center justify-center">
            {data?.pages.map((page, i) =>
              page.products.edges.map((item: ProductEdge) => (
                <motion.div
                  key={item.node.handle}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.5, delay: i * 0.05 },
                  }}
                >
                  <Card item={item} accessories={false} />
                </motion.div>
              ))
            )}
          </div>
          {hasNextPage && (
            <div ref={ref} className="my-8 flex items-center justify-center">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCollection;
