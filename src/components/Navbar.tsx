"use client";
import Link from "next/link";
import Image from "next/image";
import MegaMenu from "./MegaMenu";
import MenuIcon from "./MenuIcon";
import Search from "./Search";
import Cart from "./Cart";
import { useState } from "react";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";

function Navbar() {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.div
      className="sticky top-0 z-10 bg-white h-[60px] lg:h-[104px] flex items-center justify-evenly shadow-sm"
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="h-[100%] w-[90vw] lg:w-[95vw] mx-auto flex flex-col">
        <div className="flex-[1] flex items-center">
          <div className="flex-[1]">
            <MenuIcon />
          </div>
          <div className="flex-[1] flex items-center justify-center">
            <Link
              href="/"
              className="flex items-center justify-center  text-3xl font-[500] w-fit"
            >
              SHAH.
            </Link>
          </div>
          <div className="flex-[1] flex items-center justify-end gap-4">
            <Search />
            <Link href="/account" className="hidden lg:flex">
              <Image
                src="/user.svg"
                alt="user"
                width={26}
                height={26}
                className="object-contain cursor-pointer"
              />
            </Link>
            <Cart />
          </div>
        </div>
        <div className="flex-[1] hidden lg:flex">
          <MegaMenu />
        </div>
      </div>
    </motion.div>
  );
}

export default Navbar;
