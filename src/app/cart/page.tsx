"use client";
import { CloseOutlined } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState } from "react";
import gql from "graphql-tag";
import { print } from "graphql";
import { formatToCurrency, storeFront } from "../../../utils";
import Loader from "@/components/Loader";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { useQuery, useMutation, useQueryClient } from "react-query";
import ErrPage from "@/components/ErrPage";
import { CartItemsContext } from "@/LockContext/TotalCartIItems";
import { useRouter } from "next/navigation";

type ProductVariant = {
  id: string;
  title: string;
  selectedOptions: {
    name: string;
    value: string;
  }[];
};

type CartItem = {
  node: {
    id: string;
    quantity: number;
    merchandise: {
      product: {
        images: {
          edges: {
            node: {
              url: string;
            };
          }[];
        };
        title: string;
        tags: string[];
        variants: {
          edges: {
            node: ProductVariant;
          }[];
        };
        priceRange: {
          minVariantPrice: {
            amount: number;
            currencyCode: string;
          };
        };
      };
    };
  };
};

type CartData = {
  lines: {
    edges: CartItem[];
  };
  cost: {
    subtotalAmount: {
      amount: number;
    };
    totalTaxAmount: {
      amount: number;
    };
    totalAmount: {
      amount: number;
    };
  };
};

