import React from "react";
import { TechIconProps } from "./TechIcon";

const YarnIcon: React.FC<TechIconProps> = ({ className = "", ...props }) => {
  return (
    <>
      {/* Desktop version */}
      <svg
        className={`hidden md:block ${className}`}
        width={47}
        height={47}
        viewBox="0 0 47 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M23.4312 0.206909C10.7323 0.206909 0.431152 10.5081 0.431152 23.2069C0.431152 35.9058 10.7323 46.2069 23.4312 46.2069C36.13 46.2069 46.4312 35.9058 46.4312 23.2069C46.4312 10.5081 36.13 0.206909 23.4312 0.206909Z"
          fill="#0053A4"
        />
        <path
          d="M36.9647 31.4834C35.5439 31.8208 34.8246 32.1316 33.0663 33.2772C30.3223 35.0532 27.3207 35.8791 27.3207 35.8791C27.3207 35.8791 27.0721 36.2521 26.3528 36.4208C25.1095 36.7227 20.4296 36.9803 20.0034 36.9891C18.8578 36.998 18.1562 36.6961 17.9609 36.2254C17.3659 34.8046 18.8134 34.183 18.8134 34.183C18.8134 34.183 18.4937 33.9876 18.3072 33.81C18.1385 33.6413 17.9609 33.3038 17.9076 33.4281C17.6856 33.9698 17.5701 35.293 16.9752 35.888C16.1582 36.7139 14.613 36.4386 13.6983 35.959C12.6949 35.4262 13.7694 34.1741 13.7694 34.1741C13.7694 34.1741 13.2277 34.4938 12.7925 33.8366C12.4018 33.2328 12.0377 32.2027 12.1354 30.9328C12.242 29.4853 13.8582 28.0822 13.8582 28.0822C13.8582 28.0822 13.574 25.942 14.5064 23.7486C15.3501 21.7505 17.6234 20.1432 17.6234 20.1432C17.6234 20.1432 15.7142 18.0297 16.4246 16.1293C16.8864 14.8861 17.0729 14.8949 17.2238 14.8417C17.7566 14.6374 18.2717 14.4154 18.6535 13.998C20.5628 11.9378 22.996 12.3285 22.996 12.3285C22.996 12.3285 24.1505 8.82081 25.2161 9.50459C25.5447 9.71772 26.7257 12.3463 26.7257 12.3463C26.7257 12.3463 27.9868 11.6092 28.1288 11.8845C28.8925 13.3675 28.9813 16.2003 28.6439 17.9231C28.0756 20.7648 26.6547 22.2922 26.0864 23.2513C25.9532 23.4733 27.6138 24.1749 28.6617 27.0787C29.6296 29.7339 28.7682 31.9629 28.9192 32.2115C28.9458 32.2559 28.9547 32.2737 28.9547 32.2737C28.9547 32.2737 30.0647 32.3625 32.2937 30.9861C33.4837 30.249 34.8956 29.4231 36.503 29.4054C38.057 29.3787 38.1369 31.1992 36.9647 31.4834ZM39.0783 30.178C38.9184 28.9169 37.8528 28.0467 36.4852 28.0644C34.4427 28.0911 32.7288 29.1478 31.5922 29.8494C31.1481 30.1247 30.7663 30.3289 30.4377 30.4799C30.5088 29.4498 30.4466 28.1 29.9138 26.6169C29.2655 24.8409 28.3952 23.7486 27.7736 23.1181C28.4929 22.0702 29.4786 20.5428 29.9404 18.1807C30.34 16.1648 30.2157 13.0301 29.301 11.2718C29.1145 10.9166 28.8037 10.659 28.413 10.5525C28.2532 10.5081 27.9512 10.4193 27.3562 10.588C26.4593 8.73201 26.1485 8.53664 25.9088 8.37679C25.4115 8.0571 24.8254 7.98606 24.2748 8.19031C23.5377 8.45672 22.9072 9.16714 22.3122 10.4281C22.2234 10.6146 22.1435 10.7922 22.0725 10.9698C20.9447 11.0498 19.1686 11.4583 17.6678 13.0834C17.4813 13.2876 17.1173 13.4386 16.7354 13.5807H16.7443C15.9628 13.8559 15.6076 14.4953 15.1725 15.6498C14.5686 17.266 15.1902 18.8556 15.803 19.8857C14.9682 20.6316 13.8582 21.8216 13.2721 23.2158C12.5439 24.9386 12.464 26.6258 12.4906 27.5405C11.869 28.1976 10.9099 29.432 10.8034 30.8173C10.6613 32.7532 11.3628 34.0675 11.6736 34.5471C11.7624 34.6891 11.8601 34.8046 11.9667 34.92C11.9312 35.1598 11.9223 35.4173 11.9756 35.6837C12.091 36.3054 12.4817 36.8115 13.0767 37.1312C14.2489 37.7529 15.8829 38.0193 17.1439 37.3888C17.5968 37.8683 18.4227 38.3301 19.9234 38.3301H20.0122C20.3941 38.3301 25.2427 38.0725 26.6547 37.7262C27.2852 37.5752 27.7203 37.3088 28.0045 37.0691C28.9103 36.7849 31.4145 35.9324 33.7767 34.405C35.4462 33.3216 36.0234 33.0907 37.2667 32.7888C38.4744 32.4957 39.2292 31.3946 39.0783 30.178Z"
          fill="#E7F5FE"
        />
      </svg>

      {/* Mobile version */}
      <svg
        className={`md:hidden ${className}`}
        width={28}
        height={28}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M14.0579 0.947571C6.58923 0.947571 0.530731 7.00607 0.530731 14.4747C0.530731 21.9434 6.58923 28.0019 14.0579 28.0019C21.5266 28.0019 27.5851 21.9434 27.5851 14.4747C27.5851 7.00607 21.5266 0.947571 14.0579 0.947571Z"
          fill="#0053A4"
        />
        <path
          d="M22.0175 19.3424C21.1819 19.5409 20.7588 19.7237 19.7247 20.3974C18.1108 21.442 16.3455 21.9277 16.3455 21.9277C16.3455 21.9277 16.1993 22.1471 15.7762 22.2463C15.045 22.4239 12.2926 22.5754 12.0419 22.5806C11.3681 22.5858 10.9555 22.4082 10.8406 22.1314C10.4907 21.2958 11.342 20.9302 11.342 20.9302C11.342 20.9302 11.154 20.8153 11.0443 20.7108C10.9451 20.6116 10.8406 20.4131 10.8093 20.4862C10.6787 20.8048 10.6108 21.583 10.2609 21.933C9.78039 22.4187 8.87161 22.2568 8.33366 21.9747C7.74348 21.6614 8.37544 20.925 8.37544 20.925C8.37544 20.925 8.05685 21.113 7.80093 20.7265C7.57113 20.3713 7.35699 19.7655 7.41444 19.0186C7.47712 18.1673 8.42767 17.3421 8.42767 17.3421C8.42767 17.3421 8.26054 16.0834 8.80894 14.7933C9.30511 13.6182 10.6422 12.6729 10.6422 12.6729C10.6422 12.6729 9.51925 11.4298 9.93708 10.3121C10.2087 9.58093 10.3183 9.58616 10.4071 9.55482C10.7205 9.43469 11.0234 9.30412 11.248 9.05865C12.3709 7.84695 13.802 8.07675 13.802 8.07675C13.802 8.07675 14.481 6.01373 15.1077 6.41589C15.3009 6.54124 15.9956 8.0872 15.9956 8.0872C15.9956 8.0872 16.7372 7.6537 16.8208 7.81561C17.27 8.68783 17.3222 10.3539 17.1237 11.3671C16.7894 13.0385 15.9538 13.9368 15.6195 14.5009C15.5412 14.6314 16.5179 15.044 17.1342 16.7519C17.7034 18.3135 17.1968 19.6245 17.2856 19.7707C17.3013 19.7968 17.3065 19.8073 17.3065 19.8073C17.3065 19.8073 17.9594 19.8595 19.2703 19.05C19.9702 18.6165 20.8006 18.1307 21.7459 18.1203C22.6599 18.1046 22.7069 19.1753 22.0175 19.3424ZM23.2606 18.5747C23.1665 17.833 22.5398 17.3212 21.7355 17.3316C20.5342 17.3473 19.5262 17.9688 18.8577 18.3814C18.5966 18.5433 18.372 18.6635 18.1787 18.7523C18.2205 18.1464 18.1839 17.3525 17.8706 16.4803C17.4893 15.4357 16.9775 14.7933 16.6119 14.4225C17.0349 13.8062 17.6147 12.9079 17.8862 11.5186C18.1213 10.333 18.0482 8.48936 17.5102 7.45524C17.4005 7.24632 17.2177 7.09486 16.9879 7.03219C16.8939 7.00607 16.7163 6.95384 16.3664 7.05308C15.8389 5.9615 15.6561 5.8466 15.5151 5.75259C15.2226 5.56457 14.8779 5.52278 14.5541 5.64291C14.1206 5.79959 13.7498 6.21742 13.3998 6.95906C13.3476 7.06874 13.3006 7.1732 13.2588 7.27766C12.5955 7.32467 11.5509 7.56492 10.6683 8.5207C10.5586 8.64082 10.3445 8.72961 10.1199 8.81318H10.1251C9.66549 8.97508 9.45657 9.35113 9.20065 10.0301C8.8455 10.9807 9.2111 11.9155 9.57148 12.5214C9.08053 12.9601 8.42767 13.66 8.08297 14.48C7.65469 15.4932 7.60769 16.4855 7.62335 17.0235C7.25776 17.41 6.69369 18.136 6.63101 18.9507C6.54745 20.0893 6.96005 20.8623 7.14285 21.1443C7.19508 21.2279 7.25253 21.2958 7.31521 21.3637C7.29432 21.5047 7.28909 21.6562 7.32043 21.8128C7.38833 22.1784 7.61813 22.4761 7.96806 22.6642C8.65748 23.0298 9.61848 23.1864 10.3601 22.8156C10.6265 23.0977 11.1122 23.3692 11.9949 23.3692H12.0471C12.2717 23.3692 15.1234 23.2178 15.9538 23.0141C16.3246 22.9253 16.5805 22.7686 16.7477 22.6276C17.2804 22.4605 18.7532 21.9591 20.1425 21.0607C21.1244 20.4236 21.4639 20.2878 22.1951 20.1102C22.9054 19.9378 23.3493 19.2902 23.2606 18.5747Z"
          fill="#E7F5FE"
        />
      </svg>
    </>
  );
};

export default YarnIcon;
