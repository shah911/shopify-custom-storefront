import Accordions from "./Accordions";
import {
  List1,
  List2,
  List3,
  List4,
  List5,
  List6,
  List7,
  footerData1,
  footerData2,
  footerData3,
  footerData4,
  footerData5,
} from "./Data";

function Footer() {
  return (
    <div className="lg:h-[600px] flex flex-col">
      <div className="flex-[5] p-10 hidden lg:flex">
        <div className="flex-[1]">
          <h2 className="uppercase text-sm font-[500]">THE COLLECTION</h2>
          <ul className="text-xs capitalize font-light pt-4">
            {List1.map((item, i) => (
              <li className="pt-2 cursor-pointer w-fit" key={i}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-[1] flex flex-col gap-8">
          <div className="">
            <h2 className="uppercase text-sm font-[500]">FIND YOUR WATCH</h2>
            <ul className="text-xs capitalize font-light pt-4">
              {List2.map((item, i) => (
                <li className="pt-2 cursor-pointer w-fit" key={i}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="">
            <h2 className="uppercase text-sm font-[500]">PLANET Watch</h2>
            <ul className="text-xs capitalize font-light pt-4">
              {List3.map((item, i) => (
                <li className="pt-2 cursor-pointer w-fit" key={i}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex-[1] flex flex-col gap-8">
          <div className="">
            <h2 className="uppercase text-sm font-[500]">MASTER CHRONOMETER</h2>
            <ul className="text-xs capitalize font-light pt-4">
              {List4.map((item, i) => (
                <li className="pt-2 cursor-pointer w-fit" key={i}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="">
            <h2 className="uppercase text-sm font-[500]">STORE LOCATOR</h2>
            <ul className="text-xs capitalize font-light pt-4">
              {List5.map((item, i) => (
                <li className="pt-2 cursor-pointer w-fit" key={i}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex-[1] flex flex-col gap-8">
          <div className="">
            <h2 className="uppercase text-sm font-[500]">CUSTOMER SERVICE</h2>
            <ul className="text-xs capitalize font-light pt-4">
              {List6.map((item, i) => (
                <li className="pt-2 cursor-pointer w-fit" key={i}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="">
            <h2 className="uppercase text-sm font-[500]">more</h2>
            <ul className="text-xs capitalize font-light pt-4">
              {List7.map((item, i) => (
                <li className="pt-2 cursor-pointer w-fit" key={i}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <button className="btn-secondary px-[32px] py-[10px] font-[500] border border-solid border-gray-400 w-fit">
            contact us
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:hidden mt-4">
        <div className="min-h-[auto]">
          <Accordions data={footerData1} />
          <Accordions data={footerData2} />
          <Accordions data={footerData3} />
          <Accordions data={footerData4} />
          <Accordions data={footerData5} />
        </div>
      </div>
      <div className="lg:bg-[#f2f2f2] h-[60px] lg:flex-[1] flex items-center justify-center">
        <p className="text-xs font-light">
          Copyright SHAH. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
