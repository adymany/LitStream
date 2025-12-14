// Netflix-style content data model

export interface Content {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  year: number;
  maturityRating: string;
  duration: string;
  genre: string[];
  match: number; // Percentage match (e.g., 98% match)
  type: 'movie' | 'series';
  season?: number;
  episode?: number;
  episodeTitle?: string;
}

// Genre categories for organizing content
export const genres = [
  "Trending Now",
  "Sci-Fi & Fantasy",
  "Drama",
  "Action & Adventure",
  "Horror",
  "Comedy",
  "Thriller",
  "Documentary",
  "Romance",
] as const;

export type Genre = typeof genres[number];

// CDN Base URL for video files
// Uses VITE_CDN_BASE_URL environment variable for production (Backblaze B2 + Cloudflare)
// Falls back to local /videos/ folder for development
const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL || '';

// B2 Authorization token for private bucket access
// Generate with: b2 bucket get-download-auth litstream --prefix videos/ --duration 604800
// Token expires after 7 days - regenerate and update this value
const B2_AUTH_TOKEN = import.meta.env.VITE_B2_AUTH_TOKEN || '';

/**
 * Get the full video URL, using CDN in production or local path in development
 * @param localPath - The local video path (e.g., "/videos/movie.mp4")
 * @returns Full URL for the video
 */
export function getVideoUrl(localPath: string): string {
  if (CDN_BASE_URL) {
    // In production, use CDN URL
    // localPath: "/videos/movie.mp4" -> CDN_BASE_URL + "/videos/movie.mp4"
    let url = `${CDN_BASE_URL}${localPath}`;

    // If auth token is set (for private buckets), append it
    if (B2_AUTH_TOKEN) {
      url += `?Authorization=${B2_AUTH_TOKEN}`;
    }

    return url;
  }
  // In development, use local path
  return localPath;
}

// Helper function to parse title for series info
function parseSeriesInfo(filename: string): {
  title: string;
  season?: number;
  episode?: number;
  cleanTitle: string;
} {
  // Match patterns like "Show-Name-s1-e2" or "Show-Name-S01E02"
  const seasonEpisodeMatch = filename.match(/(.+?)[-_]?[sS](\d+)[-_]?[eE](\d+)/);

  if (seasonEpisodeMatch) {
    const rawTitle = seasonEpisodeMatch[1];
    const season = parseInt(seasonEpisodeMatch[2], 10);
    const episode = parseInt(seasonEpisodeMatch[3], 10);

    // Clean up title: replace dashes/underscores with spaces
    const cleanTitle = rawTitle.replace(/[-_]/g, ' ').trim();

    return {
      title: cleanTitle,
      season,
      episode,
      cleanTitle
    };
  }

  // No season/episode found, just clean the title
  const cleanTitle = filename
    .replace(/_\d+p$/, '') // Remove resolution like _1080p
    .replace(/[-_]/g, ' ')
    .trim();

  return { title: cleanTitle, cleanTitle };
}

// Assign genre based on title keywords
function assignGenre(title: string): string[] {
  const lowerTitle = title.toLowerCase();
  const assignedGenres: string[] = [];

  if (lowerTitle.includes('stranger')) assignedGenres.push('Sci-Fi & Fantasy', 'Horror', 'Drama');
  else if (lowerTitle.includes('action')) assignedGenres.push('Action & Adventure');
  else if (lowerTitle.includes('comedy')) assignedGenres.push('Comedy');
  else if (lowerTitle.includes('horror') || lowerTitle.includes('scary')) assignedGenres.push('Horror', 'Thriller');
  else if (lowerTitle.includes('love') || lowerTitle.includes('romance')) assignedGenres.push('Romance', 'Drama');
  else if (lowerTitle.includes('documentary') || lowerTitle.includes('doc')) assignedGenres.push('Documentary');
  else assignedGenres.push('Trending Now', 'Drama');

  // Always add to trending
  if (!assignedGenres.includes('Trending Now')) {
    assignedGenres.unshift('Trending Now');
  }

  return assignedGenres;
}

// This will be populated dynamically
let cachedContent: Content[] | null = null;

// Dynamic video scanning function - runs in browser
export async function scanVideosDirectory(): Promise<Content[]> {
  if (cachedContent) return cachedContent;

  try {
    // Fetch the videos directory listing from Vite's dev server
    // In production, you'd have a manifest file or API
    const response = await fetch('/videos/');

    if (!response.ok) {
      console.log('Could not fetch video directory, using fallback');
      return getFallbackContent();
    }

    const html = await response.text();

    // Parse the directory listing HTML to extract video files
    const videoExtensions = ['.mp4', '.webm', '.mkv', '.mov'];
    const linkRegex = /href="([^"]+)"/g;
    const videos: Content[] = [];
    let match;
    let index = 0;

    while ((match = linkRegex.exec(html)) !== null) {
      const filename = match[1];
      const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();

      if (videoExtensions.includes(ext)) {
        const baseName = filename.slice(0, filename.lastIndexOf('.'));
        const parsed = parseSeriesInfo(baseName);
        const genres = assignGenre(parsed.title);

        videos.push({
          id: `video-${index}`,
          title: parsed.title,
          thumbnail: '', // Will use video frame as thumbnail
          videoUrl: `/videos/${filename}`,
          description: parsed.season
            ? `Season ${parsed.season}, Episode ${parsed.episode}`
            : 'Watch now on LitStream',
          year: 2024,
          maturityRating: 'TV-MA',
          duration: 'Unknown',
          genre: genres,
          match: Math.floor(Math.random() * 15) + 85, // 85-99% match
          type: parsed.season ? 'series' : 'movie',
          season: parsed.season,
          episode: parsed.episode,
        });

        index++;
      }
    }

    if (videos.length > 0) {
      cachedContent = videos;
      return videos;
    }

    return getFallbackContent();
  } catch (error) {
    console.log('Error scanning videos:', error);
    return getFallbackContent();
  }
}

// Fallback content when directory scanning fails
function getFallbackContent(): Content[] {
  // Import and transform the generated videos JSON
  return [];
}

// Synchronous getter for initial render (uses import)
import generatedVideosData from './generatedVideos.json';

function transformLegacyVideos(): Content[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (generatedVideosData as any[]).map((video, index) => {
    const parsed = parseSeriesInfo(video.title);
    const genreList = assignGenre(parsed.title);

    return {
      id: video.id || `video-${index}`,
      title: parsed.title,
      thumbnail: video.thumbnail || '',
      videoUrl: getVideoUrl(video.videoUrl),
      description: parsed.season
        ? `Season ${parsed.season}, Episode ${parsed.episode}`
        : 'Watch now on LitStream',
      year: 2024,
      maturityRating: 'TV-MA',
      duration: video.duration || 'Unknown',
      genre: genreList,
      match: Math.floor(Math.random() * 15) + 85,
      type: parsed.season ? 'series' as const : 'movie' as const,
      season: parsed.season,
      episode: parsed.episode,
    };
  });
}

// Export videos for immediate use
export const videos: Content[] = transformLegacyVideos();

// Group content by genre
export function getContentByGenre(): Record<string, Content[]> {
  const byGenre: Record<string, Content[]> = {};

  genres.forEach(genre => {
    byGenre[genre] = videos.filter(v => v.genre.includes(genre));
  });

  return byGenre;
}

// Get featured content for hero section
export function getFeaturedContent(): Content | undefined {
  return videos[0];
}

// For backwards compatibility - keeping videos export
// but removing YouTube-specific exports
