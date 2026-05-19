import defaultAvatar from "../assets/useravatar/useravatar.avif";
import { Calendar, ArrowRight } from "lucide-react";

export default function BlogCard({
    image,
    category,
    title,
    date,
    onClick,
    authorName = "Author",
    authorImage,
}) {
    return (
        <div 
            className="group w-full bg-white rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            onClick={onClick}
        >
            {/* Image Section */}
            <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden bg-gray-100">
                <img 
                    src={image} 
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                />
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Content Section */}
            <div className="p-5 sm:p-6 text-left">
                {/* Category */}
                <div className="mb-3">
                    <span className="inline-block text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full">
                        {category}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {title}
                </h3>

                {/* Author */}
                <div className="flex items-center gap-3 mt-4">
                    <img
                        src={authorImage || defaultAvatar}
                        alt={authorName}
                        className="w-9 h-9 rounded-full object-cover"
                        loading="lazy"
                    />
                    <span className="text-sm font-medium text-gray-700">{authorName}</span>
                </div>

                {/* Meta Information Row */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        <span className="tracking-wide">{date}</span>
                    </div>

                    {/* Read More Link */}
                    <div className="flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all duration-300">
                        <span>Read</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}