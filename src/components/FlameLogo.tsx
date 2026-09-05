interface FlameLogoProps {
  className?: string;
}

export default function FlameLogo({ className }: FlameLogoProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 4C38 20 30 32 30 46c0 12.5 9 20 20 20s20-7.5 20-20C70 32 62 20 50 4Z"
        fill="#c22a1c"
      />
      <path
        d="M50 30c-6 9-10 15.5-10 22.5 0 6.5 4.5 10.5 10 10.5s10-4 10-10.5C60 45.5 56 39 50 30Z"
        fill="#fda021"
      />
      <path
        d="M22 56c0-3 2-5 5-5h46c3 0 5 2 5 5v3c0 8-8 13-19 13H41c-11 0-19-5-19-13v-3Z"
        fill="#1c1917"
      />
      <path
        d="M22 58h56"
        stroke="#fdfbf6"
        strokeWidth="1.6"
      />
      {[30, 40, 50, 60, 70].map((x) => (
        <rect key={x} x={x - 1.5} y={53} width="3" height="10" rx="1.5" fill="#fdfbf6" />
      ))}
      <path
        d="M14 60c0-5 3-9 8-9h4c2 0 3 1.5 3 3.5S28 58 26 58h-3c-2 0-3 2-3 4s2 5 5 6l-2 3c-6-1.5-9-6-9-11Z"
        fill="#1c1917"
      />
      <path
        d="M86 60c0-5-3-9-8-9h-4c-2 0-3 1.5-3 3.5S72 58 74 58h3c2 0 3 2 3 4s-2 5-5 6l2 3c6-1.5 9-6 9-11Z"
        fill="#1c1917"
      />
      <path d="M8 82c14-6 70-6 84 0-6 3-20 4-42 4S14 85 8 82Z" fill="#1c1917" />
    </svg>
  );
}
