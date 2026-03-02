import Hero from "./Hero";
import BlogCard from "../../components/BlogCard";

const dummyBlogs = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop",
        category: "DESIGN",
        title: "3 Benefits of Minimalism In Interior Design.",
        date: "JUNE 15, 2018"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
        category: "TECHNOLOGY",
        title: "The Future of Web Development in 2026.",
        date: "JANUARY 20, 2026"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&h=400&fit=crop",
        category: "TRAVEL",
        title: "10 Must-Visit Destinations This Summer.",
        date: "MARCH 5, 2025"
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop",
        category: "FOOD",
        title: "The Art of Cooking Mediterranean Cuisine.",
        date: "FEBRUARY 12, 2026"
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&h=400&fit=crop",
        category: "LIFESTYLE",
        title: "Building Better Habits for Success.",
        date: "NOVEMBER 8, 2025"
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
        category: "BUSINESS",
        title: "Starting Your Own Business in 2026.",
        date: "JANUARY 15, 2026"
    }
];

export default function Home() {
    return (
        <>
            <Hero />
            
            {/* Blog Cards Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
                        Latest Articles
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                        {dummyBlogs.map((blog) => (
                            <BlogCard
                                key={blog.id}
                                image={blog.image}
                                category={blog.category}
                                title={blog.title}
                                date={blog.date}
                                onClick={() => console.log(`Clicked blog: ${blog.title}`)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}