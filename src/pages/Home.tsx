import { HeroSection } from "../components/HeroSection";
import { ContentRow } from "../components/ContentRow";
import { videos, genres, getContentByGenre, getFeaturedContent } from "../data/mockData";

export function Home() {
  const featuredContent = getFeaturedContent();
  const contentByGenre = getContentByGenre();

  return (
    <div className="netflix-home">
      {/* Hero Section */}
      {featuredContent && <HeroSection content={featuredContent} />}

      {/* Content Rows by Genre */}
      <div className="content-rows-container">
        {genres.map((genre) => {
          const items = contentByGenre[genre] || [];
          return (
            <ContentRow
              key={genre}
              title={genre}
              items={items}
            />
          );
        })}

        {/* If there are few genres populated, show all content */}
        {videos.length > 0 && (
          <ContentRow
            title="All Content"
            items={videos}
          />
        )}
      </div>
    </div>
  );
}
