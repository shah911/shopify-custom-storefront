import Image from "next/image";
import Link from "next/link";
import React from "react";

function notFound() {
  return (
    <div className="h-[500px] flex items-center justify-center">
      <div className="flex-[1] h-[100%] w-[100%] relative">
        <Image src="/AS11-40-5903HR-1200_2.jpg" alt="" fill />
      </div>
      <div className="flex-[1] h-[100%] flex items-center justify-center">
        <div className="h-[60%] w-[75%] flex flex-col justify-evenly">
          <span className="font-[300] text-[#555555]">ERROR 404</span>
          <h1 className="text-[#c40d2e] text-[38px] font-[300] tracking-[5px]">
            WE'RE SORRY,
          </h1>
          <p className="text-[#555555] text-[14px]">
            We looked everywhere but the page you requested was not found.
          </p>
          <Link href="/">
            <button className="btn-secondary h-12 px-8 border border-black">
              HOMEPAGE
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default notFound;
