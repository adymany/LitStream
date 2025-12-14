
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIDEOS_DIR = path.join(__dirname, '../public/videos');
const OUTPUT_FILE = path.join(__dirname, '../src/data/generatedVideos.json');



function scanVideos() {
  if (!fs.existsSync(VIDEOS_DIR)) {
    console.log('Creating videos directory...');
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(VIDEOS_DIR);
  const videoFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.mp4', '.webm', '.mkv', '.mov'].includes(ext);
  });

  const generatedVideos = videoFiles.map((file, index) => {
    return {
      id: `local-${index}`,
      title: path.basename(file, path.extname(file)), // Filename as title
      thumbnail: "", // Empty thumbnail to trigger video frame fallback
      channelName: "Local User",
      channelAvatar: "https://github.com/shadcn.png",
      views: "0",
      uploadedAt: "Just now",
      duration: "Unknown",
      description: "Local video file",
      likes: "0",
      channelId: "local-user",
      videoUrl: `/videos/${file}`
    };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(generatedVideos, null, 2));
  console.log(`Generated ${generatedVideos.length} videos in ${OUTPUT_FILE}`);
}

scanVideos();
