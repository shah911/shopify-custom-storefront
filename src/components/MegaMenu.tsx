"use client";
import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MegaMenuList from "./MegaMenuList";
import {
  Links,
  accessories,
  constellation,
  deVille,
  seamaster,
  speedmaster,
} from "./Data";
import { ScrollLockContext } from "@/LockContext/LockContext";
import { AnimatePresence, motion } from "framer-motion";

type MegaMenuLinksType = {
  [key: string]: { url: string; title: string; handle: string }[];
};

const megaMenuLinks: MegaMenuLinksType = {
  constellation: constellation,
  seamaster: seamaster,
  speedmaster: speedmaster,
  "de ville": deVille,
  accessories: accessories,
};

const list = {
  initial: {
    clipPath: "inset(0 0 100% 0)",
  },
  animate: {
    clipPath: "inset(0)",
    transition: {
      type: "tween",
      ease: [0.39, 0.575, 0.5649999999999999, 1],
      duration: 0.5,
    },
  },
  exit: {
    clipPath: "inset(0 0 100% 0)",
    transition: {
      type: "tween",
      ease: [0.39, 0.575, 0.5649999999999999, 1],
      duration: 0.5,
      delay: 1,
    },
  },
};

function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("");
  const pathname = usePathname();
  const { lockScroll, unlockScroll } = useContext(ScrollLockContext);

  useEffect(() => {
    if (isOpen) {
      lockScroll();
    } else {
      setTimeout(() => {
        unlockScroll();
      }, 1000);
    }
  }, [isOpen, lockScroll, unlockScroll]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="hidden lg:flex mx-auto items-center justify-center h-[100%] w-[100%]">
      {Links.map((link, i) => (
        <span
          onMouseOver={() => {
            setIsOpen(true);
            setTab(link.title);
          }}
          onMouseOut={() => {
            setIsOpen(false);
          }}
          className="flex items-center uppercase text-[13px] font-[500] px-4 cursor-pointer text-[#555555] h-[100%]"
          key={i}
        >
          {link.title}
        </span>
      ))}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="absolute top-[100.5px] left-0 right-0 z-30 overflow-hidden"
            variants={list}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="h-[calc(100vh-100.5px)] bg-[#00000054]">
              <hr />
              <div
                onMouseOver={() => setIsOpen(true)}
                onMouseOut={() => setIsOpen(false)}
              >
                <MegaMenuList tab={tab} MegaMenuLinks={megaMenuLinks[tab]} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MegaMenu;
