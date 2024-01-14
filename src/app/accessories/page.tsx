"use client";
import { useState, useEffect, useRef } from "react";
import OptionAccordion from "@/components/OptionAccordion";
import Card from "@/components/Card";
import { option3, option4 } from "@/components/Data";
import Filters from "@/components/Filters";
import SortAccordion from "@/components/SortAccordion";
import { storeFront } from "../../../utils";
import gql from "graphql-tag";
import { print } from "graphql";
import Loader from "@/components/Loader";
import ErrPage from "@/components/ErrPage";
import { motion } from "framer-motion";

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
  const [ProductsList, setProductsList] = useState<ProductList | []>([]);
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [nextPage, setNextPage] = useState<boolean | undefined>();
  const [endCursor, setEndCursor] = useState<string | undefined>();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [productSort, setProductSort] = useState<undefined | string>(undefined);
  const [option, setOption] = useState<undefined | number>();
  const [sort, setSort] = useState<undefined | number>();

  const loadInitialData = async () => {
    setLoading(true);
    const { data, errors } = await storeFront(print(productQuery), {
      tag: `tag:${!selectedOption ? "accessories" : selectedOption}`,
      cursor: null, // Assuming null or some initial value for the initial load
      sortKeyValue: productSort,
      sortOrder: !productSort ? false : true,
    });

    setProductsList(data?.products?.edges);
    setEndCursor(data?.products?.pageInfo.endCursor);
    setNextPage(data?.products?.pageInfo.hasNextPage);
    setLoading(false);
  };

  const loadMoreData = async () => {
    setMoreLoading(true);
    const { data, errors } = await storeFront(print(productQuery), {
      tag: `tag:${!selectedOption ? "accessories" : selectedOption}`,
      cursor: endCursor,
      sortKeyValue: productSort,
      sortOrder: !productSort ? false : true,
    });

    //setProductsList((prev) => [...prev, ...data.products.edges]);
    if (data?.products?.edges) {
      setProductsList((prevProducts) => {
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
    setProductsList([]);
    setEndCursor(undefined);
    loadInitialData();
  }, [productSort, selectedOption]);

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

  return !ProductsList ? (
    <ErrPage />
  ) : (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`h-[100vh] w-[100%] flex items-center justify-center fixed top-0 bg-[rgba(255,255,255,.5)] ${
          loading ? "opacity-[1] z-10" : "opacity-0 z-[-10]"
        }`}
      >
        <Loader />
      </div>
      <h1 className="uppercase md:text-4xl text-2xl font-[300] tracking-[6px] py-10">
        accessories
      </h1>
      <div className="h-6">
        {productSort || selectedOption ? (
          <div className="flex justify-end">
            <button
              className="btn h-6 font-[200] text-sm"
              onClick={() => {
                setProductSort(undefined);
                setSelectedOption(undefined);
                setOption(undefined);
                setSort(undefined);
              }}
            >
              Reset
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
      <Filters
        notWatches={true}
        setProductSort={setProductSort}
        setSelectedOption={setSelectedOption}
        option={option}
        setOption={setOption}
        sort={sort}
        setSort={setSort}
      />
      <div className="flex  w-[100vw] lg:w-[95vw]">
        <div className="lg:flex-[1] hidden md:block md:flex-[1.5]">
          <div className="p-5 flex flex-col justify-center gap-8 pt-10">
            <OptionAccordion
              accessories={false}
              data={option4}
              setSelectedOption={setSelectedOption}
              option={option}
              setOption={setOption}
            />
            <SortAccordion
              data={option3}
              setProductSort={setProductSort}
              sort={sort}
              setSort={setSort}
            />
          </div>
        </div>
        <div className="flex-[3] flex flex-col">
          <div className="flex  flex-wrap items-center justify-center">
            {ProductsList?.map((item, i) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.5, delay: i * 0.05 },
                }}
              >
                <Card item={item} accessories={true} key={item.node.handle} />
              </motion.div>
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
      </div>
    </div>
  );
}

export default ProductCollection;
