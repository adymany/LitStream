import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import type { Content } from "../data/mockData";

interface HeroSectionProps {
    content: Content;
}

export function HeroSection({ content }: HeroSectionProps) {
    return (
        <div className="hero-section">
            {/* Background */}
            <div className="hero-background">
                {content.thumbnail ? (
                    <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="hero-bg-image"
                    />
                ) : content.videoUrl ? (
                    <video
                        src={`${content.videoUrl}#t=5`}
                        className="hero-bg-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                ) : (
                    <div className="hero-bg-placeholder" />
                )}
                <div className="hero-gradient" />
            </div>

            {/* Content */}
            <div className="hero-content">
                <div className="hero-info">
                    {/* Title */}
                    <h1 className="hero-title">{content.title}</h1>


                    {/* Description */}
                    <p className="hero-description">{content.description}</p>

                    {/* Genre Tags */}
                    <div className="hero-genres">
                        {content.genre.slice(0, 3).map((genre, index) => (
                            <span key={genre} className="hero-genre-tag">
                                {index > 0 && <span className="genre-dot">•</span>}
                                {genre}
                            </span>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="hero-actions">
                        <Link
                            to={`/watch?v=${content.id}`}
                            className="hero-btn hero-btn-play"
                        >
                            <Play className="hero-btn-icon" fill="currentColor" />
                            Play
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
