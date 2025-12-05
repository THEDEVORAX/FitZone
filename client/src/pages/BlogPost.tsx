import { trpc } from "@/lib/trpc";
import { useRoute } from "wouter";
import { Card } from "@/components/ui/card";
import { Streamdown } from "streamdown";

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery(
    { slug: slug! },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading blog post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Blog post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 max-w-3xl">
          <span className="text-red-600 font-semibold">{post.category}</span>
          <h1 className="text-5xl font-bold mt-4 mb-4">{post.title}</h1>
          <p className="text-gray-400">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </p>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-3xl">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="bg-gray-900 border-gray-800 p-8">
            {post.content && (
              <Streamdown className="prose prose-invert max-w-none">
                {post.content}
              </Streamdown>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
