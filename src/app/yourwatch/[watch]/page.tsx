"use client";
import RecommenedProducts from "@/components/RecommenedProducts";
import Image from "next/image";
import { useState, useEffect } from "react";
import gql from "graphql-tag";
import { print } from "graphql";
import { formatUSD, storeFront } from "../../../../utils";
import Loader from "@/components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import ErrPage from "@/components/ErrPage";
import { CloseOutlined } from "@mui/icons-material";
import { useQuery } from "react-query";

type ImageNode = {
  url: string;
};

type ImageEdge = {
  node: ImageNode;
};

type SelectedOption = {
  value: string;
};

type VariantNode = {
  id: string;
  selectedOptions: SelectedOption[];
};

type VariantEdge = {
  node: VariantNode;
};

type MinVariantPrice = {
  amount: string;
};

type PriceRange = {
  minVariantPrice: MinVariantPrice;
};

type SingleProduct = {
  tags: string[];
  title: string;
  variants: {
    edges: VariantEdge[];
  };
  images: {
    edges: ImageEdge[];
  };
  priceRange: PriceRange;
  descriptionHtml: string;
};

type FetchDataResponse = {
  data: {
    productByHandle: SingleProduct;
  };
};

type Params = {
  watch: string;
};

type YourWatchProps = {
  params: Params;
};

type ProductNode = {
  node: {
    handle: string;
    images: {
      edges: Array<{ node: { url: string } }>;
    };
    title: string;
  };
};

const singleProductQuery = gql`
  query singleProduct($handle: String!) {
    product(handle: $handle) {
      id
      tags
      title
      variants(first: 1) {
        edges {
          node {
            id
            selectedOptions {
              value
            }
          }
        }
      }
      images(first: 3) {
        edges {
          node {
            url
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
        }
      }
      descriptionHtml
    }
  }
`;

