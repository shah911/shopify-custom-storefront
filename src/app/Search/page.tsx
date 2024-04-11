"use client";
import React, { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import gql from "graphql-tag";
import { print } from "graphql";
import { storeFront } from "../../../utils";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/Loader";
import ErrPage from "@/components/ErrPage";
import { motion } from "framer-motion";
import NoProducts from "@/components/NoProducts";

type ProductNode = {
  handle: string;
  title: string;
  tags: string[];
  images: {
    edges: {
      node: {
        url: string;
      };
    }[];
  };
};

type ProductEdge = {
  node: ProductNode;
};

type PageInfo = {
  endCursor: string;
  hasNextPage: boolean;
};

type Products = {
  edges: ProductEdge[];
  pageInfo: PageInfo;
};

type Data = {
  products: Products;
};

type SearchProps = {
  searchParams: {
    query: string;
  };
};

const Query = gql`
  query Products($productQuery: String!, $cursor: String) {
    products(first: 3, query: $productQuery, after: $cursor) {
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
        endCursor
        hasNextPage
      }
    }
  }
`;

function Search({ searchParams }: SearchProps) {
  const { query } = searchParams;
  const fetchProducts = async ({ pageParam = null }) => {
    const { data, errors } = await storeFront(print(Query), {
      productQuery: query,
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
  } = useInfiniteQuery(["products", query], fetchProducts, {
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

  if (isLoading) {
    return (
      <div className="h-[100vh] w-[100%] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (
    (data?.pages.length === 1 && data.pages[0].products.edges.length === 0) ||
    !query
  ) {
    return <NoProducts query={query} />;
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center justify-center gap-4 py-10">
        {data?.pages.map((page, i) =>
          page.products.edges.map((product: ProductEdge) => (
            <Link
              href={`/yourwatch/${product.node.handle}`}
              key={product.node.handle}
            >
              <motion.div
                className="h-[600px] w-[90vw] md:w-[45vw] lg:w-[30vw] 2xl:h-[700px] 2xl:w-[25vw] 4xl:w-[20vw]"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.5, delay: i * 0.05 },
                }}
              >
                <div className="flex-[1] w-[100%] h-[50%] relative bg-[#f2f2f2]">
                  <Image
                    src={product.node.images.edges[0].node.url}
                    alt={product.node.handle}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-[1] flex flex-col items-center justify-center gap-4 w-[100%] h-[50%] bg-[#f2f2f247]">
                  <span className="text-base uppercase font-[500] text-[#555555]">
                    {product.node.tags[1]}
                  </span>
                  <span className="text-sm text-center w-[90%]">
                    {product.node.title}
                  </span>
                  <button className="btn">See more</button>
                </div>
              </motion.div>
            </Link>
          ))
        )}
      </div>
      {hasNextPage && (
        <div ref={ref} className="my-8 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default Search;
