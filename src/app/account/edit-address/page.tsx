"use client";
import Loader from "@/components/Loader";
import User from "@/components/User";
import UserAddress from "@/components/UserAddress";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

function EditAddress() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const customerAccessToken = Cookies.get("customer-access-token");

    if (!customerAccessToken) {
      router.push("/account/signin");
      return;
    }
    setLoading(false);
  }, []);
  return loading ? (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader />
    </div>
  ) : (
    <>
      <User />
      <div className="pt-10">
        <UserAddress />
      </div>
    </>
  );
}

export default EditAddress;
