"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import gql from "graphql-tag";
import { print } from "graphql";
import { storeFront } from "../../utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "./Loader";

type FormData = {
  email: string;
  password: string;
};

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

function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [errorMsg, setErrorMsg] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    //console.log(formData);
    setLoading(true);
    const { email, password } = formData;
    const { data, errors } = await storeFront(print(CustomerAccessToken), {
      input: {
        email: email,
        password: password,
      },
    });
    // console.log(data);
    // console.log(errors);
    if (data?.customerAccessTokenCreate?.customerAccessToken) {
      window.localStorage.setItem(
        "customer-access-token",
        JSON.stringify(data.customerAccessTokenCreate.customerAccessToken)
      );
      router.push("/");
      setLoading(false);
    } else if (errors) {
      setErrorMsg(errors ? errors[0].message : "Invalid login or password.");
      setLoading(false);
    } else {
      setErrorMsg("something went wrong while login. Please try again later.");
      setLoading(false);
    }
    //console.log(data);
  };

  return (
    <div className="h-[900px] md:h-[500px] lg:h-[600px]">
      <div
        className={`h-[100vh] w-[100%] flex items-center justify-center fixed top-0 bg-[rgba(255,255,255,.5)] ${
          loading ? "opacity-[1] z-10" : "opacity-0 z-[-10]"
        }`}
      >
        <Loader />
      </div>
      <h1 className="py-10 lg:py-20 uppercase text-center text-[#c40d2e] text-3xl lg:text-[42px] font-[300] tracking-[3px]">
        my account
      </h1>
      <div className="m-auto flex flex-col md:flex-row justify-between gap-10 h-[80%] md:h-[60%] w-[90%]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-[1] flex flex-col justify-between"
        >
          <h1 className="text-[#c40d2e] uppercase font-[500]">
            i have an account
          </h1>
          <span className="font-[400] text-xs text-[#c40d2e]">{errorMsg}</span>

          <div className="input-group2">
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              className="input2 w-[100%] border border-gray-400 bg-[#fbfbfb]"
            />
            <label className="user-label2">Your Email*</label>
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email?.message}
              </span>
            )}
          </div>
          <div className="input-group2">
            <input
              {...register("password", {
                required: "Password is required",
              })}
              type="password"
              className="input2 w-[100%] border border-gray-400 bg-[#fbfbfb]"
            />
            <label className="user-label2">Password*</label>
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password?.message}
              </span>
            )}
          </div>
          <Link href="/forgotpassword" className="w-fit">
            <span className="btn capitalize w-fit text-[#c40d2e] font-[500]">
              forget your password?
            </span>
          </Link>
          <button
            type="submit"
            className="w-[100%] btn-secondary uppercase text-lg h-12 border border-gray-400"
          >
            login
          </button>
        </form>
        <div className="flex-[1] flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-[#c40d2e] uppercase font-[500]">
              i don't have an account
            </h1>
            <p className="text-sm font-[300]">
              Create an account to benefit from our exclusive services and keep
              up to date with our latest publications.
            </p>
          </div>
          <div>
            <Link href="/signup" className="w-[100%]">
              <button className="w-[100%] btn-secondary uppercase text-lg h-12 border border-gray-400">
                sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInForm;
