import { videos } from "../data/mockData";
import { ContentCard } from "../components/ContentCard";

export function Trending() {
  return (
    <div className="netflix-trending">
      <div className="trending-header">
        <h1 className="trending-title">New & Popular</h1>
      </div>

      <div className="trending-grid">
        {videos.map((content) => (
          <ContentCard key={content.id} content={content} />
        ))}
      </div>
    </div>
  );
}