const removeItemFromCart = gql`
  mutation removeCartLines($cartId: ID!, $cartLineId: ID!) {
    cartLinesRemove(cartId: $cartId, lineIds: [$cartLineId]) {
      cart {
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const getCartQuery = gql`
  query getCart($ID: ID!) {
    cart(id: $ID) {
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
      totalQuantity
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                product {
                  title
                  tags
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  variants(first: 1) {
                    edges {
                      node {
                        selectedOptions {
                          value
                        }
                      }
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
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
  }
`;

const removeAllCartItemsMutation = gql`
  mutation removeCartLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        totalQuantity
        cost {
          subtotalAmount {
            amount
          }
          totalAmount {
            amount
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

function Cart() {
  const [removingItem, setRemovingItem] = useState(false);
  const [errMsg, setErrMsg] = useState<undefined | string>();
  const [err, setErr] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setTotalQuantity } = useContext(CartItemsContext);

  const cartId = Cookies.get("cartID");
  const checkoutUrl = Cookies.get("checkoutUrl");

  const fetchProduct = async () => {
    const { data, errors } = await storeFront(print(getCartQuery), {
      ID: cartId,
    });

    if (errors) {
      throw new Error("Failed to fetch products");
    }

    return data;
  };

  const { data, isLoading, error } = useQuery("cartItems", fetchProduct);

  const totalCartLineIDs = data?.cart.lines.edges.map(
    (item: CartItem) => item.node.id
  );

  const emptyCartMutation = useMutation(
    async () => {
      const { data, errors } = await storeFront(
        print(removeAllCartItemsMutation),
        {
          cartId: cartId,
          lineIds: totalCartLineIDs,
        }
      );
      if (errors || data?.cartLinesRemove?.userErrors.length) {
        throw new Error(
          data?.cartLinesRemove?.userErrors[0]?.message ||
            "Error removing items"
        );
      }

      return data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch the cart query
        queryClient.invalidateQueries("cartItems");
        setTotalQuantity(0);
        setErr(true);
        setErrMsg("Successfully removed all item from the cart.");
        setRemovingItem(false);
      },
      onError: () => {
        setErr(true);
        setErrMsg("Something went wrong while emptying the cart.");
        setRemovingItem(false);
      },
    }
  );

  const removeItemMutation = useMutation(
    async (id: string) => {
      const { data, errors } = await storeFront(print(removeItemFromCart), {
        cartId: cartId,
        cartLineId: id,
      });
      if (errors || data?.cartLinesRemove?.userErrors.length) {
        throw new Error(
          data?.cartLinesRemove?.userErrors[0]?.message ||
            "Error removing items"
        );
      }
      return data;
    },
    {
      onSuccess: (data) => {
        // Invalidate and refetch the cart query
        queryClient.invalidateQueries("cartItems");
        setTotalQuantity(data?.cartLinesRemove?.cart?.totalQuantity);
        setErr(true);
        setErrMsg("Successfully removed item from the cart.");
        setRemovingItem(false);
      },
      onError: () => {
        setErr(true);
        setErrMsg("Something went wrong while removing this cart item");
        setRemovingItem(false);
      },
    }
  );

  const removeItem = (id: string) => {
    setRemovingItem(true);
    removeItemMutation.mutate(id);
  };

  if (error) {
    return <ErrPage />;
  }

  return isLoading ? (
    <div className="h-[100vh] flex items-center justify-center">
      <Loader />
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <div
        className={`h-[100vh] w-[100%] flex items-center justify-center fixed top-0 bg-[rgba(255,255,255,.5)] 
         ${removingItem ? "opacity-[1] z-10" : "opacity-0 z-[-10]"}
        `}
      >
        <Loader />
      </div>
      <AnimatePresence mode="wait">
        {err && (
          <motion.div
            className="absolute flex items-center justify-center gap-2 top-[20%] bg-black py-1 px-2 rounded-xl z-10"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: "100%", opacity: 1, transition: { type: "tween" } }}
            exit={{ y: 0, opacity: 0, transition: { type: "tween" } }}
          >
            <span className="text-white text-xs text-center font-[300] capitalize">
              {errMsg}
            </span>
            <CloseOutlined
              className="text-white cursor-pointer"
              onClick={() => setErr(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {data?.cart.lines?.edges.length > 0 ? (
        <div className="lg:h-[auto] flex items-center justify-center py-14">
          <div className="h-[85%] w-[95vw] mx-auto flex flex-col lg:flex-row">
            <div className="flex-[3]">
              <div className="flex items-center justify-between">
                <h1 className="uppercase font-[300] text-4xl text-[#c40d2e] tracking-[3px]">
                  my cart
                </h1>
                <button
                  onClick={() => {
                    setRemovingItem(true);
                    emptyCartMutation.mutate();
                  }}
                  className="btn-secondary cursor-pointer p-3 border border-black"
                >
                  empty cart
                </button>
              </div>
              {data?.cart.lines.edges?.map((item: CartItem, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between h-[220px] lg:w-[75%] 2xl:w-[80%] 2xl:h-[300px] w-[100%] my-10"
                >
                  {/* ProductImg */}
                  <div className="relative h-[100%] flex-[1.2] 2xl:flex-[1] bg-[#f2f2f2]">
                    <Image
                      src={
                        item.node.merchandise.product.images.edges[0].node.url
                      }
                      alt={item.node.merchandise.product.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {/* Details */}
                  <div className="flex-[2] h-[100%] flex flex-col pl-5 md:pl-10 gap-4">
                    <span className="text-xs md:text-base font-[300]">
                      {item.node.merchandise.product.tags[0]}
                    </span>
                    <span className="text-xs md:text-sm font-[500]">
                      {item.node.merchandise.product.title}
                    </span>
                    {item.node.merchandise.product.variants.edges[0].node.selectedOptions.map(
                      (option, i: number) => (
                        <span key={i} className="text-xs md:text-sm font-[300]">
                          {option.value === "Default Title" ? "" : option.value}
                        </span>
                      )
                    )}
                    <span className="text-xs md:text-sm font-bold">
                      {formatToCurrency(
                        item.node.merchandise.product.priceRange.minVariantPrice
                          .amount
                      )}{" "}
                      {
                        item.node.merchandise.product.priceRange.minVariantPrice
                          .currencyCode
                      }
                    </span>
                  </div>
                  <div className="flex-[0.1] md:flex-[1] h-[100%] items-end justify-between flex flex-col">
                    <button
                      onClick={() => {
                        removeItem(item.node.id);
                      }}
                      className="btn uppercase text-sm font-[500] hidden md:flex"
                    >
                      remove
                    </button>
                    <button
                      onClick={() => removeItem(item.node.id)}
                      className="flex md:hidden"
                    >
                      <CloseOutlined />
                    </button>
                    <span className="text-base font-semibold">
                      {item.node.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-[1] flex flex-col gap-5 items-center lg:justify-start justify-center py-[40.5px] border border-black rounded-lg lg:border-none">
              <div className="flex flex-col gap-5">
                <h1 className="uppercase font-[300] text-3xl text-[#c40d2e] tracking-[3px]">
                  order now
                </h1>
                <span className="text-base font-[300]">
                  Sub-Total :{" "}
                  {formatToCurrency(data?.cart?.cost?.subtotalAmount?.amount)}{" "}
                  {data?.cart?.cost?.subtotalAmount?.currencyCode}
                </span>
                <span className="text-base font-[300]">
                  Total :{" "}
                  {formatToCurrency(data?.cart?.cost?.totalAmount?.amount)}{" "}
                  {data?.cart?.cost?.totalAmount?.currencyCode}
                </span>

                {checkoutUrl && (
                  <button
                    onClick={() => {
                      console.log("using router.prefetch");
                      router.prefetch(checkoutUrl);
                    }}
                    className="btn-secondary z-10 uppercase border border-gray-400 text-lg px-6 py-2"
                  >
                    checkout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[100vh] flex flex-col items-center justify-center gap-3">
          <span className="text-base font-[300]">
            Your shopping bag is currently empty.
          </span>
          <Link href="/">
            <button className="btn-secondary uppercase border border-gray-400 text-lg px-6 py-2">
              Keep shopping
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;
