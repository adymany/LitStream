/**
 * Vite Plugin: Auto Video Scanner
 * 
 * Automatically scans the public/videos directory for video files and
 * generates generatedVideos.json whenever the dev server starts or
 * when files are added/removed from the videos folder.
 */

import fs from 'fs';
import path from 'path';

const VIDEOS_DIR = 'public/videos';
const OUTPUT_FILE = 'src/data/generatedVideos.json';
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mkv', '.mov'];

function scanAndGenerateVideos() {
    const videosPath = path.resolve(VIDEOS_DIR);
    const outputPath = path.resolve(OUTPUT_FILE);

    if (!fs.existsSync(videosPath)) {
        console.log('[video-scanner] Creating videos directory...');
        fs.mkdirSync(videosPath, { recursive: true });
    }

    const files = fs.readdirSync(videosPath);
    const videoFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return VIDEO_EXTENSIONS.includes(ext);
    });

    const generatedVideos = videoFiles.map((file, index) => ({
        id: `local-${index}`,
        title: path.basename(file, path.extname(file)),
        thumbnail: "",
        videoUrl: `/videos/${file}`
    }));

    // Only write if content changed
    const newContent = JSON.stringify(generatedVideos, null, 2);
    let existingContent = '[]';

    if (fs.existsSync(outputPath)) {
        existingContent = fs.readFileSync(outputPath, 'utf-8');
    }

    if (newContent !== existingContent) {
        fs.writeFileSync(outputPath, newContent);
        console.log(`[video-scanner] Found ${generatedVideos.length} videos, updated ${OUTPUT_FILE}`);
        return true; // Content changed
    }

    console.log(`[video-scanner] ${generatedVideos.length} videos (no changes)`);
    return false;
}

export function autoVideoScanner() {
    let watcher = null;

    return {
        name: 'auto-video-scanner',

        // Run when Vite config is resolved
        configResolved() {
            // Initial scan on startup
            scanAndGenerateVideos();
        },

        // Set up file watcher in dev mode
        configureServer(server) {
            const videosPath = path.resolve(VIDEOS_DIR);

            // Create directory if it doesn't exist
            if (!fs.existsSync(videosPath)) {
                fs.mkdirSync(videosPath, { recursive: true });
            }

            // Watch for changes
            watcher = fs.watch(videosPath, (eventType, filename) => {
                if (filename && VIDEO_EXTENSIONS.some(ext => filename.endsWith(ext))) {
                    console.log(`[video-scanner] Detected ${eventType} for ${filename}`);
                    const changed = scanAndGenerateVideos();
                    if (changed) {
                        // Trigger HMR by invalidating the module
                        const mod = server.moduleGraph.getModuleById(
                            path.resolve('src/data/generatedVideos.json')
                        );
                        if (mod) {
                            server.moduleGraph.invalidateModule(mod);
                            server.ws.send({ type: 'full-reload' });
                        }
                    }
                }
            });

            console.log('[video-scanner] Watching', videosPath, 'for changes');
        },

        // Cleanup on close
        closeBundle() {
            if (watcher) {
                watcher.close();
                watcher = null;
            }
        }
    };
}

export default autoVideoScanner;
