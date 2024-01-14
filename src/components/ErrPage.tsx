import React from "react";

function ErrPage() {
  return (
    <div className="h-[50vh] lg:h-[100vh] w-[100%] flex flex-col items-center justify-center gap-4">
      <h1 className="capitalize text-[#c40d2e] text-3xl lg:text-[42px] font-[300] tracking-[3px]">
        Oops!
      </h1>
      <p className="text-sm font-[300]">Sorry, something went wrong.</p>
    </div>
  );
}

export default ErrPage;
