import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Star } from "lucide-react";

export default function Trainers() {
  const { data: trainers, isLoading } = trpc.trainers.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading trainers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Our Trainers</h1>
          <p className="text-xl text-gray-300">
            Meet our expert fitness professionals
          </p>
        </div>
      </section>

      {/* Trainers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {trainers && trainers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainers.map((trainer) => (
                <Card
                  key={trainer.id}
                  className="bg-gray-900 border-gray-800 overflow-hidden hover:border-red-600 transition-colors"
                >
                  {trainer.image && (
                    <div className="h-64 bg-gradient-to-br from-red-600 to-gray-700 overflow-hidden">
                      <img
                        src={trainer.image}
                        alt={trainer.specialization || "Trainer"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">
                      {trainer.specialization}
                    </h3>
                    <p className="text-gray-400 mb-4">{trainer.bio}</p>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
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
                        <span className="text-sm text-gray-400">
                          ({trainer.totalReviews} reviews)
                        </span>
                      </div>
                      {trainer.experience && (
                        <p className="text-sm text-gray-400">
                          {trainer.experience} years experience
                        </p>
                      )}
                    </div>

                    <Button
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => (window.location.href = `/trainers/${trainer.id}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">No trainers available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
