import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.getPublished.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">FitZone Blog</h1>
          <p className="text-xl text-gray-300">
            Fitness tips, nutrition advice, and wellness articles
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="bg-gray-900 border-gray-800 overflow-hidden hover:border-red-600 transition-colors"
                >
                  {post.featuredImage && (
                    <div className="h-48 bg-gradient-to-br from-red-600 to-gray-700 overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-sm text-red-600 font-semibold">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold mt-2 mb-2">{post.title}</h3>
                    <p className="text-gray-400 mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : ""}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                        onClick={() => (window.location.href = `/blog/${post.slug}`)}
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">No blog posts available yet</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