const createCartInstance = gql`
  mutation cartCreate {
    cartCreate {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const addToCartMutation = gql`
  mutation cartLinesAdd($cartId: ID!, $variantId: ID!) {
    cartLinesAdd(
      cartId: $cartId
      lines: [{ quantity: 1, merchandiseId: $variantId }]
    ) {
      cart {
        cost {
          subtotalAmount {
            amount
          }
          totalTaxAmount {
            amount
          }
          totalAmount {
            amount
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
      userErrors {
        field
        message
      }
    }
  }
`;

const msg = {
  initial: { y: 0, opacity: 0 },
  animate: { y: "100%", opacity: 1, transition: { type: "tween" } },
  exit: { y: 0, opacity: 0, transition: { type: "tween" } },
};

const sideImgs = {
  initial: { opacity: 0, y: 100 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      duration: 0.5,
      delay: i * 0.05,
    },
  }),
};

const mainImg = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

function YourWatch({ params }: YourWatchProps) {
  const { watch } = params;

  const [selectedImg, setSelectedImg] = useState(0);
  const [addingItem, setAddingItem] = useState(false);
  const [cart, setCart] = useState();
  const [errMsg, setErrMsg] = useState<undefined | string>();
  const [err, setErr] = useState(false);

  const fetchProduct = async () => {
    const { data, errors } = await storeFront(print(singleProductQuery), {
      handle: watch,
    });

    if (errors) {
      throw new Error("Failed to fetch products");
    }

    return data;
  };

  const { data, isLoading, error } = useQuery(watch, fetchProduct, {
    staleTime: 60000,
  });

  const singleProduct: SingleProduct = data?.product;
  const variantId = singleProduct?.variants.edges[0].node.id;
  const productId = data?.product?.id;

  useEffect(() => {
    async function getCart() {
      let localCartData = JSON.parse(
        window.localStorage.getItem("shopify-demo-store") || "{}"
      );
      // Check if cart data exists
      if (localCartData && localCartData.cart && localCartData.cart.id) {
        // Load the existing cart
        setCart(localCartData);
      } else {
        // Create a new cart instance if there is no existing cart
        const { data, errors } = await storeFront(print(createCartInstance));
        if (errors) {
          setErr(true);
          setErrMsg("something went wrong while creating a cart instance");
        }
        localCartData = data?.cartCreate;
        setCart(localCartData);
        window.localStorage.setItem(
          "shopify-demo-store",
          JSON.stringify(localCartData)
        );
      }
    }
    getCart();
  }, []);

  const handleAddToCart = async () => {
    // Retrieve the cart data from localStorage
    const cartDataString = window.localStorage.getItem("shopify-demo-store");
    const cartData = cartDataString ? JSON.parse(cartDataString) : null;
    const cartId = cartData ? cartData.cart.id : null;
    setAddingItem(true);
    const { data, errors } = await storeFront(print(addToCartMutation), {
      cartId: cartId,
      variantId: variantId,
    });

    if (errors) {
      setErr(true);
      setErrMsg("something went wrong while adding this item to the cart");
    }

    if (data && data.cartLinesAdd) {
      // Update localStorage with the new cart data
      window.localStorage.setItem(
        "shopify-demo-store-cart",
        JSON.stringify(data.cartLinesAdd.cart)
      );

      // Update the cart state with the new cart data
      setCart(data.cartLinesAdd.cart);
    } else {
      setErr(true);
      setErrMsg("something went wrong while adding this item to the cart");
    }
    setAddingItem(false);
  };

  if (isLoading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <ErrPage />;
  }

  return (
    <div className="flex flex-col items-center overflow-hidden relative">
      <AnimatePresence mode="wait">
        {err && (
          <motion.div
            className="absolute flex items-center justify-center gap-2 top-[5%] bg-black py-1 px-2 rounded-xl z-10"
            variants={msg}
            initial="initial"
            animate="animate"
            exit="exit"
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
      <div className="h-[768px] lg:h-[600px] 2xl:h-[700px] 4xl:h-[800px] flex lg:flex-row flex-col items-center justify-center bg-[#f2f2f2]">
        <div className="flex flex-[1] h-[100%] w-[100vw] lg:w-[50vw]">
          {singleProduct?.images.edges.length! > 1 && (
            <div className="flex-[1.2] md:flex-[1.5] flex flex-col items-center justify-center gap-5">
              {singleProduct?.images.edges.map((img, i) => (
                <motion.div
                  key={i}
                  className={`relative h-16 w-14 md:h-20 md:w-20 2xl:h-24 2xl:w-24 border-[2px] transition-colors duration-300 ${
                    i === selectedImg && "border-[#8888887d]"
                  }  bg-white cursor-pointer`}
                  variants={sideImgs}
                  initial="initial"
                  animate="animate"
                  custom={i}
                >
                  <Image
                    src={img.node.url}
                    alt=""
                    fill
                    className="object-contain"
                    onClick={() => setSelectedImg(i)}
                  />
                </motion.div>
              ))}
            </div>
          )}
          <div className="flex-[5]">
            <AnimatePresence mode="wait">
              {singleProduct?.images.edges.map(
                (img, i) =>
                  i === selectedImg && (
                    <motion.div
                      className="h-[100%] w-[100%] relative"
                      key={i}
                      variants={mainImg}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Image
                        src={img.node.url || ""}
                        alt=""
                        fill
                        className="object-contain"
                      />
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex-[1] flex justify-center items-center h-[100%] lg:w-[50vw]">
          <div className="flex flex-col justify-center items-center lg:items-start gap-5 md:w-[80%] w-[95%]">
            <h1 className="capitalize text-3xl font-light text-[#555555]">
              {singleProduct?.tags.includes("accessories")
                ? singleProduct?.tags[1]
                : singleProduct?.tags[0]}
            </h1>
            <h2 className="uppercase font-[500] text-xl text-[#555555] text-center lg:text-left">
              {singleProduct?.title}
            </h2>
            {singleProduct?.variants.edges[0].node.selectedOptions && (
              <span className="capitalize text-[#555555] text-lg font-[300]">
                {singleProduct?.variants.edges[0].node.selectedOptions[0]
                  .value === "Default Title"
                  ? ""
                  : singleProduct?.variants.edges[0].node.selectedOptions[0]
                      .value}
              </span>
            )}
            <div className="flex flex-col justify-center gap-5 mt-8 w-[100%] lg:w-[75%]">
              {singleProduct?.variants.edges[0].node.selectedOptions[1] && (
                <div className="flex flex-col justify-center gap-3">
                  <hr className="border-[#8888887d]" />
                  <span className="font-[300] capitalize text-base">
                    {
                      singleProduct?.variants.edges[0].node.selectedOptions[1]
                        .value
                    }
                  </span>
                  <hr className="border-[#8888887d]" />
                </div>
              )}
              <span className="text-[#d80032] font-[500] py-4 text-lg">
                {formatUSD(
                  Number(singleProduct?.priceRange.minVariantPrice.amount)
                )}
              </span>
              <button
                onClick={handleAddToCart}
                className="btn-secondary uppercase min-w-full min-h-[50px] font-[500] tracking-[5px] border border-gray-400 bg-white"
              >
                {addingItem ? (
                  <div className="flex items-center justify-center">
                    <Loader />
                  </div>
                ) : (
                  <span>add to cart</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[90vw] items-center py-10 mx-[auto]">
        <h1 className="pb-10 uppercase text-center text-[#c40d2e] text-4xl 4xl:text-5xl font-[300] tracking-[5px]">
          description
        </h1>
        <div
          className="h-[100%] w-[100%] md:w-[75%] lg:w-[60%] mx-[auto] desc"
          dangerouslySetInnerHTML={{
            __html: singleProduct?.descriptionHtml || "",
          }}
        />
      </div>
      <hr className="w-[95%] mx-auto" />
      <RecommenedProducts title="YOU MAY ALSO LIKE" productId={productId} />
    </div>
  );
}

export default YourWatch;
