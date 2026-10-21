import type { SVGProps } from "react";

export function ArchiveMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 72" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 7 32 2 56 7v29c0 17-24 33-24 33S8 53 8 36V7Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M13 11 32 7l19 4v25c0 12-19 27-19 27S13 48 13 36V11Z"
        stroke="currentColor"
        strokeWidth=".6"
      />
      <path
        d="M22 39V23h5v5h10v-5h5v16M28 39v-8h8v8M18 42h28M20 46h24M32 12v6M29 15h6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M22 51c4-1 7 0 10 2 3-2 6-3 10-2M32 53v5"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}
