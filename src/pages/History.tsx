import { Clock, Trash2 } from "lucide-react";
import { videos } from "../data/mockData";
import { Link } from "react-router-dom";

export function History() {
  // Show first 6 videos as history
  const historyVideos = videos.slice(0, 6);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="w-8 h-8" />
          <h1 className="text-3xl">Watch History</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-full transition-colors">
          <Trash2 className="w-5 h-5" />
          Clear all watch history
        </button>
      </div>

      {/* History List */}
      <div className="space-y-4 max-w-5xl">
        {historyVideos.map((video) => (
          <div key={video.id} className="flex gap-4 group">
            <Link to={`/watch?v=${video.id}`} className="relative w-80 flex-shrink-0">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full aspect-video object-cover rounded-xl"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                {video.duration}
              </div>
            </Link>
            <div className="flex-1">
              <Link to={`/watch?v=${video.id}`}>
                <h3 className="text-lg mb-2 group-hover:text-gray-600 transition-colors">
                  {video.title}
                </h3>
              </Link>
              <Link
                to={`/channel/${video.channelId}`}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {video.channelName}
              </Link>
              <p className="text-sm text-gray-600 mt-1">
                {video.views} views • {video.uploadedAt}
              </p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {video.description}
              </p>
            </div>
            <button className="p-2 h-fit opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-full transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        {historyVideos.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Your watch history is empty</p>
          </div>
        )}
      </div>
    </div>
  );
}
