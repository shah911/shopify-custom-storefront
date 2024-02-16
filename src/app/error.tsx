"use client";
import React from "react";

function ErrPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="h-[100vh] w-[100%] flex flex-col items-center justify-center gap-4">
      <h1 className="capitalize text-[#c40d2e] text-3xl lg:text-[42px] font-[300] tracking-[3px]">
        Oops!
      </h1>
      <p className="text-sm font-[300]">Sorry, something went wrong.</p>
      <button className="btn" onClick={reset}>
        Try Again
      </button>
    </div>
  );
}

export default ErrPage;
