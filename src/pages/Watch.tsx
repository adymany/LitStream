import { useSearchParams, Link } from "react-router-dom";
import { Play, Plus, ThumbsUp, Share2, ChevronLeft } from "lucide-react";
import { videos } from "../data/mockData";
import { VideoPlayer } from "../components/VideoPlayer";
import { ContentRow } from "../components/ContentRow";

export function Watch() {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const content = videos.find((v) => v.id === videoId);

  if (!content) {
    return (
      <div className="watch-not-found">
        <p>Content not found</p>
        <Link to="/" className="back-home-link">
          Back to Home
        </Link>
      </div>
    );
  }

  // Get similar content (same genre)
  const similarContent = videos
    .filter((v) => v.id !== videoId && v.genre.some((g) => content.genre.includes(g)))
    .slice(0, 12);

  // Group similar content by first matching genre
  const moreLikeThis = similarContent.length > 0 ? similarContent : videos.filter((v) => v.id !== videoId).slice(0, 8);

  return (
    <div className="netflix-watch">
      {/* Back Button */}
      <Link to="/" className="watch-back-btn">
        <ChevronLeft />
        <span>Back to Browse</span>
      </Link>

      {/* Video Player - Full Width */}
      <div className="watch-player-container">
        {content.videoUrl ? (
          <VideoPlayer
            key={content.id}
            src={content.videoUrl}
            poster={content.thumbnail}
            autoPlay
          />
        ) : (
          <div className="watch-no-video">
            <p>Video unavailable</p>
          </div>
        )}
      </div>

      {/* Content Info */}
      <div className="watch-info-section">
        <div className="watch-info-grid">
          {/* Left Column - Main Info */}
          <div className="watch-info-main">
            {/* Meta Row */}
            <div className="watch-meta">
              <span className="watch-match">{content.match}% Match</span>
              <span className="watch-year">{content.year}</span>
              <span className="watch-rating">{content.maturityRating}</span>
              {content.type === 'series' && content.season && (
                <span className="watch-season">
                  Season {content.season}, Episode {content.episode}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="watch-title">{content.title}</h1>

            {/* Description */}
            <p className="watch-description">{content.description}</p>

            {/* Action Buttons */}
            <div className="watch-actions">
              <button className="watch-btn watch-btn-primary">
                <Play fill="currentColor" />
                Play
              </button>
              <button className="watch-btn watch-btn-secondary">
                <Plus />
                My List
              </button>
              <button className="watch-btn watch-btn-icon">
                <ThumbsUp />
              </button>
              <button className="watch-btn watch-btn-icon">
                <Share2 />
              </button>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="watch-info-side">
            <div className="watch-info-item">
              <span className="info-label">Genres:</span>
              <span className="info-value">{content.genre.join(", ")}</span>
            </div>
            <div className="watch-info-item">
              <span className="info-label">Type:</span>
              <span className="info-value">{content.type === 'series' ? 'TV Series' : 'Film'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* More Like This Section */}
      <div className="watch-more-section">
        <ContentRow
          title="More Like This"
          items={moreLikeThis}
        />
      </div>
    </div>
  );
}
