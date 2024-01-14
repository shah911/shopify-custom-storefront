"use client";
import gql from "graphql-tag";
import { print } from "graphql";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { storeFront } from "../../utils";
import { CloseOutlined } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";

type FormData = {
  email: string;
  username: string;
};

const customerUpdate = gql`
  mutation customerUpdate(
    $customerAccessToken: String!
    $customer: CustomerUpdateInput!
  ) {
    customerUpdate(
      customerAccessToken: $customerAccessToken
      customer: $customer
    ) {
      customer {
        id
        email
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

function UserUpdate() {
  const [msg, setMsg] = useState<undefined | string>();
  const [loading, setLoading] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    //console.log(formData);
    const { email, username } = formData;
    const customer = window.localStorage.getItem("customer-access-token");
    const customerData = customer ? JSON.parse(customer) : null;
    const customerAccessToken = customerData ? customerData.accessToken : null;
    const { data, errors } = await storeFront(print(customerUpdate), {
      customerAccessToken: customerAccessToken,
      customer: { email: email, lastName: username },
    });
    if (errors) {
      setPopUp(true);
      setMsg(
        () =>
          errors[0]?.message ||
          "We were unable to update your username and email. Please attempt again later."
      );
      setLoading(false);
    } else {
      setPopUp(true);
      setMsg("Your username and email have been successfully updated.");
      setLoading(false);
    }

    //console.log(data);
    //console.log(errors);
  };

  return (
    <div className="h-[45vh] lg:h-[65vh] flex flex-col justify-evenly relative">
      <h1 className="uppercase text-center text-[#c40d2e] text-3xl lg:text-4xl font-[300] tracking-[3px]">
        ACCOUNT INFORMATION
      </h1>
      <AnimatePresence mode="wait">
        {popUp && (
          <motion.div
            className="absolute flex items-center justify-center gap-2 top-[-15%] md:top-[-10%] lg:top-[-15%] lg:left-[21%] bg-black py-1 px-2 rounded-xl z-10"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: "100%", opacity: 1, transition: { type: "tween" } }}
            exit={{ y: 0, opacity: 0, transition: { type: "tween" } }}
          >
            <span className="text-white text-xs font-[300] capitalize text-center">
              {msg}
            </span>
            <CloseOutlined
              className="text-white cursor-pointer"
              onClick={() => setPopUp(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-[70%] flex flex-col items-center justify-evenly"
      >
        <div className="input-group2 flex flex-col">
          <input
            {...register("email", {
              required: "email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "This is not a valid email",
              },
            })}
            type="email"
            className="input2 w-[90vw] md:w-[70vw] border bg-[#fbfbfb] border-gray-400"
          />
          <label className="user-label2">Change Email*</label>
          {errors.email && (
            <span className="text-sm text-red-500 capitalize">
              {errors.email?.message}
            </span>
          )}
        </div>
        <div className="input-group2 flex flex-col">
          <input
            {...register("username", {
              required: "username is required",
              minLength: {
                value: 4,
                message: "username shouldn't be less than 4 characters",
              },
              maxLength: {
                value: 10,
                message: "username shouldn't be greater than 10 characters",
              },
            })}
            type="text"
            className="input2 w-[90vw] md:w-[70vw] border bg-[#fbfbfb] border-gray-400"
          />
          <label className="user-label2">Change Username*</label>
          {errors.username && (
            <span className="text-sm text-red-500 capitalize">
              {errors.username?.message}
            </span>
          )}
        </div>
        <button className="mx-auto btn-secondary uppercase text-lg h-12 w-[90vw] md:w-[70vw] lg:w-[30vw] border border-gray-400">
          {loading ? (
            <div className="h-[100%] w-[100%] flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            "update"
          )}
        </button>
      </form>
    </div>
  );
}

export default UserUpdate;
