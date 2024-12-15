"use client";
import { useContext, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@mui/material";
import { ShoppingBagOutlined } from "@mui/icons-material";
import gql from "graphql-tag";
import Cookies from "js-cookie";
import { storeFront } from "../../utils";
import { print } from "graphql";
import { CartItemsContext } from "@/LockContext/TotalCartIItems";

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

function Cart() {
  //handle the case when cookies expire
  const cartID = Cookies.get("cartID");
  const checkoutUrl = Cookies.get("checkoutUrl");
  const { totalQuantity, setTotalQuantity } = useContext(CartItemsContext);

  useEffect(() => {
    async function getCart() {
      if (cartID && checkoutUrl) {
        const { data, errors } = await storeFront(print(getCartQuery), {
          ID: cartID,
        });

        if (errors) return;
        if (!data?.cart) {
          Cookies.remove("cartID");
          Cookies.remove("checkoutUrl");
          const { data, errors } = await storeFront(print(createCartInstance));

          if (errors) return;
          if (data?.cartCreate?.cart) {
            setTotalQuantity(0);
            Cookies.set("cartID", data?.cartCreate?.cart?.id, {
              expires: 7,
              path: "/",
            });
            Cookies.set("checkoutUrl", data?.cartCreate?.cart?.checkoutUrl, {
              expires: 7,
              path: "/",
            });
          }
        } else {
          setTotalQuantity(data?.cart?.totalQuantity);
        }
      } else {
        const { data, errors } = await storeFront(print(createCartInstance));

        if (errors) return;
        if (data?.cartCreate?.cart) {
          Cookies.set("cartID", data?.cartCreate?.cart?.id, {
            expires: 7,
            path: "/",
          });
          Cookies.set("checkoutUrl", data?.cartCreate?.cart?.checkoutUrl, {
            expires: 7,
            path: "/",
          });
        }
      }
    }
    getCart();
  }, [cartID, checkoutUrl]);

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
