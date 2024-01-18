"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Props = {
  title: string;
  desc: string;
  img: string;
  buttonText: string;
  midSection: boolean;
  link: string;
};

const Img = {
  initial: { opacity: 0, x: "50%", y: 50 },
  whileInView: {
    opacity: 1,
    x: "0%",
    y: 0,
    transition: { type: "tween", duration: 0.75 },
  },
};

const content = {
  initial: { opacity: 0, x: "-50%", y: 50 },
  whileInView: {
    opacity: 1,
    x: "0%",
    y: 0,
    transition: { type: "tween", duration: 0.75 },
  },
};

const midImg = {
  initial: { opacity: 0, x: "-50%", y: 50 },
  whileInView: {
    opacity: 1,
    x: "0%",
    y: 0,
    transition: { type: "tween", duration: 0.75 },
  },
};

const midContent = {
  initial: { opacity: 0, x: "50%", y: 50 },
  whileInView: {
    opacity: 1,
    x: "0%",
    y: 0,
    transition: { type: "tween", duration: 0.75 },
  },
};

function Section({ title, desc, img, buttonText, midSection, link }: Props) {
  return (
    <div
      className={`h-[840px] md:h-[960px] w-[90vw] lg:h-[600px]  md:w-[80vw] mx-auto flex flex-col items-center ${
        midSection ? "lg:flex-row-reverse" : "lg:flex-row"
      }  overflow-hidden`}
    >
      <div className="flex-[1] flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center lg:items-start w-[100%] lg:w-[35vw] gap-6"
          variants={midSection ? midContent : content}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <h1
            className={
              midSection
                ? "title text-center text-2xl md:text-4xl lg:text-left"
                : "text-2xl text-center lg:text-left md:text-4xl lg:text-5xl text-red-800 font-light tracking-[5px]"
            }
          >
            {title}
          </h1>
          <p className="font-light text-center lg:text-left">{desc}</p>
          <button className="btn-secondary px-[32px] py-[10px] font-[500] border border-gray-400">
            <Link href={link}>{buttonText}</Link>
          </button>
        </motion.div>
      </div>
      <div className="flex-[1] flex items-center justify-center">
        <motion.div
          className="relative h-[100%] w-[90vw] md:h-[50vh] md:w-[80vw] lg:h-[480px] lg:w-[37.5vw]"
          variants={midSection ? midImg : Img}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <Image src={img} alt="" fill={true} className="object-cover" />
        </motion.div>
      </div>
    </div>
  );
}

export default Section;
