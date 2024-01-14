"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CheckBox from "./CheckBox";
import gql from "graphql-tag";
import { print } from "graphql";
import { storeFront } from "../../utils";
import { useRouter } from "next/navigation";
import Loader from "./Loader";

type FormData = {
  email: string;
  password: string;
  username: string;
  acceptTerms: boolean;
};

const signUpMutation = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customerUserErrors {
        field
        message
      }
      customer {
        id
      }
    }
  }
`;

const CustomerAccessToken = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

function SignUpForm() {
  useEffect(() => {
    const customerData = window.localStorage.getItem("customer-access-token");
    if (customerData) {
      router.push("/");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [errorMsg, setErrorMsg] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    //console.log(formData);
    setLoading(true);
    const { email, password, username } = formData;
    const { data, errors } = await storeFront(print(signUpMutation), {
      input: { email: email, password: password, lastName: username },
    });

    const userErrorMessage =
      data?.customerCreate?.customerUserErrors[0]?.message;
    setErrorMsg(() => (errors ? errors[0].message : userErrorMessage));

    if (data?.customerCreate?.customer?.id) {
      const res = await storeFront(print(CustomerAccessToken), {
        input: {
          email: email,
          password: password,
        },
      });
      window.localStorage.setItem(
        "customer-access-token",
        JSON.stringify(res.data.customerAccessTokenCreate.customerAccessToken)
      );
      //console.log(res.data.customerAccessTokenCreate.customerAccessToken);
      router.push("/");
    }
    setLoading(false);
    //console.log(data);
  };

  return (
    <div className="h-[60vh] md:h-[50vh] lg:h-[100vh] flex flex-col items-center justify-center">
      <div
        className={`h-[100vh] w-[100%] flex items-center justify-center fixed top-0 bg-[rgba(255,255,255,.5)] ${
          loading ? "opacity-[1] z-10" : "opacity-0 z-[-10]"
        }`}
      >
        <Loader />
      </div>
      <h1 className="uppercase text-center text-[#c40d2e] text-3xl lg:text-[42px] font-[300] tracking-[3px]">
        sign up
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-[75%] w-[90%] lg:w-[80%] mx-auto flex flex-col justify-evenly"
      >
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
            className="input2 w-[100%] border bg-[#fbfbfb] border-gray-400"
          />
          <label className="user-label2">Your Email*</label>
          {errors.email && (
            <span className="text-red-500 text-xs">
              {errors.email?.message}
            </span>
          )}
        </div>
        <div className="input-group2 flex flex-col">
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            type="password"
            className="input2 w-[100%] border bg-[#fbfbfb] border-gray-400"
          />
          <label className="user-label2">Password*</label>
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password?.message}
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
            className="input2 w-[100%] border bg-[#fbfbfb] border-gray-400"
          />
          <label className="user-label2">Username*</label>
          {errors.username && (
            <span className="text-red-500 text-xs">
              {errors.username?.message}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className=" w-fit">
            <CheckBox register={register} />
          </div>
          <p
            className={`text-sm font-[300] text-justify ${
              errors.acceptTerms && "text-red-500 font-[400]"
            }`}
          >
            Accept <strong>Terms of Use</strong> to create a My SHAH. account
          </p>
        </div>
        <span className="font-[400] text-xs text-[#c40d2e]">{errorMsg}</span>
        <button
          type="submit"
          className="mx-auto btn-secondary uppercase text-lg h-12 lg:w-[35%] md:w-[50%] w-[100%] border border-gray-400"
        >
          submit
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
