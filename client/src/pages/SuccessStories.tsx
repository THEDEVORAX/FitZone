import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";

export default function SuccessStories() {
  const { data: stories, isLoading } =
    trpc.successStories.getPublished.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading success stories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Success Stories</h1>
          <p className="text-xl text-gray-300">
            Inspiring transformations from our community
          </p>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {stories && stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stories.map((story) => (
                <Card
                  key={story.id}
                  className="bg-gray-900 border-gray-800 overflow-hidden hover:border-red-600 transition-colors"
                >
                  <div className="grid grid-cols-2 gap-4 p-6">
                    {story.beforeImage && (
                      <div>
                        <p className="text-sm font-semibold text-gray-400 mb-2">
                          Before
                        </p>
                        <img
                          src={story.beforeImage}
                          alt="Before"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    {story.afterImage && (
                      <div>
                        <p className="text-sm font-semibold text-red-600 mb-2">
                          After
                        </p>
                        <img
                          src={story.afterImage}
                          alt="After"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  <div className="px-6 pb-6">
                    <h3 className="text-2xl font-bold mb-2">{story.title}</h3>
                    <p className="text-gray-400 mb-4">{story.description}</p>
                    {story.duration && (
                      <p className="text-sm text-red-600 font-semibold">
                        Duration: {story.duration}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">
                No success stories available yet
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for Your Transformation?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community and start your own success story today
          </p>
        </div>
      </section>
    </div>
  );
}
