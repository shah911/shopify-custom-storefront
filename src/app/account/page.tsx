"use client";
import React, { useEffect, useState } from "react";
import UserDashboard from "@/components/UserDashboard";
import Loader from "@/components/Loader";
import { storeFront } from "../../../utils";
import { print } from "graphql";
import gql from "graphql-tag";
import { useRouter } from "next/navigation";

const customerLogout = gql`
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;

function MyAccount() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const customer = window.localStorage.getItem("customer-access-token");
    const customerData = customer ? JSON.parse(customer) : null;
    const customerAccessToken = customerData ? customerData.accessToken : null;
    const tokenExpiredDate = customerData ? customerData.expiresAt : null;
    const date = new Date().toISOString();

    if (!customerAccessToken) {
      router.push("/account/signin");
      return;
    }

    if (tokenExpiredDate < date && customerAccessToken) {
      const invalidateUser = async () => {
        const { data, errors } = await storeFront(print(customerLogout), {
          customerAccessToken: customerAccessToken,
        });
        window.localStorage.removeItem("customer-access-token");
        //console.log(data);
      };
      invalidateUser();
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
