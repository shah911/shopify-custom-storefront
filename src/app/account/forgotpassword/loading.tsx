import Loader from "@/components/Loader";
import React from "react";

function Loading() {
  return (
    <div className="h-[100vh] flex items-center justify-center">
      <Loader />
    </div>
  );
}

export default Loading;
