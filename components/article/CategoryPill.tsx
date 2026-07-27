import Link from "next/link";
import { clsx } from "clsx";

interface CategoryPillProps {
  name: string;
  slug?: string;
  color?: string;
  size?: "xs" | "sm";
  className?: string;
}

export default function CategoryPill({
  name,
  slug,
  color = "#C41C1C",
  size = "xs",
  className,
}: CategoryPillProps) {
  const style = {
    backgroundColor: `${color}1A`, // 10% opacity
    color,
    borderColor: `${color}40`,     // 25% opacity border
  };

  const cls = clsx(
    "cat-pill border font-sans font-bold",
    size === "xs" ? "text-[0.6rem] px-2 py-0.5" : "text-xs px-2.5 py-1",
    className
  );

  if (slug) {
    return (
      <Link href={`/categories/${slug}`} style={style} className={cls}>
        {name}
      </Link>
    );
  }

  return (
    <span style={style} className={cls}>
      {name}
    </span>
  );
}
