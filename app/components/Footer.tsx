import Link from "next/link";
import { FacebookIcon, GithubIcon, LinkedinIcon, WhatsappIcon } from "./navigation/socialIcons";

const Footer = () => {
  return (
    <footer className='w-full space-y-10 h-fit py-6 px-4.5 bg-blue-800'>
      <div className='flex items-start place-items-start place-content-start flex-wrap justify-start flex-col max-h-24 gap-y-4 gap-x-6  w-full'>
        <Link className='text-white w-fit text-sm font-medium' href='/'>
          Home
        </Link>
        <Link className='text-white w-fit text-sm font-medium' href='/'>
          About
        </Link>
        <Link className='text-white w-fit text-sm font-medium' href='/contact'>
          Contact us
        </Link>
        <Link className='text-white w-fit text-sm font-medium' href='/'>
          Privacy Policy
        </Link>
        <Link className='text-white w-fit text-sm font-medium' href='/'>
          Accessibility
        </Link>
      </div>
      <div className='flex items-start place-items-start place-content-start flex-wrap justify-start flex-col gap-2 w-full'>
        <div className='flex items-center justify-start gap-2'>
          <a
            href='https://wa.me/+17179629684'
            target='_blank'
            className='flex items-center justify-center p-1 rounded-full bg-blue-50 shadow-[0px_1px_1px_0px_#00004326]'>
            <WhatsappIcon />
          </a>
          <a
            href='https://www.facebook.com/etanheyman'
            target='_blank'
            className='flex items-center justify-center p-1 rounded-full bg-blue-50 shadow-[0px_1px_1px_0px_#00004326]'>
            <FacebookIcon />
          </a>
          <a
            href='https://www.linkedin.com/in/etanheyman'
            target='_blank'
            className='flex items-center justify-center p-1 rounded-full bg-blue-50 shadow-[0px_1px_1px_0px_#00004326]'>
            <LinkedinIcon />
          </a>
          <a
            href='https://github.com/etanhey'
            target='_blank'
            className='flex items-center justify-center p-1 rounded-full bg-blue-50 shadow-[0px_1px_1px_0px_#00004326]'>
            <GithubIcon />
          </a>
        </div>
        <p className='text-white w-fit text-sm font-medium'>All rights reserved @ 2025</p>
        <p className='text-white w-fit text-sm font-medium'>
          Designed by{" "}
          <Link href='https://www.productdz.com' target='_blank' className='underline'>
            ProductDZ
          </Link>{" "}
          | Developed by{" "}
          <Link href='https://www.linkedin.com/in/etanheyman' target='_blank' className='underline'>
            Etan Heyman
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
