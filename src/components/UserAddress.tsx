"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { countries } from "./Data";
import gql from "graphql-tag";
import { storeFront } from "../../utils";
import { print } from "graphql";
import Loader from "./Loader";
import { CloseOutlined } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { useQuery } from "react-query";
import ErrPage from "./ErrPage";

type FormData = {
  streetAddress: string;
  homeAddress: string;
  city: string;
  country: string;
  zip: string;
};

const customerAddress = gql`
  mutation customerAddressUpdate(
    $id: ID!
    $customerAccessToken: String!
    $address: MailingAddressInput!
  ) {
    customerAddressUpdate(
      id: $id
      customerAccessToken: $customerAccessToken
      address: $address
    ) {
      customerAddress {
        id
        address1
        address2
        city
        country
        zip
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const getCustomerId = gql`
  query getCustomerAddresses($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      addresses(first: 1) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

function AddressForm() {
  const [value, setValue] = useState("United States");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<undefined | string>();
  const [popUp, setPopUp] = useState(false);
  //console.log(customerId);
  //console.log(customerToken);
  const customerAccessToken = Cookies.get("customer-access-token");

  const getCustomerInfo = async () => {
    const { data, errors } = await storeFront(print(getCustomerId), {
      customerAccessToken: customerAccessToken,
    });
    //console.log(data);

    if (errors) {
      setPopUp(true);
      setMsg(
        errors
          ? errors[0].message
          : "We were unable to retrieve your customer record."
      );
    }
    return data;
  };

  const { data, error, isLoading } = useQuery("customerID", getCustomerInfo);
  const customerID = data?.customer?.addresses?.edges[0]?.node?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (formData: FormData) => {
    //console.log(formData);
    const { streetAddress, homeAddress, city, country, zip } = formData;
    if (customerID) {
      setLoading(true);
      const { data, errors } = await storeFront(print(customerAddress), {
        id: customerID,
        customerAccessToken: customerAccessToken,
        address: {
          address1: streetAddress,
          address2: homeAddress,
          city: city,
          country: country,
          //province: state,
          zip: zip,
        },
      });

      if (errors) {
        setPopUp(true);
        setMsg(
          errors
            ? errors[0]?.message
            : "Your shipping address is not in our records. Please note, a prior completed order is necessary for updating it."
        );
      } else {
        setPopUp(true);
        setMsg("Your shipping address has been successfully updated");
      }
      setLoading(false);
    }

    //console.log(data, errors);
    //console.log(errors);
  };

  if (error) {
    return <ErrPage />;
  }

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <h1 className="uppercase text-center text-[#c40d2e] text-3xl lg:text-4xl font-[300] tracking-[3px]">
        Shipping Address
      </h1>
      <AnimatePresence mode="wait">
        {popUp && (
          <motion.div
            className="absolute flex items-center justify-center gap-2 top-[35%] bg-black py-1 px-2 rounded-xl z-10"
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
        className="flex flex-col items-center h-[600px] justify-evenly"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="input-group2 flex flex-col">
          <input
            {...register("streetAddress", {
              required: "Street address is required",
            })}
            className="input2 w-[90vw] md:w-[70vw] 2xl:w-[50vw] border bg-[#fbfbfb] border-gray-400"
          />
          <label className="user-label2">Street address*</label>
          {errors.streetAddress && (
            <span className="text-xs text-red-500 capitalize">
              {errors.streetAddress?.message}
            </span>
          )}
        </div>
        <div className="input-group2 flex flex-col">
          <input
            {...register("homeAddress", {
              required: "Home address is required",
            })}
            className="input2 w-[90vw] md:w-[70vw] 2xl:w-[50vw] border bg-[#fbfbfb] border-gray-400"
          />
          <label className="user-label2">Home address*</label>
          {errors.homeAddress && (
            <span className="text-xs text-red-500 capitalize">
              {errors.homeAddress?.message}
            </span>
          )}
        </div>
        <div className="input-group2 flex flex-col">
          <input
            {...register("city", { required: "city is required" })}
            className="input2 w-[90vw] md:w-[70vw] 2xl:w-[50vw] border bg-[#fbfbfb] border-gray-400"
          />
          <label className="user-label2">City*</label>
          {errors.city && (
            <span className="text-xs text-red-500 capitalize">
              {errors.city?.message}
            </span>
          )}
        </div>
        <div className="input-group2 flex flex-col">
          <select
            {...register("country", { required: "Country is required" })}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`input2 w-[90vw] md:w-[70vw] 2xl:w-[50vw] border bg-[#fbfbfb] border-gray-400 ${
              value && "has-value"
            }`}
          >
            {countries.map((item, i) => (
              <option key={i}>{item}</option>
            ))}
          </select>
          <label className="user-label2">Country*</label>
          {errors.country && (
            <span className="text-xs text-red-500 capitalize">
              {errors.country?.message}
            </span>
          )}
        </div>
        <div className="input-group2 flex flex-col">
          <input
            {...register("zip", {
              required: "Zip is required",
              minLength: {
                value: 4,
                message: "zip code shouldn't be less then 4 digits",
              },
              maxLength: {
                value: 5,
                message: "zip code shouldn't be greater than 5 digits",
              },
            })}
            className="input2 w-[90vw] md:w-[70vw] 2xl:w-[50vw] border bg-[#fbfbfb] border-gray-400"
          />
          <label className="user-label2">Zip*</label>
          {errors.zip && (
            <span className="text-xs text-red-500 capitalize">
              {errors.zip?.message}
            </span>
          )}
        </div>
        <button
          disabled={popUp}
          type="submit"
          className="disabled:opacity-50 mx-auto btn-secondary uppercase text-lg h-12 w-[90vw] md:w-[50vw] lg:w-[30vw] border border-gray-400"
        >
          {loading ? (
            <div className="h-[100%] w-[100%] flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            "change"
          )}
        </button>
      </form>
    </div>
  );
}

export default AddressForm;
