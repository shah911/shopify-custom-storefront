"use client";

import { useContext, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@mui/material";
import { ShoppingBagOutlined } from "@mui/icons-material";
import gql from "graphql-tag";
import Cookies from "js-cookie";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { storeFront } from "../../utils";
import { print } from "graphql";
import { CartItemsContext } from "@/LockContext/TotalCartIItems";

// GraphQL Queries and Mutations
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

const getCartQuery = gql`
  query getCart($ID: ID!) {
    cart(id: $ID) {
      totalQuantity
    }
  }
`;

// Fetch cart data
async function fetchCart(cartID: string) {
  const { data, errors } = await storeFront(print(getCartQuery), {
    ID: cartID,
  });
  if (errors) throw new Error(errors[0].message);
  return data.cart;
}

// Create new cart
async function createCart() {
  const { data, errors } = await storeFront(print(createCartInstance));
  if (errors) throw new Error(errors[0].message);
  const cart = data.cartCreate.cart;

  // Set cookies
  Cookies.set("cartID", cart.id, { expires: 7, path: "/" });
  Cookies.set("checkoutUrl", cart.checkoutUrl, { expires: 7, path: "/" });

  return cart;
}

function Cart() {
  const cartID = Cookies.get("cartID");
  const checkoutUrl = Cookies.get("checkoutUrl");
  const { totalQuantity, setTotalQuantity } = useContext(CartItemsContext);
  const queryClient = useQueryClient();

  // Fetch Cart with React Query
  useQuery({
    queryKey: ["cart", cartID],
    queryFn: () => (cartID ? fetchCart(cartID) : Promise.reject("No Cart ID")),
    onSuccess: (data) => setTotalQuantity(data?.totalQuantity || 0),
    onError: () => {
      setTotalQuantity(0);
    },
    retry: 2,
  });

  // Create Cart Mutation
  const createCartMutation = useMutation({
    mutationFn: createCart,
    onSuccess: (newCart) => {
      Cookies.set("cartID", newCart.id, { expires: 7, path: "/" });
      Cookies.set("checkoutUrl", newCart.checkoutUrl, {
        expires: 7,
        path: "/",
      });
      setTotalQuantity(0);
      queryClient.setQueryData(["cart", newCart.id], newCart);
    },
  });

  // Handle missing or expired cart
  useEffect(() => {
    if (!cartID || !checkoutUrl) {
      createCartMutation.mutate();
    }
  }, [cartID, checkoutUrl, createCartMutation]);

  return (
    <Link href="/cart">
      <Badge badgeContent={totalQuantity}>
        <ShoppingBagOutlined
          color="action"
          className="text-black text-[22px] cursor-pointer"
        />
      </Badge>
    </Link>
  );
}

export default Cart;
