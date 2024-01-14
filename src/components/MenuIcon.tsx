"use client";
import { useContext, useEffect, useState } from "react";
import SideBarMenu from "./SideBarMenu";
import { usePathname } from "next/navigation";
import { ScrollLockContext } from "@/LockContext/LockContext";
import { AnimatePresence, motion } from "framer-motion";

function MenuIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { lockScroll, unlockScroll } = useContext(ScrollLockContext);

  useEffect(() => {
    if (isOpen) {
      lockScroll(); // lock scroll when the component is open
    } else {
      unlockScroll(); // unlock scroll when the component is closed
    }
  }, [isOpen, lockScroll, unlockScroll]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleHamburgerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <>
      <div className="flex items-center gap-2">
        <label
          className="burger"
          htmlFor="burger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <input
            type="checkbox"
            id="burger"
            checked={isOpen}
            readOnly
            onClick={handleHamburgerClick}
          />
          <span></span>
          <span></span>
          <span></span>
        </label>
        <span className="text-sm uppercase hidden lg:flex font-[500]">
          {isOpen ? "Close" : "Menu"}
        </span>
      </div>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="bg-[#00000054] h-[calc(100vh-60px)] lg:h-[calc(100vh-104px)] w-[100%] absolute top-[59px] lg:top-[104px] z-30 left-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <hr />
            <SideBarMenu />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MenuIcon;
