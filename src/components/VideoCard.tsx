import { Link } from "react-router-dom";
import type { Video } from "../data/mockData";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link to={`/watch?v=${video.id}`} className="group cursor-pointer">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={`${video.videoUrl}#t=0.5`}
            className="w-full h-full object-cover"
            preload="metadata"
            muted
            playsInline
            onMouseOver={(e) => e.currentTarget.play()}
            onMouseOut={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0.5;
            }}
          />
        )}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
          {video.duration}
        </div>
      </div>
      <div className="flex gap-3 mt-3">
        <img
          src={video.channelAvatar}
          alt={video.channelName}
          className="w-9 h-9 rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="line-clamp-2 group-hover:text-gray-600 transition-colors">
            {video.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{video.channelName}</p>
          <p className="text-sm text-gray-600">
            {video.views} views • {video.uploadedAt}
          </p>
        </div>
      </div>
    </Link>
  );
}
