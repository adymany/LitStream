import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import type { Content } from "../data/mockData";

interface ContentCardProps {
    content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const handleMouseEnter = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(true);
            videoRef.current?.play();
        }, 500);
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div
            className={`content-card ${isHovered ? "content-card-hovered" : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Thumbnail/Preview */}
            <Link to={`/watch?v=${content.id}`} className="content-card-media">
                {content.thumbnail ? (
                    <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="content-card-image"
                    />
                ) : (
                    <video
                        ref={videoRef}
                        src={`${content.videoUrl}#t=2`}
                        className="content-card-video"
                        muted
                        playsInline
                        loop
                        preload="metadata"
                    />
                )}

                {/* Duration Badge */}
                {content.duration && content.duration !== "Unknown" && (
                    <span className="content-card-duration">{content.duration}</span>
                )}

                {/* Episode Info */}
                {content.type === "series" && content.episode && (
                    <span className="content-card-episode">
                        S{content.season} E{content.episode}
                    </span>
                )}
            </Link>

            {/* Hover Info Panel */}
            {isHovered && (
                <div className="content-card-info">
                    {/* Action Buttons */}
                    <div className="content-card-actions">
                        <Link
                            to={`/watch?v=${content.id}`}
                            className="card-action-btn card-action-btn-play"
                            title="Play"
                        >
                            <Play fill="currentColor" />
                        </Link>
                        <button
                            className="card-action-btn"
                            title="Add to My List"
                        >
                            <Plus />
                        </button>
                        <button
                            className="card-action-btn"
                            title="Like"
                        >
                            <ThumbsUp />
                        </button>
                        <button
                            className="card-action-btn card-action-btn-more"
                            title="More Info"
                        >
                            <ChevronDown />
                        </button>
                    </div>

                    {/* Meta Info */}
                    <div className="content-card-meta">
                        <span className="card-match">{content.match}% Match</span>
                        <span className="card-rating">{content.maturityRating}</span>
                    </div>

                    {/* Title */}
                    <h3 className="content-card-title">{content.title}</h3>

                    {/* Genres */}
                    <div className="content-card-genres">
                        {content.genre.slice(0, 2).map((genre, index) => (
                            <span key={genre}>
                                {index > 0 && <span className="genre-dot">•</span>}
                                {genre}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
