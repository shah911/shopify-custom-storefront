"use client";
import { ScrollLockContext } from "@/LockContext/LockContext";
import { CloseOutlined } from "@mui/icons-material";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const bg = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { ease: "easeInOut", duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { ease: "easeInOut", duration: 0.3 },
  },
};

const search = {
  initial: {
    clipPath: "inset(0 0 100% 0)",
  },
  animate: {
    clipPath: "inset(0)",
    transition: { ease: "easeInOut", duration: 0.3 },
  },
  exit: {
    clipPath: "inset(0 0 100% 0)",
    transition: { ease: "easeInOut", duration: 0.3 },
  },
};

function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const { locks, lockScroll, unlockScroll } = useContext(ScrollLockContext);

  useEffect(() => {
    if (isOpen) {
      lockScroll();
    } else {
      setTimeout(() => {
        unlockScroll();
      }, 300);
    }
  }, [isOpen, lockScroll, unlockScroll]);

  useEffect(() => {
    if (locks > 2 || pathname !== prevPathname) {
      setIsOpen(false);
    }
    setPrevPathname(pathname);
  }, [locks, pathname]);

  const ProductSearchQuery = query.toLowerCase();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/Search?query=${ProductSearchQuery}`);
    setIsOpen(false);
  };

  return (
    <div>
      {!isOpen ? (
        <Image
          onClick={() => setIsOpen(!isOpen)}
          src="/search.svg"
          alt="search"
          width={26}
          height={26}
          className="object-contain cursor-pointer"
        />
      ) : (
        <CloseOutlined
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer"
        />
      )}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.form
            className="bg-[#00000054] h-[100vh] w-[100%] absolute z-30 top-[59px] lg:top-[104px] left-0"
            onSubmit={(e) => handleSubmit(e)}
            variants={bg}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <hr />
            <motion.div
              className="flex items-center justify-center w-[100%] bg-white"
              variants={search}
            >
              <div className="relative w-[85%] lg:w-[65%] h-[90px] flex items-center justify-center">
                <input
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="Search... "
                  className="w-[100%] outline-none border-b-[1px] transition-colors duration-500 focus:border-black placeholder:text-2xl placeholder:text-black placeholder:font-[300]"
                />

                <button type="submit">
                  <Image
                    src="/search.svg"
                    alt="search"
                    width={26}
                    height={26}
                    className="object-contain cursor-pointer absolute right-0 top-[35%]"
                  />
                </button>
              </div>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Search;
