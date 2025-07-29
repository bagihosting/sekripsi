import type { SVGProps } from 'react';

export function DesignBloomIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 2a5 5 0 0 0-5 5c0 1.8.9 3.4 2.4 4.3" />
      <path d="M12 7a5 5 0 0 1 5 5c0 1.8-.9 3.4-2.4 4.3" />
      <path d="M12 22a5 5 0 0 1-5-5c0-1.8.9-3.4 2.4-4.3" />
      <path d="M12 17a5 5 0 0 0 5-5c0-1.8-.9-3.4-2.4-4.3" />
      <path d="M2 12a5 5 0 0 1 5-5c1.8 0 3.4.9 4.3 2.4" />
      <path d="M7 12a5 5 0 0 0 5 5c1.8 0 3.4-.9 4.3-2.4" />
      <path d="M22 12a5 5 0 0 0-5-5c-1.8 0-3.4.9-4.3 2.4" />
      <path d="M17 12a5 5 0 0 1-5 5c-1.8 0-3.4-.9-4.3-2.4" />
    </svg>
  );
}
