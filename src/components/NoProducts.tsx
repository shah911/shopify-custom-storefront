import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  query: string;
};

function NoProducts({ query }: Props) {
  return (
    <div className="min-h-[1024px] md:min-h-[1280px]  lg:min-h-[669px] flex flex-col items-center justify-center gap-3 bg-[#f2f2f2]">
      <p className="text-[#555] text-center text-2xl md:text-3xl lg:text-4xl font-[300]">
        SORRY, THERE IS NO RESULT FOR "{query}"
      </p>
      <span className="text-[#555] font-[300]">
        Please check your spelling or try another word.
      </span>
      <div className="min-h-[840px] md:min-h-[1024px] lg:min-h-[450px] w-[100%] flex flex-col items-center justify-evenly">
        <span className="text-[#555] font-[300]">YOU MAY BE LOOKING FOR</span>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="h-[375px] md:h-[450px] w-[75vw] md:w-[45vw] lg:h-[360px] lg:w-[20vw]">
            <div className="h-[65%] lg:h-[50%] relative">
              <Image src="/our-watches.jpg" alt="" fill />
            </div>
            <div className="h-[35%] lg:h-[50%] bg-white flex flex-col items-center justify-center gap-3">
              <span className="text-xl font-[500] uppercase text-[#555555]">
                Our watches
              </span>
              <button className="btn capitalize text-sm w-fit">
                <Link href="/Collection">see more</Link>
              </button>
            </div>
          </div>
          <div className="h-[375px] md:h-[450px] w-[75vw] md:w-[45vw] lg:h-[360px] lg:w-[20vw]">
            <div className="h-[65%] lg:h-[50%] relative">
              <Image src="/pushNato-ambiancev3-2-3-large_1.jpg" alt="" fill />
            </div>
            <div className="h-[35%] lg:h-[50%] bg-white flex flex-col items-center justify-center gap-3">
              <span className="text-xl font-[500] uppercase text-[#555555]">
                Our accessories
              </span>
              <button className="btn capitalize text-sm w-fit">
                <Link href="/accessories">see more</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoProducts;
