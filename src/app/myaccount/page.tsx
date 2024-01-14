"use client";
import React, { useEffect, useState } from "react";
import SignInForm from "@/components/SignInForm";
import UserDashboard from "@/components/UserDashboard";
import Loader from "@/components/Loader";
import { storeFront } from "../../../utils";
import { print } from "graphql";
import gql from "graphql-tag";

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
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const customer = window.localStorage.getItem("customer-access-token");
    const customerData = customer ? JSON.parse(customer) : null;
    const customerAccessToken = customerData ? customerData.accessToken : null;
    const tokenExpiredDate = customerData ? customerData.expiresAt : null;
    const date = new Date().toISOString();
    if (tokenExpiredDate > date && customerAccessToken) {
      setUser(true);
    } else {
      const invalidateUser = async () => {
        const { data, errors } = await storeFront(print(customerLogout), {
          customerAccessToken: customerAccessToken,
        });
        window.localStorage.removeItem("customer-access-token");
        //console.log(data);
      };
      invalidateUser();
      setUser(false);
    }
    setLoading(false);
  }, []);
  //console.log(user);
  return loading ? (
    <div className="h-[100vh] flex items-center justify-center">
      <Loader />
    </div>
  ) : (
    <div>{user ? <UserDashboard /> : <SignInForm />}</div>
  );
}

export default MyAccount;
