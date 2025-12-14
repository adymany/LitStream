import { useParams } from "react-router-dom";
import { Bell, Check } from "lucide-react";
import { channels, videos } from "../data/mockData";
import { VideoCard } from "../components/VideoCard";
import { useState } from "react";

export function Channel() {
  const { id } = useParams();
  const channel = channels.find((c) => c.id === id);
  const [activeTab, setActiveTab] = useState("videos");

  if (!channel) {
    return (
      <div className="p-6">
        <p>Channel not found</p>
      </div>
    );
  }

  // Get channel's videos
  const channelVideos = videos.filter((v) => v.channelId === channel.id);

  const tabs = ["Videos", "Shorts", "Playlists", "About"];

  return (
    <div>
      {/* Channel Banner */}
      <div className="w-full h-48 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <img
          src={channel.banner}
          alt={channel.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Channel Info */}
      <div className="px-6 pt-6">
        <div className="flex flex-wrap items-start gap-6 mb-4">
          <img
            src={channel.avatar}
            alt={channel.name}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl">{channel.name}</h1>
              {channel.verified && (
                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
              <span>@{channel.name.toLowerCase().replace(/\s+/g, "")}</span>
              <span>•</span>
              <span>{channel.subscribers} subscribers</span>
              <span>•</span>
              <span>{channelVideos.length} videos</span>
            </div>
            <p className="text-sm text-gray-600 mb-4 max-w-2xl">{channel.description}</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                <Bell className="w-4 h-4" />
                Subscribe
              </button>
              <button className="bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? "border-gray-900"
                    : "border-transparent hover:border-gray-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {channelVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}

        {activeTab === "shorts" && (
          <div className="text-center py-12 text-gray-600">
            <p>No shorts available yet</p>
          </div>
        )}

        {activeTab === "playlists" && (
          <div className="text-center py-12 text-gray-600">
            <p>No playlists available yet</p>
          </div>
        )}

        {activeTab === "about" && (
          <div className="max-w-4xl">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">Description</h3>
                <p className="text-gray-600">{channel.description}</p>
              </div>
              <div>
                <h3 className="mb-2">Stats</h3>
                <p className="text-sm text-gray-600">Joined Dec 8, 2020</p>
                <p className="text-sm text-gray-600 mt-1">
                  {channel.subscribers} subscribers
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
