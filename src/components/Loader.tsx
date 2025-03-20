import Image from "next/image";
import React from "react";

function Loader() {
  return (
    <Image unoptimized src="/omega-loader.gif" alt="" width={30} height={30} />
  );
}

export default Loader;
