import React, { useEffect, useRef, useState } from "react";
import gql from "graphql-tag";
import Image from "next/image";
import { print } from "graphql";
import { readableDate, storeFront } from "../../utils";
import Loader from "./Loader";

type OrderVariantImage = {
  url: string;
};

type OrderVariant = {
  image: OrderVariantImage;
  title: string;
};

type OrderLineItemNode = {
  variant: OrderVariant;
  title: string;
};

type OrderLineItemEdge = {
  node: OrderLineItemNode;
};

type OrderTotalPrice = {
  amount: string;
};

type OrderNode = {
  id: string;
  processedAt: string;
  currencyCode: string;
  totalPrice: OrderTotalPrice;
  lineItems: {
    edges: OrderLineItemEdge[];
  };
};

type OrderEdge = {
  node: OrderNode;
};

const customerOrders = gql`
  query getCustomersOrders($accessToken: String!, $cursor: String) {
    customer(customerAccessToken: $accessToken) {
      orders(first: 3, sortKey: PROCESSED_AT, reverse: true, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            processedAt
            currencyCode
            totalPrice {
              amount
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  variant {
                    # id
                    # title
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

function Orders() {
  const [allOrders, setAllOrders] = useState<OrderEdge[] | []>([]);
  const [endCursor, setEndCursor] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState();
  const [nextPage, setNextPage] = useState<boolean | undefined>();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [customerToken, setCustomerToken] = useState();
  //console.log(allOrders);

  const initailCustomerOrders = async () => {
    const customer = window.localStorage.getItem("customer-access-token");
    const customerData = customer ? JSON.parse(customer) : null;
    const customerAccessToken = customerData ? customerData.accessToken : null;
    const { data, errors } = await storeFront(print(customerOrders), {
      accessToken: customerAccessToken,
      cursor: null,
    });
    setCustomerToken(customerAccessToken);
    setAllOrders(data?.customer?.orders?.edges);
    setEndCursor(data?.customer?.orders?.pageInfo.endCursor);
    setNextPage(data?.customer?.orders?.pageInfo.hasNextPage);
    setLoading(false);
  };

  const loadMoreCustomerOrders = async () => {
    // setMoreLoading(true);
    const { data, errors } = await storeFront(print(customerOrders), {
      accessToken: customerToken,
      cursor: endCursor,
    });
    if (data?.customer?.orders) {
      setAllOrders((prev) => [...prev, ...data.customer.orders.edges]);
    }
    setEndCursor(data?.customer?.orders?.pageInfo.endCursor);
    setNextPage(data?.customer?.orders?.pageInfo.hasNextPage);
    // setMoreLoading(false);
  };

  useEffect(() => {
    initailCustomerOrders();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          if (nextPage) {
            loadMoreCustomerOrders();
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
  ) : allOrders?.length === 0 ? (
    <div className="flex items-center justify-center font-[300]">
      Note: You have not placed any orders yet
    </div>
  ) : !allOrders ? (
    <div className="font-[300] text-sm">
      Something went wrong. Please try again later
    </div>
  ) : (
    <div className="flex justify-center flex-wrap">
      {allOrders?.map((item: OrderEdge) => (
        <div
          key={item.node.id}
          className="flex flex-col items-center justify-evenly w-[250px] h-[350px] md:w-[250px] md:h-[350px] lg:w-[300px] lg:h-[400px] p-4"
        >
          <span className="text-xs font-[300]">
            {readableDate(item.node.processedAt)}
          </span>
          <div className="relative w-[90%] h-[75%]">
            <Image
              src={item.node.lineItems.edges[0].node.variant.image.url}
              alt={item.node.lineItems.edges[0].node.title}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xs text-center">
            {item.node.lineItems.edges[0].node.title}
          </span>
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs text-center">
              {item.node.currencyCode}
            </span>
            <span className="text-xs font-bold">
              {item.node.totalPrice.amount}
            </span>
          </div>
        </div>
      ))}
      {moreLoading ? <Loader /> : <div ref={loadMoreRef}></div>}
    </div>
  );
}

export default Orders;
