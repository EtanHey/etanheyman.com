import Image from "next/image";
import React from "react";

const Me = () => {
  return (
    <div className="relative self-start">
      <Image
        className="rounded-r-full rounded-b-full border-4 border-white bg-blue-200"
        src="/Me2.png"
        alt="Me"
        width={100}
        height={100}
      />
    </div>
  );
};

export default Me;
