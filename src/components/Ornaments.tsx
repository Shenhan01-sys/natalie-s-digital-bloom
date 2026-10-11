import { cn } from "@/lib/utils";

/** Pink clay wax seal from Natalie's Canva assets, stamped with her initial. */
export const Seal = ({ className, letter = "N" }: { className?: string; letter?: string }) => (
  <span aria-hidden className={cn("relative inline-grid place-items-center [container-type:inline-size]", className)}>
    <img src="/deco/seal.webp" alt="" className="h-full w-full object-contain drop-shadow-[0_10px_14px_rgba(184,54,90,.25)]" />
    <span className="absolute font-display italic leading-none text-accent-foreground/80 [font-size:42cqw]">
      {letter}
    </span>
  </span>
);

/** Clay star from Natalie's Canva assets. */
export const ClayStar = ({ className }: { className?: string }) => (
  <img
    aria-hidden
    src="/deco/star.webp"
    alt=""
    className={cn("pointer-events-none select-none object-contain drop-shadow-[0_10px_14px_rgba(184,54,90,.22)]", className)}
  />
);

/** Five-petal flower used in the hero cloud band (reference: pink candy UI). */
export const Flower = ({ className, color = "currentColor" }: { className?: string; color?: string }) => (
  <svg aria-hidden viewBox="0 0 40 40" className={className}>
    {[0, 72, 144, 216, 288].map((r) => (
      <ellipse key={r} cx="20" cy="10.5" rx="7" ry="9.5" fill={color} transform={`rotate(${r} 20 20)`} />
    ))}
    <circle cx="20" cy="20" r="5" fill="#fff6e5" />
  </svg>
);

/** Layered blush clouds with scattered flowers along the bottom of the hero. */
export const CloudBand = ({ className }: { className?: string }) => (
  <div aria-hidden className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-56 md:h-72", className)}>
    <svg viewBox="0 0 1440 300" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      <path
        d="M0 150 C 90 90 190 90 260 140 C 320 70 450 70 520 135 C 600 80 720 85 780 140 C 850 75 980 70 1050 130 C 1120 80 1240 80 1300 135 C 1360 100 1410 105 1440 120 L1440 300 L0 300 Z"
        fill="hsl(var(--petal))"
        opacity=".55"
      />
      <path
        d="M0 205 C 80 160 170 160 240 200 C 310 150 420 150 490 198 C 560 150 690 152 750 200 C 830 150 950 150 1020 196 C 1090 152 1210 155 1270 200 C 1340 165 1400 168 1440 185 L1440 300 L0 300 Z"
        fill="hsl(var(--blush-2))"
        opacity=".8"
      />
      <path
        d="M0 255 C 100 222 210 222 290 250 C 370 220 500 220 570 250 C 660 222 780 222 850 252 C 930 222 1060 222 1130 250 C 1210 224 1340 224 1440 245 L1440 300 L0 300 Z"
        fill="hsl(var(--blush))"
      />
      <path
        d="M0 290 C 160 270 300 272 420 286 C 560 268 720 268 860 286 C 1000 270 1160 270 1290 286 C 1360 278 1410 278 1440 282 L1440 300 L0 300 Z"
        fill="hsl(var(--background))"
      />
    </svg>
    <Flower className="absolute bottom-[38%] left-[6%] h-10 w-10" color="#fff" />
    <Flower className="absolute bottom-[18%] left-[18%] h-6 w-6" color="hsl(var(--rose))" />
    <Flower className="absolute bottom-[46%] left-[33%] h-5 w-5" color="hsl(var(--rose) / .6)" />
    <Flower className="absolute bottom-[24%] right-[30%] h-8 w-8" color="#fff" />
    <Flower className="absolute bottom-[42%] right-[12%] h-12 w-12" color="hsl(var(--rose) / .75)" />
    <Flower className="absolute bottom-[12%] right-[5%] h-6 w-6" color="#fff" />
  </div>
);
