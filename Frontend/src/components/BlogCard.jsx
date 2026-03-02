export default function BlogCard({ image, category, title, date, onClick }) {
    return (
        <div 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 max-w-sm"
            onClick={onClick}
        >
            {/* Image Section */}
            <div className="w-full h-64 overflow-hidden">
                <img 
                    src={image} 
                    alt={title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Content Section */}
            <div className="p-6 text-center">
                {/* Category */}
                <div className="mb-4">
                    <span className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        {category}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                    {title}
                </h3>

                {/* Date */}
                <p className="text-xs text-gray-500 tracking-wide uppercase">
                    {date}
                </p>
            </div>
        </div>
    );
}