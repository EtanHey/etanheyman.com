import React from 'react';
import { TechIconProps } from './TechIcon';

const DndkitIcon: React.FC<TechIconProps> = ({ className = '', ...props }) => {
  return (
    <>
      {/* Desktop version */}
      <svg 
        className={`hidden md:block ${className}`}
        width={54} 
        height={21} 
        viewBox="0 0 54 21" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        {...props}
      >
        <path d="M52.1839 0.494263H2.67841C1.71342 0.494263 0.931152 1.33373 0.931152 2.36926V18.6193C0.931152 19.6548 1.71342 20.4943 2.67841 20.4943H52.1839C53.1489 20.4943 53.9312 19.6548 53.9312 18.6193V2.36926C53.9312 1.33373 53.1489 0.494263 52.1839 0.494263Z" fill="#0053A4"/>
<path d="M16.074 5.49426V8.44211H15.2654V6.93199L12.721 9.5821L12.1493 8.9866L14.6936 6.33649H13.2438V5.49426H16.074ZM9.00316 5.49426V6.33649H7.55329L10.0977 8.9866L9.52594 9.5821L6.98155 6.93199V8.44211H6.17291V5.49426H9.00316ZM12.721 11.7189L15.2654 14.369V12.8589H16.074V15.8068H13.2438V14.9645H14.6936L12.1493 12.3144L12.721 11.7189ZM12.1796 8.93176L12.7736 9.51635L7.56448 14.9553H9.02611V15.8068H6.17291V12.8266H6.98811V14.3533L12.1796 8.93176Z" fill="#E7F5FE"/>
<path d="M24.5598 6.74426H25.6868V13.3068H24.5598V12.7536C24.2279 13.2099 23.7561 13.438 23.1446 13.438C22.5563 13.438 22.054 13.199 21.6376 12.7208C21.2211 12.2427 21.0129 11.6568 21.0129 10.963C21.0129 10.2693 21.2211 9.68333 21.6376 9.2052C22.054 8.72707 22.5563 8.48801 23.1446 8.48801C23.7561 8.48801 24.2279 8.71614 24.5598 9.17239V6.74426ZM22.4806 11.9193C22.7136 12.163 23.0048 12.2849 23.3542 12.2849C23.7037 12.2849 23.992 12.1615 24.2191 11.9146C24.4463 11.6677 24.5598 11.3505 24.5598 10.963C24.5598 10.5755 24.4463 10.2583 24.2191 10.0114C23.992 9.76457 23.7037 9.64114 23.3542 9.64114C23.0048 9.64114 22.715 9.76457 22.485 10.0114C22.2549 10.2583 22.1399 10.5755 22.1399 10.963C22.1399 11.3505 22.2535 11.6693 22.4806 11.9193ZM29.1464 8.48801C29.624 8.48801 30.0185 8.65989 30.3301 9.00364C30.6417 9.34739 30.7975 9.82238 30.7975 10.4286V13.3068H29.6705V10.5786C29.6705 10.2661 29.5919 10.0271 29.4347 9.86145C29.2774 9.69582 29.0677 9.61301 28.8057 9.61301C28.5145 9.61301 28.2815 9.70989 28.1068 9.90364C27.932 10.0974 27.8447 10.388 27.8447 10.7755V13.3068H26.7177V8.61926H27.8447V9.14426C28.1184 8.70676 28.5523 8.48801 29.1464 8.48801ZM35.0696 6.74426H36.1965V13.3068H35.0696V12.7536C34.7376 13.2099 34.2658 13.438 33.6543 13.438C33.066 13.438 32.5637 13.199 32.1473 12.7208C31.7309 12.2427 31.5226 11.6568 31.5226 10.963C31.5226 10.2693 31.7309 9.68333 32.1473 9.2052C32.5637 8.72707 33.066 8.48801 33.6543 8.48801C34.2658 8.48801 34.7376 8.71614 35.0696 9.17239V6.74426ZM32.9903 11.9193C33.2233 12.163 33.5145 12.2849 33.864 12.2849C34.2134 12.2849 34.5017 12.1615 34.7288 11.9146C34.956 11.6677 35.0696 11.3505 35.0696 10.963C35.0696 10.5755 34.956 10.2583 34.7288 10.0114C34.5017 9.76457 34.2134 9.64114 33.864 9.64114C33.5145 9.64114 33.2248 9.76457 32.9947 10.0114C32.7646 10.2583 32.6496 10.5755 32.6496 10.963C32.6496 11.3505 32.7632 11.6693 32.9903 11.9193ZM43.4389 13.3068H42.1285L40.5385 11.1786V13.3068H39.4115V6.74426H40.5385V10.6818L42.0411 8.61926H43.3865L41.6305 10.9349L43.4389 13.3068ZM44.5571 8.05676C44.3708 8.05676 44.2092 7.98333 44.0723 7.83645C43.9354 7.68957 43.867 7.51614 43.867 7.31614C43.867 7.11614 43.9354 6.94114 44.0723 6.79114C44.2092 6.64114 44.3708 6.56614 44.5571 6.56614C44.7493 6.56614 44.9139 6.64114 45.0507 6.79114C45.1876 6.94114 45.256 7.11614 45.256 7.31614C45.256 7.51614 45.1876 7.68957 45.0507 7.83645C44.9139 7.98333 44.7493 8.05676 44.5571 8.05676ZM43.998 13.3068V8.61926H45.125V13.3068H43.998ZM48.6545 9.78176H47.6673V11.7318C47.6673 11.8943 47.7051 12.013 47.7808 12.088C47.8565 12.163 47.9672 12.2052 48.1128 12.2146C48.2584 12.224 48.439 12.2224 48.6545 12.2099V13.3068C47.8798 13.4005 47.3338 13.3224 47.0164 13.0724C46.699 12.8224 46.5403 12.3755 46.5403 11.7318V9.78176H45.7802V8.61926H46.5403V7.67239L47.6673 7.30676V8.61926H48.6545V9.78176Z" fill="#E7F5FE"/>
      </svg>
      
      {/* Mobile version */}
      <svg 
        className={`md:hidden ${className}`}
        width={32} 
        height={12} 
        viewBox="0 0 32 12" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        {...props}
      >
        <path d="M30.6159 0.204834H1.49989C0.932343 0.204834 0.47226 0.698556 0.47226 1.30759V10.8648C0.47226 11.4739 0.932343 11.9676 1.49989 11.9676H30.6159C31.1835 11.9676 31.6436 11.4739 31.6436 10.8648V1.30759C31.6436 0.698556 31.1835 0.204834 30.6159 0.204834Z" fill="#0053A4"/>
<path d="M9.37835 3.14552V4.87926H8.90276V3.99111L7.40631 5.54974L7.07005 5.1995L8.5665 3.64087H7.71377V3.14552H9.37835ZM5.21971 3.14552V3.64087H4.36699L5.86344 5.1995L5.52718 5.54974L4.03073 3.99111V4.87926H3.55514V3.14552H5.21971ZM7.40631 6.80649L8.90276 8.36511V7.47695H9.37835V9.2107H7.71377V8.71534H8.5665L7.07005 7.15672L7.40631 6.80649ZM7.08792 5.16725L7.43728 5.51107L4.37357 8.70991H5.23321V9.2107H3.55514V7.45795H4.03459V8.35584L7.08792 5.16725Z" fill="#E7F5FE"/>
<path d="M14.3692 3.8807H15.032V7.74035H14.3692V7.41504C14.1739 7.68338 13.8965 7.81755 13.5368 7.81755C13.1908 7.81755 12.8954 7.67695 12.6505 7.39574C12.4056 7.11454 12.2831 6.76993 12.2831 6.3619C12.2831 5.95388 12.4056 5.60927 12.6505 5.32807C12.8954 5.04686 13.1908 4.90626 13.5368 4.90626C13.8965 4.90626 14.1739 5.04043 14.3692 5.30877V3.8807ZM13.1463 6.92431C13.2833 7.06767 13.4546 7.13935 13.6601 7.13935C13.8656 7.13935 14.0352 7.06675 14.1688 6.92155C14.3024 6.77636 14.3692 6.58981 14.3692 6.3619C14.3692 6.134 14.3024 5.94745 14.1688 5.80225C14.0352 5.65706 13.8656 5.58446 13.6601 5.58446C13.4546 5.58446 13.2842 5.65706 13.1489 5.80225C13.0136 5.94745 12.9459 6.134 12.9459 6.3619C12.9459 6.58981 13.0127 6.77728 13.1463 6.92431ZM17.0667 4.90626C17.3476 4.90626 17.5797 5.00735 17.7629 5.20952C17.9462 5.4117 18.0378 5.69106 18.0378 6.04762V7.74035H17.375V6.13584C17.375 5.95204 17.3287 5.81144 17.2363 5.71403C17.1438 5.61662 17.0205 5.56792 16.8663 5.56792C16.695 5.56792 16.558 5.62489 16.4553 5.73885C16.3525 5.8528 16.3011 6.02372 16.3011 6.25163V7.74035H15.6383V4.98346H16.3011V5.29223C16.4621 5.03492 16.7173 4.90626 17.0667 4.90626ZM20.5504 3.8807H21.2132V7.74035H20.5504V7.41504C20.3551 7.68338 20.0776 7.81755 19.718 7.81755C19.372 7.81755 19.0766 7.67695 18.8316 7.39574C18.5867 7.11454 18.4643 6.76993 18.4643 6.3619C18.4643 5.95388 18.5867 5.60927 18.8316 5.32807C19.0766 5.04686 19.372 4.90626 19.718 4.90626C20.0776 4.90626 20.3551 5.04043 20.5504 5.30877V3.8807ZM19.3275 6.92431C19.4645 7.06767 19.6358 7.13935 19.8413 7.13935C20.0468 7.13935 20.2164 7.06675 20.35 6.92155C20.4836 6.77636 20.5504 6.58981 20.5504 6.3619C20.5504 6.134 20.4836 5.94745 20.35 5.80225C20.2164 5.65706 20.0468 5.58446 19.8413 5.58446C19.6358 5.58446 19.4654 5.65706 19.33 5.80225C19.1947 5.94745 19.1271 6.134 19.1271 6.3619C19.1271 6.58981 19.1939 6.77728 19.3275 6.92431ZM25.4727 7.74035H24.702L23.7668 6.48872V7.74035H23.104V3.8807H23.7668V6.19649L24.6506 4.98346H25.4419L24.4091 6.34536L25.4727 7.74035ZM26.1304 4.65263C26.0207 4.65263 25.9257 4.60944 25.8452 4.52305C25.7647 4.43667 25.7244 4.33467 25.7244 4.21704C25.7244 4.09941 25.7647 3.99649 25.8452 3.90827C25.9257 3.82004 26.0207 3.77594 26.1304 3.77594C26.2434 3.77594 26.3402 3.82004 26.4207 3.90827C26.5012 3.99649 26.5414 4.09941 26.5414 4.21704C26.5414 4.33467 26.5012 4.43667 26.4207 4.52305C26.3402 4.60944 26.2434 4.65263 26.1304 4.65263ZM25.8015 7.74035V4.98346H26.4643V7.74035H25.8015ZM28.5401 5.66717H27.9595V6.81404C27.9595 6.90961 27.9818 6.97945 28.0263 7.02356C28.0709 7.06767 28.1359 7.09248 28.2216 7.098C28.3072 7.10351 28.4134 7.10259 28.5401 7.09524V7.74035C28.0846 7.79549 27.7634 7.74954 27.5767 7.60251C27.3901 7.45547 27.2967 7.19265 27.2967 6.81404V5.66717H26.8497V4.98346H27.2967V4.42656L27.9595 4.21152V4.98346H28.5401V5.66717Z" fill="#E7F5FE"/>
      </svg>
    </>
  );
};

export default DndkitIcon;
