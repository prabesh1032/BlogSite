import defaultAvatar from "../assets/useravatar/useravatar.avif";
import { ArrowRight, Bookmark, Calendar, Heart } from "lucide-react";

export default function BlogCard({
    image,
    category,
    title,
    date,
    onClick,
    authorName = "Author",
    authorImage,
    showActions = false,
    isLiked = false,
    isBookmarked = false,
    onToggleLike,
    onToggleBookmark,
}) {
    return (
        <div 
            className="group w-full bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
            onClick={onClick}
        >
            {/* Image Section */}
            <div className="p-4 pb-0">
                <div className="relative w-full h-56 sm:h-60 md:h-64 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100">
                    <img 
                        src={image} 
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />

                    {showActions && (
                        <div className="absolute right-3 top-3 flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onToggleLike?.();
                                }}
                                className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-all duration-300 cursor-pointer ${
                                    isLiked
                                        ? "border-red-200 bg-red-500 text-white"
                                        : "border-white/70 bg-white/90 text-gray-700 hover:bg-white"
                                }`}
                                aria-label={isLiked ? "Unlike post" : "Like post"}
                            >
                                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                            </button>

                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onToggleBookmark?.();
                                }}
                                className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-all duration-300 cursor-pointer ${
                                    isBookmarked
                                        ? "border-amber-200 bg-amber-500 text-white"
                                        : "border-white/70 bg-white/90 text-gray-700 hover:bg-white"
                                }`}
                                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
                            >
                                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 sm:p-6 text-left">
                {/* Category */}
                <div className="mb-3">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                        {category}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 leading-snug line-clamp-2 min-h-12">
                    {title}
                </h3>

                {/* Author + Read */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={authorImage || defaultAvatar}
                            alt={authorName}
                            className="w-9 h-9 rounded-full object-cover"
                            loading="lazy"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-800">{authorName}</span>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{date}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center text-sm font-semibold text-blue-600">
                        <span>Read</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}