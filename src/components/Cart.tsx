"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@mui/material";
import { ShoppingBagOutlined } from "@mui/icons-material";

function Cart() {
  const [totalItemsInCart, setTotalItemsInCart] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      const cartDataString = window.localStorage.getItem(
        "shopify-demo-store-cart"
      );
      const cartData = cartDataString ? JSON.parse(cartDataString) : null;
      const totalQuantity = cartData?.totalQuantity || 0;
      setTotalItemsInCart(totalQuantity);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/cart">
      <Badge badgeContent={totalItemsInCart}>
        <ShoppingBagOutlined
          color="action"
          className="text-black text-[22px] cursor-pointer"
        />
      </Badge>
    </Link>
  );
}

export default Cart;
