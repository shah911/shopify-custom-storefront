"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { countries } from "./Data";
import gql from "graphql-tag";
import { storeFront } from "../../utils";
import { print } from "graphql";

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
  const [customerToken, setCustomerToken] = useState();
  const [customerId, setCustomerId] = useState();
  const [errMsg, setErrMsg] = useState<undefined | string>();
  //console.log(customerId);
  //console.log(customerToken);
  useEffect(() => {
    const getCustomerInfo = async () => {
      const customer = window.localStorage.getItem("customer-access-token");
      const customerData = customer ? JSON.parse(customer) : null;
      const customerAccessToken = customerData
        ? customerData.accessToken
        : null;
      setCustomerToken(customerAccessToken);
      const { data, errors } = await storeFront(print(getCustomerId), {
        customerAccessToken: customerAccessToken,
      });
      //console.log(data);
      setCustomerId(data?.customer?.addresses?.edges[0]?.node?.id);
      if (errors) {
        setErrMsg(
          () => errors && "We were unable to retrieve your customer record."
        );
      }
    };
    getCustomerInfo();
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (formData: FormData) => {
    //console.log(formData);
    const { streetAddress, homeAddress, city, country, zip } = formData;
    if (customerId) {
      const { data, errors } = await storeFront(print(customerAddress), {
        id: customerId,
        customerAccessToken: customerToken,
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
        setErrMsg(() =>
          errors
            ? errors[0]?.message
            : "Your shipping address is not in our records. Please note, a prior completed order is necessary for updating it."
        );
      }
    } else {
      setErrMsg(
        "Your shipping address is not in our records. Please note, a prior completed order is necessary for updating it."
      );
    }

    //console.log(data, errors);
    //console.log(errors);
  };

  return (
    <div className="flex flex-col">
      <h1 className="uppercase text-center text-[#c40d2e] text-3xl lg:text-4xl font-[300] tracking-[3px]">
        Shipping Address
      </h1>
      <form
        className="flex flex-col items-center h-[60vh] lg:h-[100vh] md:h-[60vh] justify-evenly"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="input-group2 flex flex-col">
          <input
            {...register("streetAddress", {
              required: "Street address is required",
            })}
            className="input2 w-[90vw] md:w-[70vw] border bg-[#fbfbfb] border-gray-400"
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
            className="input2 w-[90vw] md:w-[70vw] border bg-[#fbfbfb] border-gray-400"
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
            className="input2 w-[90vw] md:w-[70vw] border bg-[#fbfbfb] border-gray-400"
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
            className={`input2 w-[90vw] md:w-[70vw] border bg-[#fbfbfb] border-gray-400 ${
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
            className="input2 w-[90vw] md:w-[70vw] border bg-[#fbfbfb] border-gray-400"
          />
          <label className="user-label2">Zip*</label>
          {errors.zip && (
            <span className="text-xs text-red-500 capitalize">
              {errors.zip?.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="mx-auto btn-secondary uppercase text-lg h-12 w-[90vw] md:w-[50vw] lg:w-[30vw] border border-gray-400"
        >
          change
        </button>
        <span className="font-[400] text-xs text-[#c40d2e] text-center">
          {errMsg}
        </span>
      </form>
    </div>
  );
}

export default AddressForm;
