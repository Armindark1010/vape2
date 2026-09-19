import { h, type FunctionalComponent } from "vue";

export interface IconProps {
  size?: number;
  className?: string;
  class?: string;
  sw?: number;
  filled?: boolean;
}

const b = (p: IconProps) => ({
  width: p.size ?? 22,
  height: p.size ?? 22,
  viewBox: "0 0 24 24",
  fill: p.filled ? "currentColor" : "none",
  stroke: "currentColor",
  "stroke-width": p.sw ?? 1.7,
  "stroke-linecap": "round" as const,
  "stroke-linejoin": "round" as const,
  class: p.class || p.className,
  "aria-hidden": "true",
});

export const HomeIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [h("path", { d: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" })]);

export const GridIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("rect", { x: "3.5", y: "3.5", width: "7", height: "7", rx: "1.6" }),
    h("rect", { x: "13.5", y: "3.5", width: "7", height: "7", rx: "1.6" }),
    h("rect", { x: "3.5", y: "13.5", width: "7", height: "7", rx: "1.6" }),
    h("rect", { x: "13.5", y: "13.5", width: "7", height: "7", rx: "1.6" }),
  ]);

export const SearchIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [h("circle", { cx: "11", cy: "11", r: "7" }), h("path", { d: "m21 21-4.3-4.3" })]);

export const BagIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "M6.5 8h11l.9 12.2a1 1 0 0 1-1 1.1H6.6a1 1 0 0 1-1-1.1Z" }),
    h("path", { d: "M9 10.5V6a3 3 0 0 1 6 0v4.5" }),
  ]);

export const UserIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("circle", { cx: "12", cy: "8", r: "4" }),
    h("path", { d: "M4.5 20.5c1.4-3.6 4.2-5.4 7.5-5.4s6.1 1.8 7.5 5.4" }),
  ]);

export const PlusIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [h("path", { d: "M12 5v14M5 12h14" })]);

export const MinusIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [h("path", { d: "M5 12h14" })]);

export const TrashIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [h("path", { d: "M4 7h16M9.5 7V5h5v2m-8 0 1 12.5h9L17.5 7" })]);

export const CheckIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [h("path", { d: "m4.5 12.5 5 5L19.5 7" })]);

export const CloseIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [h("path", { d: "m6 6 12 12M18 6 6 18" })]);

export const ChevronLeftIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [h("path", { d: "m14 6-6 6 6 6" })]);

export const ChevronDownIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [h("path", { d: "m6 9 6 6 6-6" })]);

export const FlameIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "M12 3s5.5 4.6 5.5 9.6a5.5 5.5 0 0 1-11 0C6.5 9.2 9 7 10.4 5.2c.4-.5.9-1 1.6-2.2Z" }),
  ]);

export const ZapIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [h("path", { d: "M13 2 4 14h6l-1 8 9-12h-6l1-8Z" })]);

export const ShieldIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" }),
    h("path", { d: "m9 12 2 2 4-4.5" }),
  ]);

export const TruckIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "M2.5 6h11v11h-11zM13.5 10h3.6l2.9 3.3V17h-6.5" }),
    h("circle", { cx: "6.5", cy: "17.5", r: "1.9" }),
    h("circle", { cx: "17", cy: "17.5", r: "1.9" }),
  ]);

export const DropletIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [h("path", { d: "M12 3s6 6.2 6 10.6a6 6 0 0 1-12 0C6 9.2 12 3 12 3Z" })]);

export const HeartIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", {
      d: "M12 20.3 4.8 13a4.6 4.6 0 0 1 6.5-6.5l.7.7.7-.7A4.6 4.6 0 0 1 19.2 13L12 20.3Z",
    }),
  ]);

export const StarIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", {
      d: "m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z",
    }),
  ]);

export const ArrowLeftIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [h("path", { d: "M19 12H5m6-7-7 7 7 7" })]);

export const RefreshIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3" }),
    h("path", { d: "M20 4v4h-4M4 20v-4h4" }),
  ]);

export const TagIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "M3.5 3.5h8l9 9-8 8-9-9v-8Z" }),
    h("circle", { cx: "8.5", cy: "8.5", r: "1.4" }),
  ]);

export const SlidersIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "M4 8h10M18 8h2M4 16h2M10 16h10" }),
    h("circle", { cx: "16", cy: "8", r: "2.4" }),
    h("circle", { cx: "8", cy: "16", r: "2.4" }),
  ]);

export const Cube3DIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "m21 16-9 5-9-5V8l9-5 9 5v8Z" }),
    h("path", { d: "m3.27 6.96 8.73 4.88 8.73-4.88M12 21.84V11.84" }),
  ]);

export const CameraIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
    h("circle", { cx: "12", cy: "13", r: "4" }),
  ]);

export const Rotate3DIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-1.19" }),
  ]);

export const SparklesIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" }),
  ]);

export const SmartphoneIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("rect", { x: "5", y: "2", width: "14", height: "20", rx: "3", ry: "3" }),
    h("path", { d: "M12 18h.01" }),
  ]);

export const LockIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("rect", { x: "4", y: "11", width: "16", height: "11", rx: "2", ry: "2" }),
    h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }),
  ]);

export const KeyIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "m21 2-2 2m-1.5 1.5L14 9l-2-2-4 4 2 2-6 6a3 3 0 0 0 4 4l6-6 2 2 4-4-2-2 3.5-3.5" }),
    h("circle", { cx: "7.5", cy: "16.5", r: "1.5" }),
  ]);

export const EyeIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }),
    h("circle", { cx: "12", cy: "12", r: "3" }),
  ]);

export const EyeOffIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "M9.88 9.88a3 3 0 1 0 4.24 4.24" }),
    h("path", { d: "M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" }),
    h("path", { d: "M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" }),
    h("line", { x1: "2", y1: "2", x2: "22", y2: "22" }),
  ]);

export const InfoIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("circle", { cx: "12", cy: "12", r: "10" }),
    h("path", { d: "M12 16v-4M12 8h.01" }),
  ]);

export const EditIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }),
    h("path", { d: "m15 5 4 4" }),
  ]);

export const BoltIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "M13 2 3 14h9l-1 8 10-12h-9l1-8z" }),
  ]);

export const UserPlusIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
    h("circle", { cx: "9", cy: "7", r: "4" }),
    h("line", { x1: "19", y1: "8", x2: "19", y2: "14" }),
    h("line", { x1: "22", y1: "11", x2: "16", y2: "11" }),
  ]);

export const BellIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("path", { d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" }),
    h("path", { d: "M10.3 21a1.94 1.94 0 0 0 3.4 0" }),
  ]);

export const ClockIcon: FunctionalComponent<IconProps> = (p) =>
  h("svg", b(p), [
    h("circle", { cx: "12", cy: "12", r: "10" }),
    h("path", { d: "M12 6v6l4 2" }),
  ]);


