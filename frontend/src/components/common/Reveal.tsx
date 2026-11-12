import { CSSProperties, ElementType, ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

type RevealProps = { children: ReactNode; className?: string; delay?: number; as?: ElementType };

/** Fades content up the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={cn("reveal", visible && "is-visible", className)} style={{ "--delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
