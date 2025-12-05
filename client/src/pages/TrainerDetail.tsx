import { trpc } from "@/lib/trpc";
import { useRoute } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function TrainerDetail() {
  const [match, params] = useRoute("/trainers/:id");
  const trainerId = params?.id ? parseInt(params.id) : null;

  const { data: trainer, isLoading } = trpc.trainers.getById.useQuery(
    { id: trainerId! },
    { enabled: !!trainerId }
  );

  const { data: reviews } = trpc.trainers.getReviews.useQuery(
    { trainerId: trainerId! },
    { enabled: !!trainerId }
  );

  const { data: classes } = trpc.classes.getByTrainer.useQuery(
    { trainerId: trainerId! },
    { enabled: !!trainerId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading trainer...</p>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Trainer not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Trainer Header */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainer.image && (
              <div className="h-96 bg-gradient-to-br from-red-600 to-gray-700 rounded-lg overflow-hidden">
                <img
                  src={trainer.image}
                  alt={trainer.specialization || "Trainer"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="md:col-span-2">
              <h1 className="text-5xl font-bold mb-4">
                {trainer.specialization}
              </h1>
              <p className="text-xl text-gray-300 mb-6">{trainer.bio}</p>

              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Rating</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={
                            i <
                            Math.round(
                              parseFloat(trainer.rating?.toString() || "0")
                            )
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-600"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-lg">
                      {trainer.rating} ({trainer.totalReviews} reviews)
                    </span>
                  </div>
                </div>

                {trainer.experience && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Experience</h3>
                    <p className="text-gray-300">
                      {trainer.experience} years in fitness industry
                    </p>
                  </div>
                )}
              </div>

              <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6">
                Book a Session
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      {classes && classes.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8">Classes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {classes.map((cls) => (
                <Card
                  key={cls.id}
                  className="bg-black border-gray-700 p-6 hover:border-red-600 transition-colors"
                >
                  <h3 className="text-xl font-bold mb-2">{cls.title}</h3>
                  <p className="text-gray-400 mb-4">{cls.description}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(cls.startTime).toLocaleDateString()} at{" "}
                    {new Date(cls.startTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      {reviews && reviews.length > 0 && (
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8">Reviews</h2>
            <div className="space-y-6 max-w-3xl">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="bg-gray-900 border-gray-700 p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-600"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-300">{review.comment}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
