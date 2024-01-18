import User from "@/components/User";
import UserUpdate from "@/components/UserUpdate";
import UserAddress from "@/components/UserAddress";
import React from "react";

type params = {
  params: {
    userInfo: string;
  };
};

function userInfo({ params }: params) {
  const { userInfo } = params;
  //console.log(userInfo);
  return (
    <>
      <User />
      {userInfo === "info-edit" ? (
        <UserUpdate />
      ) : (
        <div className="pt-10">
          <UserAddress />
        </div>
      )}
    </>
  );
}

export default userInfo;
