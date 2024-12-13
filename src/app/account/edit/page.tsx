"use client";
import Loader from "@/components/Loader";
import User from "@/components/User";
import UserUpdate from "@/components/UserUpdate";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

function Edit() {
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
      <UserUpdate />
    </>
  );
}

export default Edit;
