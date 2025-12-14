import { useSearchParams } from "react-router-dom";
import { videos } from "../data/mockData";
import { ContentCard } from "../components/ContentCard";

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const searchResults = videos.filter((video) =>
    video.title.toLowerCase().includes(query.toLowerCase()) ||
    video.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="netflix-search">
      <div className="search-header">
        <h1 className="search-title">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        {searchResults.length > 0 && (
          <p className="search-count">{searchResults.length} titles</p>
        )}
      </div>

      {searchResults.length > 0 ? (
        <div className="search-results-grid">
          {searchResults.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      ) : (
        <div className="search-no-results">
          <p>No results found for "{query}"</p>
          <p className="search-suggestion">
            Try different keywords or browse our categories
          </p>
        </div>
      )}
    </div>
  );
}
