import Image from "next/image";
import Link from "next/link";
import React from "react";

const data = [
  { url: "/VM_FS_WT_SP_Astronaut_500x600.jpg", title: "winter tales" },
  {
    url: "/FS_WT_Familly_RVB_NoLogo_500x600.jpg",
    title: "five season selection",
  },
];

function YourWatch() {
  return (
    <div className="flex flex-col h-[500px] justify-around bg-white">
      <div className="flex">
        <div className="flex-[1]">
          <h1 className="font-[500] text-sm uppercase mb-5 px-3 text-[#8D8D8D]">
            FEATURED COLLECTION
          </h1>
          <div className="flex">
            {data.map((item, i) => (
              <div className="flex flex-col" key={i}>
                <Image
                  src={item.url}
                  alt=""
                  width={256}
                  height={352}
                  className="object-cover p-3"
                />
                <span className="font-[500] text-sm uppercase px-3 text-[#555555]">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-[1] flex">
          <div className="flex-[1] flex flex-col gap-5">
            <h1 className="font-[500] text-sm uppercase text-[#8D8D8D]">
              BY SIZE
            </h1>
            <ul className="flex flex-col gap-3">
              <li className="text-sm uppercase font-[500]">
                WOMEN'S SELECTION
              </li>
              <li className="text-sm uppercase font-[500]">MEN'S SELECTION</li>
            </ul>
            <h1 className="font-[500] text-sm uppercase text-[#8D8D8D]">
              BY STATUS
            </h1>
            <ul className="flex flex-col gap-3">
              <li className="text-sm uppercase font-[500]">BESTSELLERS</li>
              <li className="text-sm uppercase font-[500]">NOVELTIES</li>
            </ul>
          </div>
          <div className="flex-[1] flex flex-col gap-5">
            <h1 className="font-[500] text-sm uppercase text-[#8D8D8D]">
              BY STYLE
            </h1>
            <ul className="flex flex-col gap-3">
              <li className="text-sm uppercase font-[500]">DRESS WATCHES</li>
              <li className="text-sm uppercase font-[500]">SPORT WATCHES</li>
              <li className="text-sm uppercase font-[500]">DIVE WATCHES</li>
              <li className="text-sm uppercase font-[500]">
                OLYMPIC GAMES WATCHES
              </li>
            </ul>
            <h1 className="font-[500] text-sm uppercase text-[#8D8D8D]">
              BY MATERIAL
            </h1>
            <ul className="flex flex-col gap-3">
              <li className="text-sm uppercase font-[500]">GOLD WATCHES</li>
              <li className="text-sm uppercase font-[500]">TITANIUM WATCHES</li>
              <li className="text-sm uppercase font-[500]">CERAMIC WATCHES</li>
              <li className="text-sm uppercase font-[500]">STEEL WATCHES</li>
            </ul>
          </div>
          <div className="flex-[1] flex flex-col gap-5">
            <h1 className="font-[500] text-sm uppercase text-[#8D8D8D]">
              BY FEATURE
            </h1>
            <ul className="flex flex-col gap-3">
              <li className="text-sm uppercase font-[500]">
                MASTER CHRONOMETER WATCHES
              </li>
              <li className="text-sm uppercase font-[500]">
                CHRONOGRAPH WATCHES
              </li>
              <li className="text-sm uppercase font-[500]">
                AUTOMATIC WATCHES
              </li>
              <li className="text-sm uppercase font-[500]">
                MANUAL WINDING WATCHES
              </li>
              <li className="text-sm uppercase font-[500]">QUARTZ WATCHES</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-5">
        <Link href="/Collection">
          <button className="btn uppercase text-[#555555]">
            all suggestions
          </button>
        </Link>
        <Link href="/Collection">
          <button className="btn uppercase text-[#555555]">watch finder</button>
        </Link>
      </div>
    </div>
  );
}

export default YourWatch;
