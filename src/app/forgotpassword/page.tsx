"use client";
import gql from "graphql-tag";
import { useForm } from "react-hook-form";
import { CloseOutlined } from "@mui/icons-material";
import { storeFront } from "../../../utils";
import { print } from "graphql";
import { useState } from "react";
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

function forgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [customerEmail, setCustomerEmail] = useState<undefined | string>();
  const [notify, setNotify] = useState(false);
  const [errMsg, setErrMsg] = useState();
  console.log(errMsg);

  const onSubmit = async (formData: FormData) => {
    //console.log(formData);
    const { email } = formData;
    const { data, errors } = await storeFront(print(customerRecovery), {
      email: email,
    });
    if (errors) {
      setErrMsg(errors[0].message);
      setNotify(true);
    } else {
      setCustomerEmail(email);
      setNotify(true);
    }
    //console.log(data);
    //console.log(errors);
  };

  return (
    <>
      {notify && (
        <div className="h-[100px] w-[100%] bg-[#c40d2e] flex items-center justify-evenly">
          {errMsg ? (
            <p className="text-white text-xs text-center md:text-sm w-[75%]">
              {errMsg}
            </p>
          ) : (
            <p className="text-white text-xs text-center md:text-sm w-[75%]">
              If there is an account associated with {customerEmail} you will
              receive an email with a link to reset your password.
            </p>
          )}
          <span className="text-white">
            <CloseOutlined
              className="cursor-pointer"
              onClick={() => setNotify(false)}
            />
          </span>
        </div>
      )}
      <form
        className="lg:h-[calc(100vh-104px)] md:h-[50vh] h-[50vh] flex flex-col items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="h-[70%] w-[90%] md:h-[60%] md:w-[80%] flex flex-col items-center justify-between">
          <h1 className="text-[#c40d2e] text-[28px] text-center md:text-[38px] font-[300] tracking-[5px]">
            FORGOT YOUR PASSWORD?
          </h1>
          <span className="text-sm font-[300] text-center text-[#555555]">
            Please enter your email address below to receive a password reset
            link.
          </span>
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
              className="input2 w-[90vw] lg:w-[40vw] md:w-[60vw] border border-gray-400 bg-[#fbfbfb]"
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
            className="btn-secondary border border-gray-400 w-[90vw] lg:w-[40vw] md:w-[60vw] py-3"
          >
            RESET MY PASSWORD
          </button>
        </div>
      </form>
    </>
  );
}

export default forgotPassword;
