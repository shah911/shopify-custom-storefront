"use client";
import OptionAccordion from "@/components/OptionAccordion";
import { option1, option2, option3, option4 } from "@/components/Data";
import { CloseOutlined, TuneOutlined } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import SortAccordion from "./SortAccordion";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollLockContext } from "@/LockContext/LockContext";

type SetProductSort = (value: string) => void;

type FiltersProps = {
  setProductSort: SetProductSort;
  notWatches: boolean;
  setSelectedOption: (value: string) => void;
  option: undefined | number;
  setOption: (value: number | undefined) => void;
  sort: undefined | number;
  setSort: (value: undefined | number) => void;
};

function Filters({
  setProductSort,
  notWatches,
  setSelectedOption,
  option,
  setOption,
  sort,
  setSort,
}: FiltersProps) {
  const [open, setOpen] = useState(false);
  const { lockScroll, unlockScroll, locks } = useContext(ScrollLockContext);

  useEffect(() => {
    if (open) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }, [open, lockScroll, unlockScroll]);

  useEffect(() => {
    const resize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 768) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="flex items-center justify-center">
      {locks <= 0 && (
        <button
          className="md:hidden btn-secondary p-3 rounded-[50px] flex items-center border border-gray-400"
          style={{
            position: "fixed",
            top: "20%",
            right: 0,
            marginLeft: "60%",
            zIndex: 20,
          }}
          onClick={() => setOpen(!open)}
        >
          <TuneOutlined />
          <span className="capitalize px-2">{open ? "close" : "Filters"}</span>
        </button>
      )}
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            className="md:hidden z-10 h-[100vh] w-[100%] fixed top-0 bg-[#00000054]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white h-[calc(100vh-50px)] w-[100%] absolute top-[60px]">
              <div className="w-fit p-4 ml-auto" onClick={() => setOpen(false)}>
                <CloseOutlined />
              </div>
              <hr />
              <div className="w-[100%] p-5">
                <div className="mb-10">
                  <OptionAccordion
                    setSelectedOption={setSelectedOption}
                    accessories={notWatches ? true : false}
                    data={notWatches ? option4 : option1}
                    option={option}
                    setOption={setOption}
                  />
                </div>
                <hr />
              </div>
              <div className="w-[100%] p-5">
                <div className="mb-10">
                  <SortAccordion
                    data={option3}
                    setProductSort={setProductSort}
                    sort={sort}
                    setSort={setSort}
                  />
                </div>
                <hr />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Filters;
