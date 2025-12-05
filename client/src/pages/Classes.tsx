import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useState } from "react";

export default function Classes() {
  const { user } = useAuth();
  const { data: classes, isLoading } = trpc.classes.getAll.useQuery({
    upcomingOnly: true,
  });
  const { data: classTypes } = trpc.classTypes.getAll.useQuery();
  const [selectedType, setSelectedType] = useState<number | null>(null);

  const filteredClasses = selectedType
    ? classes?.filter((c) => c.classTypeId === selectedType)
    : classes;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading classes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Our Classes</h1>
          <p className="text-xl text-gray-300">
            Choose from our diverse range of fitness classes
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <h3 className="text-lg font-semibold mb-4">Filter by Type</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === null ? "default" : "outline"}
              onClick={() => setSelectedType(null)}
              className={
                selectedType === null
                  ? "bg-red-600 hover:bg-red-700"
                  : "text-gray-300 border-gray-600 hover:border-gray-400"
              }
            >
              All Classes
            </Button>
            {classTypes?.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                onClick={() => setSelectedType(type.id)}
                className={
                  selectedType === type.id
                    ? "bg-red-600 hover:bg-red-700"
                    : "text-gray-300 border-gray-600 hover:border-gray-400"
                }
              >
                {type.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredClasses && filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredClasses.map((cls) => (
                <Card
                  key={cls.id}
                  className="bg-gray-900 border-gray-800 overflow-hidden hover:border-red-600 transition-colors"
                >
                  {cls.image && (
                    <div className="h-48 bg-gradient-to-br from-red-600 to-gray-700 overflow-hidden">
                      <img
                        src={cls.image}
                        alt={cls.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{cls.title}</h3>
                    <p className="text-gray-400 mb-4">{cls.description}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar size={16} />
                        {formatDate(cls.startTime)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock size={16} />
                        {new Date(cls.startTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(cls.endTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Users size={16} />
                        {cls.currentEnrollment ?? 0} / {cls.maxCapacity} enrolled
                      </div>
                    </div>

                    {user ? (
                      <Button
                        className="w-full bg-red-600 hover:bg-red-700"
                        onClick={() => (window.location.href = "/classes")}
                      >
                        Book Now
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-red-600 hover:bg-red-700"
                        onClick={() => (window.location.href = getLoginUrl())}
                      >
                        Login to Book
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">No classes available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
