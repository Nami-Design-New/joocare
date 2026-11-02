import type { SVGProps } from 'react';

export default function ProjectShareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6.263 3h-.694C3.605 3 2.623 3 2.013 3.586 1.402 4.172 1.402 5.114 1.402 7v2.667c0 1.885 0 2.828.61 3.414.611.586 1.593.586 3.557.586h2.804c1.964 0 2.946 0 3.557-.586.395-.38.534-.909.583-1.748" />
      <path d="M10.778 4.665V2.568c0-.13.11-.236.245-.236.065 0 .128.025.174.069l3.155 3.029a.79.79 0 0 1 0 1.138L11.197 9.596a.25.25 0 0 1-.174.07c-.135 0-.245-.106-.245-.237V7.332H8.744c-2.827 0-3.869 2.333-3.869 2.333V7.999c0-1.841 1.555-3.334 3.472-3.334h2.431Z" />
    </svg>
  );
}
