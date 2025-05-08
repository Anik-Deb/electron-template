import React from 'react';
import { cn } from '@/utils';

const SMTPProviderIcon = ({ className }) => {
  return (
    <svg
      className={cn(className)}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_512_10753)">
        <path
          d="M0 15.0004L19.26 27.2579C19.48 27.4204 19.74 27.5004 20 27.5004C20.26 27.5004 20.52 27.4204 20.74 27.2579L40 15.0004L20.75 0.250352C20.305 -0.0821484 19.695 -0.0821484 19.25 0.250352L0 15.0004Z"
          fill="url(#paint0_linear_512_10753)"
        />
        <path
          d="M32.5 0H7.5C6.1225 0 5 1.1225 5 2.5V30C5 30.69 5.56 31.25 6.25 31.25H33.75C34.44 31.25 35 30.69 35 30V2.5C35 1.1225 33.88 0 32.5 0Z"
          fill="url(#paint1_linear_512_10753)"
        />
        <path
          d="M11.25 7.5H28.75C29.44 7.5 30 6.94 30 6.25C30 5.56 29.44 5 28.75 5H11.25C10.56 5 10 5.56 10 6.25C10 6.94 10.56 7.5 11.25 7.5Z"
          fill="white"
        />
        <path
          d="M28.75 10H11.25C10.56 10 10 10.56 10 11.25C10 11.94 10.56 12.5 11.25 12.5H28.75C29.44 12.5 30 11.94 30 11.25C30 10.56 29.44 10 28.75 10Z"
          fill="white"
        />
        <path
          d="M21.25 15H11.25C10.56 15 10 15.56 10 16.25C10 16.94 10.56 17.5 11.25 17.5H21.25C21.94 17.5 22.5 16.94 22.5 16.25C22.5 15.56 21.94 15 21.25 15Z"
          fill="white"
        />
        <path
          d="M20.74 27.2575C20.52 27.42 20.26 27.5 20 27.5C19.74 27.5 19.48 27.42 19.26 27.2575L0 15V37.5C0 38.88 1.12 40 2.5 40H37.5C38.88 40 40 38.88 40 37.5V15L20.74 27.2575Z"
          fill="url(#paint2_linear_512_10753)"
        />
        <path
          d="M37.5 40H2.5C1.0975 40 0 38.9025 0 37.5C0 37.1025 0.19 36.7275 0.51 36.4925L19.26 23.9925C19.48 23.83 19.74 23.75 20 23.75C20.26 23.75 20.52 23.83 20.74 23.9925L39.49 36.4925C39.81 36.7275 40 37.1025 40 37.5C40 38.9025 38.9025 40 37.5 40Z"
          fill="url(#paint3_linear_512_10753)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_512_10753"
          x1="20"
          y1="0.000976562"
          x2="20"
          y2="27.5004"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3D17C6" />
          <stop offset="1" stopColor="#A88FFF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_512_10753"
          x1="20"
          y1="0"
          x2="20"
          y2="23.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F7F4FF" />
          <stop offset="1" stopColor="#E2DCF6" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_512_10753"
          x1="20"
          y1="15"
          x2="20"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3D17C6" />
          <stop offset="1" stopColor="#A88FFF" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_512_10753"
          x1="20"
          y1="23.75"
          x2="20"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3D17C6" />
          <stop offset="1" stopColor="#A88FFF" />
        </linearGradient>
        <clipPath id="clip0_512_10753">
          <rect width="40" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SMTPProviderIcon;
