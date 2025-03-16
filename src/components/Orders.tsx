import React, { useEffect } from "react";
import gql from "graphql-tag";
import Image from "next/image";
import { print } from "graphql";
import { readableDate, storeFront } from "../../utils";
import Loader from "./Loader";
import ErrPage from "./ErrPage";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import Cookies from "js-cookie";

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
            financialStatus
            fulfillmentStatus
            id
            shippingAddress {
              name
              phone
              city
            }
            orderNumber
            totalShippingPrice {
              amount
            }
            totalPrice {
              amount
            }
            processedAt
            trackingId: metafield(namespace: "custom", key: "tracking_id") {
              value
            }
            courierService: metafield(
              namespace: "custom"
              key: "courier_service"
            ) {
              value
            }
            trackingUrl: metafield(namespace: "custom", key: "url") {
              value
            }
            currencyCode
            totalPrice {
              amount
            }
            lineItems(first: 10) {
              edges {
                node {
                  quantity
                  title
                  variant {
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
  const customerAccessToken = Cookies.get("customer-access-token");

  const fetchOrders = async ({ pageParam = null }) => {
    const { data, errors } = await storeFront(print(customerOrders), {
      accessToken: customerAccessToken,
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
  } = useInfiniteQuery(["products"], fetchOrders, {
    getNextPageParam: (lastPage) =>
      lastPage?.customer?.orders?.pageInfo.endCursor,
    staleTime: 6000,
  });

  console.log(data);

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
    data?.pages.length === 1 &&
    data?.pages[0].customer?.orders.edges.length === 0
  ) {
    <div className="flex items-center justify-center font-[300]">
      Note: You have not placed any orders yet
    </div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-center flex-wrap">
        {data?.pages.map((page) =>
          page.customer?.orders.edges.map((item: OrderEdge) => (
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

export default Orders;
