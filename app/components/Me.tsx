import Image from "next/image";
import React from "react";

const Me = () => {
  return (
    <div className="relative h-[120px] w-[120px]">
      <Image
        className="h-full w-full rounded-tr-full rounded-br-full rounded-bl-full border-4 border-white bg-blue-200 object-cover"
        src="/images/me/Me2.png"
        alt="Etan Heyman"
        width={120}
        height={120}
        priority
      />
    </div>
  );
};

export default Me;
