import Image from "next/image";

const Me = () => {
  return (
    <div className="relative h-[120px] w-[120px] sm:h-[140px] sm:w-[140px] md:h-[240px] md:w-[240px] lg:h-[280px] lg:w-[280px] xl:h-[468px] xl:w-[468px]">
      <Image
        className="h-full w-full rounded-tl-none rounded-tr-[60px] rounded-br-[60px] rounded-bl-[60px] border-4 border-white bg-blue-200 object-cover sm:rounded-tr-[70px] sm:rounded-br-[70px] sm:rounded-bl-[70px] md:rounded-tl-[120px] md:rounded-tr-none md:rounded-br-[120px] md:rounded-bl-[120px] md:border-[6px] lg:rounded-tl-[140px] lg:rounded-tr-none lg:rounded-br-[140px] lg:rounded-bl-[140px] lg:border-[8px] xl:rounded-tl-[234px] xl:rounded-tr-none xl:rounded-br-[234px] xl:rounded-bl-[234px] xl:border-[10px]"
        src="/images/me/Me2.png"
        alt="Etan Heyman"
        width={468}
        height={468}
        sizes="(max-width: 768px) 120px, (max-width: 1280px) 280px, 468px"
        priority
      />
    </div>
  );
};

export default Me;
