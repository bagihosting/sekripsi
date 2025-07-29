import type { SVGProps } from 'react';

export function DesignBloomIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L6 8V16L12 22L18 16V8L12 2Z" />
      <path d="M12 2V22" />
      <path d="M18 16L6 8" />
      <path d="M6 16L18 8" />
    </svg>
  );
}
