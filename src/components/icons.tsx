import type { SVGProps } from 'react';

export function SkripsiKilatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 10v6M2 10v6" />
      <path d="M6 12v-2a6 6 0 0 1 12 0v2" />
      <path d="M6 18h12" />
      <path d="m10 10-1.5 1.5L10 13" />
      <path d="m14 10 1.5 1.5L14 13" />
      <path d="M4 22h16" />
    </svg>
  );
}
