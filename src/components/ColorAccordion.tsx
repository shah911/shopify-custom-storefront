"use client";
import { useState } from "react";
import { Add, Remove } from "@mui/icons-material";

type Section = {
  title: string;
  items: string[];
};

type DataProp = Section[];

function ColorAccordion({ data }: { data: DataProp }) {
  const [active, setActive] = useState(true);
  const [productColor, setProductColor] = useState<string[]>([]);
  return (
    <div className="h-[100%] flex flex-col justify-evenly">
      {data.map((section, index) => (
        <div key={index} className="px-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => {
              setActive(!active);
            }}
          >
            <span className="uppercase text-sm w-fit">{section.title}</span>
            {
              <div>
                {active ? (
                  <span>
                    <Remove className="text-lg" />
                  </span>
                ) : (
                  <span>
                    <Add className="text-lg" />
                  </span>
                )}
              </div>
            }
          </div>
          {active && (
            <div className="flex flex-wrap py-2 gap-3">
              {section.items.map((item, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: item }}
                  onClick={() => setProductColor((prev) => [...prev, item])}
                  className="h-10 w-10 rounded-[50%] border-[0.5px] border-black cursor-pointer"
                ></div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ColorAccordion;
