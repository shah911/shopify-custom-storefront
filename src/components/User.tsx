"use client";
import {
  AllInboxOutlined,
  LocationOnOutlined,
  LoginOutlined,
  TuneOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { storeFront } from "../../utils";
import { print } from "graphql";
import gql from "graphql-tag";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Loader from "./Loader";

const data = [
  {
    url: "/myaccount",
    title: "my dashboard",
    icon: <AllInboxOutlined className="text-3xl" />,
  },
  {
    url: "/myaccount/info-edit",
    title: "my personal information",
    icon: <TuneOutlined className="text-3xl" />,
  },
  {
    url: "/myaccount/address-edit",
    title: "my address",
    icon: <LocationOnOutlined className="text-3xl" />,
  },
];

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

function User() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    const customer = window.localStorage.getItem("customer-access-token");
    const customerData = customer ? JSON.parse(customer) : null;
    const customerAccessToken = customerData ? customerData.accessToken : null;
    //console.log(customerAccessToken);
    const { data, errors } = await storeFront(print(customerLogout), {
      customerAccessToken: customerAccessToken,
    });
    window.localStorage.removeItem("customer-access-token");
    setLoading(false);
    //console.log(data);
    router.push("/");
  };
  return (
    <>
      <div
        className={`h-[100vh] w-[100%] flex items-center justify-center fixed top-0 bg-[rgba(255,255,255,.5)] ${
          loading ? "opacity-[1] z-10" : "opacity-0 z-[-10]"
        }`}
      >
        <Loader />
      </div>
      <div className="h-[350px] md:h-[350px] lg:h-[400px] w-[100%]">
        <div className="h-full w-full relative">
          <Image
            src="/MyOmega-ImgTetiere-large_1.jpg"
            priority={true}
            alt=""
            fill={true}
            className="object-cover brightness-50"
          />
          <div className="absolute h-[100%] w-[100%] flex items-center justify-center">
            <span className="text-white text-3xl md:text-5xl font-thin tracking-[3px]">
              My Account
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-evenly flex-wrap h-auto md:h-[125px] w-[100%] bg-[#f2f2f2]">
        {data.map((item, i) => (
          <Link
            href={item.url}
            key={i}
            className="flex flex-col items-center justify-center gap-3 h-[100%] w-[150px] p-3 group"
          >
            <span className="transition-all duration-500 group-hover:translate-y-[-5px]">
              {item.icon}
            </span>
            <span className="uppercase font-[300] text-[14px] text-center">
              {item.title}
            </span>
          </Link>
        ))}
        <div
          className="flex flex-col cursor-pointer items-center justify-center gap-3 h-[100%] w-[150px] p-3 group"
          onClick={handleLogout}
        >
          <LoginOutlined className="text-2xl transition-all duration-500 group-hover:translate-y-[-5px]" />
          <span className="uppercase font-[300] text-[14px] text-center">
            logout
          </span>
        </div>
      </div>
    </>
  );
}

export default User;
