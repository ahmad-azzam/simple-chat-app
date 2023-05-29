import { LucideProps, UserPlus } from "lucide-react";

export const Icons = {
  Logo: (props: LucideProps) => (
    <svg
      {...props}
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="60.000000pt"
      height="60.000000pt"
      viewBox="0 0 60.000000 60.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,60.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <path
          d="M84 527 c-3 -8 0 -43 6 -78 10 -63 10 -64 -16 -85 l-26 -21 33 -6
 c19 -3 100 -11 182 -18 81 -7 147 -16 147 -19 0 -3 -66 -12 -148 -19 -81 -7
 -162 -15 -181 -18 l-33 -6 26 -21 c26 -21 26 -22 15 -90 -8 -48 -8 -71 0 -79
 14 -14 466 212 466 233 0 10 -82 56 -225 128 -123 61 -228 112 -232 112 -5 0
 -11 -6 -14 -13z"
        />
      </g>
    </svg>
  ),
  UserPlus,
};

export type TIcon = keyof typeof Icons;
