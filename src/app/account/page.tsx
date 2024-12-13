"use client";
import React, { useEffect, useState } from "react";
import UserDashboard from "@/components/UserDashboard";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

function MyAccount() {
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
  //console.log(user);
  return loading ? (
    <div className="h-[100vh] flex items-center justify-center">
      <Loader />
    </div>
  ) : (
    <UserDashboard />
  );
}

export default MyAccount;
