import Image from "next/image";
import Link from "next/link";
import React from "react";

function notFound() {
  return (
    <div className="h-[768px] md:h-[900px] lg:h-[600px] 2xl:h-[768px] 4xl:h-[960px] lg:flex-row flex flex-col items-center justify-center">
      <div className="flex-[3] lg:flex-[1] h-[100%] w-[100%] relative">
        <Image
          src="/AS11-40-5903HR-1200_2.jpg"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-[2] lg:flex-[1] h-[100%] flex items-center justify-center">
        <div className="h-[100%] lg:h-[60%] 2xl:h-[50%] w-[75%] flex flex-col items-center lg:items-start justify-evenly">
          <span className="font-[300] text-[#555555] 2xl:text-2xl 4xl:text-3xl">
            ERROR 404
          </span>
          <h1 className="text-[#c40d2e] text-[38px] 2xl:text-[48px] font-[300] tracking-[5px]">
            WE'RE SORRY,
          </h1>
          <p className="text-[#555555] text-[14px] 2xl:text-[20px] lg:text-left text-center">
            We looked everywhere but the page you requested was not found.
          </p>
          <Link href="/">
            <button className="btn-secondary h-12 px-8 2xl:h-16 2xl:px-12 border border-black">
              HOMEPAGE
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default notFound;
