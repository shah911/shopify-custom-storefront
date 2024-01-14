"use client";
import OptionAccordion from "@/components/OptionAccordion";
import { option1, option2, option3, option4 } from "@/components/Data";
import { TuneOutlined } from "@mui/icons-material";
import { useState } from "react";

import SortAccordion from "./SortAccordion";

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
  return (
    <div className="flex items-center justify-center">
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
        <span className="capitalize px-2">Filters</span>
      </button>
      {open && (
        <div className="md:hidden h-[calc(100vh-10%)] flex flex-col items-center absolute bg-white z-10 w-[100vw] top-[10%] shadow-lg">
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
      )}
    </div>
  );
}

export default Filters;
