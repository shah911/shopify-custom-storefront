"use client";
import React, { useEffect, useState } from "react";
import { print } from "graphql";
import gql from "graphql-tag";
import { useForm } from "react-hook-form";
import { storeFront } from "../../../../../../utils";
import { CloseOutlined } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

type params = {
  params: {
    customerId: string;
    resetToken: string;
  };
};

type FormData = {
  password: string;
};

const customerPasswordReset = gql`
  mutation customerReset($input: CustomerResetInput!, $customerId: ID!) {
    customerReset(input: $input, id: $customerId) {
      customer {
        id
        email
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const animate = {
  initial: {
    opacity: 0,
    clipPath: "inset(0 0 100% 0)",
  },
  animate: {
    clipPath: "inset(0)",
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    clipPath: "inset(0 0 100% 0)",
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

function ResetPassword({ params }: params) {
  const { customerId, resetToken } = params;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [notify, setNotify] = useState(false);
  const [errMsg, setErrMsg] = useState<null | string>();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const customer = window.localStorage.getItem("customer-access-token");
    const customerData = customer ? JSON.parse(customer) : null;
    const customerAccessToken = customerData ? customerData.accessToken : null;

    if (customerAccessToken) {
      router.push("/account");
      return;
    }
    setIsMounted(false);
  }, []);
  //console.log(errMsg);

  const onSubmit = async (formData: FormData) => {
    //console.log(formData);
    const { password } = formData;
    setLoading(true);
    const { data, errors } = await storeFront(print(customerPasswordReset), {
      input: {
        resetToken,
        password,
      },
      customerId: `gid://shopify/Customer/${customerId}`,
    });
    // console.log(data, errors);
    if (errors) {
      setErrMsg(
        errors[0].message
          ? errors[0].message
          : "Something went wrong. Please try again later."
      );
      setNotify(true);
    } else if (data?.customerReset?.customerUserErrors[0]?.message) {
      setErrMsg(
        "This link has been expired, please initiate a new password reset request."
      );
      setNotify(true);
    } else {
      // Success case: Display the success message
      setErrMsg(null); // Clear any error message
      setNotify(true);
    }
    setLoading(false);
    // console.log(data);
    // console.log(errors);
  };
  return isMounted ? (
    <div className="h-screen flex items-center justify-center">
      <Loader />
    </div>
  ) : (
    <div className="relative flex flex-col">
      <div className="absolute top-0 left-0 w-full">
        <AnimatePresence mode="wait">
          {notify && (
            <motion.div
              variants={animate}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="h-[100px] w-[100%] bg-[#c40d2e] flex items-center justify-evenly">
                {errMsg ? (
                  <p className="capitalize text-white text-xs text-center md:text-sm w-[75%]">
                    {errMsg}
                  </p>
                ) : (
                  <p className="capitalize text-white text-xs text-center md:text-sm w-[75%]">
                    You updated your password.
                  </p>
                )}
                <span className="text-white">
                  <CloseOutlined
                    className="cursor-pointer"
                    onClick={() => {
                      setNotify(false);
                      // router.push("/account");
                    }}
                  />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <form
        className="h-[500px] flex flex-col items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="h-[70%] md:h-[60%] w-[90%] lg:h-[50%] md:w-[80%] flex flex-col items-center justify-between">
          <h1 className="text-[#c40d2e] uppercase text-[30px] text-center md:text-[38px] font-[300] tracking-[5px]">
            Reset password?
          </h1>
          <div className="input-group2 flex flex-col">
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Your Password should be atleast 8 characters",
                },
              })}
              type="password"
              className="input2 w-[90vw] lg:w-[40vw] md:w-[60vw] 2xl:w-[30vw] border border-gray-400 bg-[#fbfbfb]"
            />
            <label className="user-label2">Password</label>
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password?.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={notify}
            className="disabled:opacity-50 btn-secondary border border-gray-400 w-[90vw] lg:w-[40vw] 2xl:w-[30vw] md:w-[60vw] py-3"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader />
              </div>
            ) : (
              "SET A NEW PASSWORD"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
