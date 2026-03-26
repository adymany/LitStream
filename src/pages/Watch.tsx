import { useSearchParams, Link } from "react-router-dom";
import { ChevronLeft, Download } from "lucide-react";
import { videos } from "../data/mockData";
import { VideoPlayer } from "../components/VideoPlayer";
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
            subtitleUrl={content.subtitleUrl}
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

            {/* Title */}
            <h1 className="watch-title">{content.title}</h1>

            {/* Description */}
            <p className="watch-description">{content.description}</p>

            {/* Action Buttons */}
            <div className="watch-actions">
              {content.downloadUrl && (
                <a href={content.downloadUrl} download className="watch-btn watch-btn-icon" title="Download Offline">
                  <Download /> Download Original
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
