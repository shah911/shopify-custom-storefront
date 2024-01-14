import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import YourWatch from "./YourWatch";

type Props = {
  tab: string;
  MegaMenuLinks: { url: string; title: string; handle: string }[];
};

const listItem = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

function MegaMenuList({ tab, MegaMenuLinks }: Props) {
  return (
    <AnimatePresence mode="wait">
      {tab === "find your watch" ? (
        <motion.div
          className="h-[calc(100vh-100.5px)]"
          variants={listItem}
          initial="initial"
          animate="animate"
          exit="exit"
          key={tab}
        >
          <YourWatch />
        </motion.div>
      ) : (
        <motion.div
          className="h-[70vh] flex flex-col items-center justify-evenly py-10 shadow-md bg-white"
          variants={listItem}
          initial="initial"
          animate="animate"
          exit="exit"
          key={tab}
        >
          <h1 className="font-[300] uppercase tracking-[10px] text-xl text-[#555555]">
            {tab}
          </h1>
          <div className="flex items-center">
            {MegaMenuLinks.map((link, i) => (
              <Link
                href={
                  tab === "accessories"
                    ? `/accessories/${link.title}`
                    : `/yourwatch/${link.handle}`
                }
                key={i}
                className="flex flex-col items-center justify-center p-5"
              >
                <div>
                  <Image
                    src={link.url}
                    alt=""
                    height={176}
                    width={128}
                    className="object-cover"
                  />
                </div>
                <span className="font-[500] capitalize text-sm text-center text-[#555555]">
                  {link.title}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href={tab === "accessories" ? "/accessories" : `/Collection/${tab}`}
          >
            <button className="btn uppercase text-[#555555]">all {tab}</button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MegaMenuList;
