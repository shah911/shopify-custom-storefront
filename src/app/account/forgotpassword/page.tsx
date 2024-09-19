"use client";
import gql from "graphql-tag";
import { useForm } from "react-hook-form";
import { CloseOutlined } from "@mui/icons-material";
import { print } from "graphql";
import { useState } from "react";
import Loader from "@/components/Loader";
import { AnimatePresence, motion } from "framer-motion";
import { storeFront } from "../../../../utils";

type FormData = {
  email: string;
};

const customerRecovery = gql`
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
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

function forgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [customerEmail, setCustomerEmail] = useState<undefined | string>();
  const [notify, setNotify] = useState(false);
  const [errMsg, setErrMsg] = useState<undefined | string>();
  const [loading, setLoading] = useState(false);
  //console.log(errMsg);

  const onSubmit = async (formData: FormData) => {
    //console.log(formData);
    const { email } = formData;
    setLoading(true);
    const { data, errors } = await storeFront(print(customerRecovery), {
      email: email,
    });
    console.log(data, errors);
    if (errors) {
      setErrMsg(
        errors[0].message
          ? errors[0].message
          : "Something went wrong. Please try again later."
      );
      setNotify(true);
    } else if (data?.customerRecover?.customerUserErrors[0]?.message) {
      setErrMsg(data?.customerRecover?.customerUserErrors[0]?.message);
      setNotify(true);
    } else {
      setCustomerEmail(email);
      setNotify(true);
    }
    setLoading(false);
    // console.log(data);
    // console.log(errors);
  };

  return (
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
                  <p className="text-white capitalize text-xs text-center md:text-sm w-[75%]">
                    {errMsg}
                  </p>
                ) : (
                  <p className="text-white text-xs text-center md:text-sm w-[75%]">
                    If there is an account associated with {customerEmail} you
                    will receive an email with a link to reset your password.
                  </p>
                )}
                <span className="text-white">
                  <CloseOutlined
                    className="cursor-pointer"
                    onClick={() => setNotify(false)}
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
          <h1 className="text-[#c40d2e] text-[30px] text-center md:text-[38px] font-[300] tracking-[5px]">
            FORGOT YOUR PASSWORD?
          </h1>
          <span className="text-sm font-[300] text-center text-[#555555]">
            Please enter your email address below to receive a password reset
            link.
          </span>
          <div className="input-group2 flex flex-col">
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              className="input2 w-[90vw] lg:w-[40vw] md:w-[60vw] 2xl:w-[30vw] border border-gray-400 bg-[#fbfbfb]"
            />
            <label className="user-label2">Email</label>
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email?.message}
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
              "RESET MY PASSWORD"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default forgotPassword;
