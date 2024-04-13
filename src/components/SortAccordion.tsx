"use client";
import { useCallback, useState } from "react";
import { Add, Remove } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

type Item = {
  name: string;
  value: string;
};

type Section = {
  title: string;
  items: Item[];
};

type DataProp = Section[];

type SetProductSort = (value: string) => void;

type SortAccordionProps = {
  data: DataProp;
  onAccessories: boolean;
};

const accordian = {
  initial: {
    height: 0,
    opacity: 0,
  },
  animate: {
    height: "auto",
    opacity: 1,
    transition: { type: "tween", duration: 0.5 },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { type: "tween", duration: 0.5 },
  },
};

function SortAccordion({ data, onAccessories }: SortAccordionProps) {
  const [active, setActive] = useState(true);
  const searchParams = useSearchParams();
  const sort = searchParams.get("sortKey");
  const router = useRouter();

  const createQueryString = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(key, value);
      return params.toString();
    },
    [searchParams]
  );
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
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                variants={accordian}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ul className="text-[12px] capitalize">
                  {section.items.map((item, i) => (
                    <div className="flex items-center gap-2" key={i}>
                      <li
                        value={item.value}
                        className="py-2 cursor-pointer w-fit text-xs font-[300]"
                        onClick={() => {
                          router.push(
                            `/${
                              onAccessories ? "accessories" : "Collection"
                            }?${createQueryString("sortKey", item.value)}`
                          );
                        }}
                      >
                        {item.name}
                      </li>
                      {sort === item.value && <CheckIcon className="text-sm" />}
                    </div>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default SortAccordion;
