import { ThumbsUp, ThumbsDown } from "lucide-react";
import { comments } from "../data/mockData";

export function Comments() {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-6 mb-6">
        <span>{comments.length} Comments</span>
      </div>

      {/* Add Comment */}
      <div className="flex gap-4 mb-8">
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
          alt="Your avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full border-b border-gray-300 pb-2 outline-none focus:border-gray-900"
          />
          <div className="flex gap-2 justify-end mt-2">
            <button className="px-4 py-2 text-sm hover:bg-gray-100 rounded-full transition-colors">
              Cancel
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <img
              src={comment.avatar}
              alt={comment.author}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{comment.author}</span>
                <span className="text-xs text-gray-600">{comment.timestamp}</span>
              </div>
              <p className="text-sm mb-2">{comment.content}</p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm hover:bg-gray-100 px-2 py-1 rounded-full transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{comment.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-sm hover:bg-gray-100 px-2 py-1 rounded-full transition-colors">
                  <ThumbsDown className="w-4 h-4" />
                </button>
                <button className="text-sm hover:bg-gray-100 px-3 py-1 rounded-full transition-colors">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
