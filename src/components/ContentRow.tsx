import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ContentCard } from "./ContentCard";
import type { Content } from "../data/mockData";

interface ContentRowProps {
    title: string;
    items: Content[];
}

export function ContentRow({ title, items }: ContentRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const scroll = (direction: "left" | "right") => {
        if (!rowRef.current) return;

        const scrollAmount = rowRef.current.clientWidth * 0.8;
        const newScrollLeft =
            direction === "left"
                ? rowRef.current.scrollLeft - scrollAmount
                : rowRef.current.scrollLeft + scrollAmount;

        rowRef.current.scrollTo({
            left: newScrollLeft,
            behavior: "smooth",
        });
    };

    const handleScroll = () => {
        if (!rowRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
        setShowLeftArrow(scrollLeft > 10);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    if (items.length === 0) return null;

    return (
        <div className="content-row">
            <h2 className="content-row-title">{title}</h2>

            <div className="content-row-wrapper">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button
                        className="content-row-arrow content-row-arrow-left"
                        onClick={() => scroll("left")}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="arrow-icon" />
                    </button>
                )}

                {/* Content Slider */}
                <div
                    ref={rowRef}
                    className="content-row-slider"
                    onScroll={handleScroll}
                >
                    {items.map((item) => (
                        <ContentCard key={item.id} content={item} />
                    ))}
                </div>

                {/* Right Arrow */}
                {showRightArrow && (
                    <button
                        className="content-row-arrow content-row-arrow-right"
                        onClick={() => scroll("right")}
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="arrow-icon" />
                    </button>
                )}
            </div>
        </div>
    );
}
