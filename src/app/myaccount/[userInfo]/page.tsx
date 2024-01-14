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
        <div className="h-[60vh] md:h-[50vh] lg:h-[100vh] flex items-center justify-center">
          <UserUpdate />
        </div>
      ) : (
        <div className="pt-10">
          <UserAddress />
        </div>
      )}
    </>
  );
}

export default userInfo;
