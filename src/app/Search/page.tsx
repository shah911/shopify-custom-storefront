"use client";
import React, { useState, useEffect, useRef } from "react";
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
  const [products, setProducts] = useState<ProductEdge[]>([]);
  const [endCursor, setEndCursor] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [nextPage, setNextPage] = useState<boolean | undefined>();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadInitialData = async () => {
    setLoading(true);
    const { data, errors } = await storeFront(print(Query), {
      productQuery: query,
      cursor: null,
    });

    setProducts(data?.products?.edges);
    setEndCursor(data?.products?.pageInfo.endCursor);
    setNextPage(data?.products?.pageInfo.hasNextPage);
    setLoading(false);
  };

  const loadMoreData = async () => {
    setMoreLoading(true);
    const { data, errors } = await storeFront(print(Query), {
      productQuery: query,
      cursor: endCursor,
    });
    // if (data?.products?.edges) {
    //   setProducts((prev) => [...prev, ...data.products.edges]);
    // }

    if (data?.products?.edges) {
      setProducts((prevProducts) => {
        const newProducts = data.products.edges.filter(
          (newProduct: ProductEdge) =>
            !prevProducts?.some(
              (product) => product.node.handle === newProduct.node.handle
            )
        );

        return [...prevProducts, ...newProducts];
      });
    }

    setEndCursor(data?.products?.pageInfo.endCursor);
    setNextPage(data?.products?.pageInfo.hasNextPage);
    setMoreLoading(false);
  };

  useEffect(() => {
    setProducts([]);
    setEndCursor(undefined);
    loadInitialData();
  }, [query]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          if (nextPage) {
            loadMoreData();
          }
        }
      },
      { threshold: 1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [endCursor, nextPage]);

  return loading ? (
    <div className="h-[100vh] flex items-center justify-center">
      <Loader />
    </div>
  ) : products?.length === 0 || !query ? (
    <NoProducts query={query} />
  ) : !products ? (
    <ErrPage />
  ) : (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center justify-center gap-4 py-10">
        {products?.map((product, i) => (
          <Link
            href={`/yourwatch/${product.node.handle}`}
            key={product.node.handle}
          >
            <motion.div
              className="h-[60vh] md:h-[50vh] lg:h-[100vh] w-[90vw] md:w-[45vw] lg:w-[30vw]"
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
        ))}
      </div>
      {moreLoading ? (
        <div className="flex items-center justify-center pb-10">
          <Loader />
        </div>
      ) : (
        <div ref={loadMoreRef}></div>
      )}
    </div>
  );
}

export default Search;
