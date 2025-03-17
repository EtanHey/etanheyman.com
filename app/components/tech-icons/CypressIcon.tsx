import React from 'react';
import {TechIconProps} from './TechIcon';

const CypressIcon: React.FC<TechIconProps> = ({className = '', ...props}) => {
  return (
    <>
      {/* Desktop version */}
      <svg className={`hidden md:block ${className}`} width={45} height={47} viewBox='0 0 45 47' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <path d='M1.80441 29.1602C1.26232 27.186 0.986328 25.1355 0.986328 23.0702C0.986328 13.6423 6.90746 5.02181 15.7214 1.62236L16.877 4.61319C9.29019 7.54002 4.19453 14.9567 4.19453 23.0702C4.19453 24.8499 4.43107 26.6124 4.89678 28.3109L1.80441 29.1602Z' fill='#0053A4' />
        <path d='M41.6506 13.9624C38.2207 7.37759 31.4691 3.28643 24.0351 3.28643C21.4011 3.28643 18.8409 3.79351 16.4311 4.79045L15.2015 1.82916C18.0031 0.669757 20.9748 0.0789795 24.0351 0.0789795C32.6716 0.0789795 40.5123 4.82984 44.4966 12.4805L41.6506 13.9624Z' fill='url(#paint0_linear_68_932)' />
        <path d='M17.1531 18.3267C19.0134 18.3267 20.5288 19.3187 21.3075 21.0492L21.3691 21.1847L24.4934 20.1237L24.427 19.9637C23.2171 17.0172 20.4302 15.1857 17.1531 15.1857C14.8491 15.1857 12.9765 15.9243 11.4291 17.4406C9.89148 18.9471 9.11287 20.8425 9.11287 23.0751C9.11287 25.2881 9.89148 27.1737 11.4291 28.6802C12.9765 30.1966 14.8491 30.935 17.1531 30.935C20.4302 30.935 23.2171 29.1036 24.427 26.1595L24.4934 25.9995L21.3641 24.9361L21.305 25.0764C20.6077 26.7774 19.0553 27.794 17.1531 27.794C15.857 27.794 14.7629 27.3411 13.8955 26.45C13.0184 25.5465 12.5749 24.4118 12.5749 23.0776C12.5749 21.7336 13.0085 20.6209 13.8955 19.6757C14.7604 18.7797 15.857 18.3267 17.1531 18.3267Z' fill='#0053A4' />
        <path d='M36.7225 15.4762L32.27 26.7429L27.7879 15.4762H24.1214L30.4071 30.8538L25.9349 41.6995L29.1407 42.3371L40.187 15.4762H36.7225Z' fill='#0053A4' />
        <path d='M26.5085 40.3013L25.7274 42.1919C25.5721 42.566 25.2173 42.8195 24.8181 42.8367C24.5545 42.8466 24.2884 42.854 24.0198 42.854C14.8264 42.8491 6.69257 36.3677 4.67697 27.4371L1.54761 28.1435C2.67861 33.1529 5.51722 37.6994 9.54101 40.9488C13.6117 44.2349 18.7393 46.0491 23.9853 46.059C23.9927 46.059 24.0321 46.059 24.0321 46.059C24.3401 46.059 24.6456 46.0516 24.9512 46.0393C26.5972 45.9704 28.0683 44.939 28.6966 43.4103L29.7166 40.9389L26.5085 40.3013Z' fill='url(#paint1_linear_68_932)' />
        <defs>
          <linearGradient id='paint0_linear_68_932' x1='10.5443' y1='-4.83656' x2='55.8151' y2='16.8626' gradientUnits='userSpaceOnUse'>
            <stop offset='0.0939' stopColor='#0053A4' />
            <stop offset='0.9883' stopColor='#0053A4' stopOpacity='0' />
          </linearGradient>
          <linearGradient id='paint1_linear_68_932' x1='0.740702' y1='33.5309' x2='34.1666' y2='42.4277' gradientUnits='userSpaceOnUse'>
            <stop offset='0.0774' stopColor='#0053A4' />
            <stop offset='0.7617' stopColor='#00003F' />
          </linearGradient>
        </defs>
      </svg>

      {/* Mobile version */}
      <svg className={`md:hidden ${className}`} width={27} height={28} viewBox='0 0 27 28' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <path d='M0.903204 17.8919C0.584379 16.7308 0.422058 15.5248 0.422058 14.3102C0.422058 8.76525 3.9045 3.69521 9.0883 1.69587L9.76797 3.45489C5.30587 5.17627 2.30893 9.53833 2.30893 14.3102C2.30893 15.3569 2.44804 16.3934 2.72195 17.3924L0.903204 17.8919Z' fill='#0053A4' />
        <path d='M24.3383 8.95349C22.321 5.08073 18.3502 2.67457 13.9779 2.67457C12.4287 2.67457 10.923 2.9728 9.50571 3.55914L8.78255 1.81749C10.4303 1.13561 12.178 0.788147 13.9779 0.788147C19.0574 0.788147 23.6688 3.58231 26.0121 8.08192L24.3383 8.95349Z' fill='url(#paint0_linear_72_1533)' />
        <path d='M9.93036 11.5203C11.0245 11.5203 11.9157 12.1038 12.3737 13.1215L12.4099 13.2012L14.2475 12.5772L14.2084 12.4831C13.4968 10.7501 11.8578 9.67299 9.93036 9.67299C8.5753 9.67299 7.47394 10.1074 6.56384 10.9992C5.65952 11.8852 5.20158 13 5.20158 14.313C5.20158 15.6146 5.65952 16.7236 6.56384 17.6096C7.47394 18.5014 8.5753 18.9358 9.93036 18.9358C11.8578 18.9358 13.4968 17.8586 14.2084 16.1271L14.2475 16.033L12.407 15.4075L12.3723 15.4901C11.9621 16.4905 11.0491 17.0884 9.93036 17.0884C9.16804 17.0884 8.5246 16.822 8.01445 16.2979C7.49856 15.7666 7.23771 15.0992 7.23771 14.3145C7.23771 13.524 7.49276 12.8697 8.01445 12.3137C8.52313 11.7868 9.16804 11.5203 9.93036 11.5203Z' fill='#0053A4' />
        <path d='M21.4398 9.84385L18.8212 16.4702L16.1851 9.84385H14.0286L17.7255 18.888L15.0953 25.2667L16.9807 25.6417L23.4774 9.84385H21.4398Z' fill='#0053A4' />
        <path d='M15.4326 24.4444L14.9732 25.5563C14.8819 25.7764 14.6732 25.9255 14.4385 25.9356C14.2834 25.9414 14.1269 25.9458 13.9689 25.9458C8.56193 25.9429 3.77812 22.1309 2.59266 16.8785L0.752168 17.294C1.41735 20.2402 3.08685 22.9142 5.45339 24.8252C7.8475 26.7579 10.8633 27.8249 13.9486 27.8307C13.953 27.8307 13.9761 27.8307 13.9761 27.8307C14.1573 27.8307 14.337 27.8264 14.5167 27.8192C15.4848 27.7786 16.35 27.172 16.7195 26.273L17.3194 24.8194L15.4326 24.4444Z' fill='url(#paint1_linear_72_1533)' />
        <defs>
          <linearGradient id='paint0_linear_72_1533' x1='6.04345' y1='-2.10287' x2='32.6689' y2='10.6592' gradientUnits='userSpaceOnUse'>
            <stop offset='0.0939' stopColor='#0053A4' />
            <stop offset='0.9883' stopColor='#0053A4' stopOpacity='0' />
          </linearGradient>
          <linearGradient id='paint1_linear_72_1533' x1='0.277596' y1='20.4625' x2='19.9367' y2='25.695' gradientUnits='userSpaceOnUse'>
            <stop offset='0.0774' stopColor='#0053A4' />
            <stop offset='0.7617' stopColor='#00003F' />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
};

export default CypressIcon;
