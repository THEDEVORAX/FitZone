import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Dumbbell, Users, Zap, Target } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Dumbbell,
      title: "Professional Trainers",
      description: "Expert trainers with years of experience in fitness",
    },
    {
      icon: Zap,
      title: "Diverse Classes",
      description: "Cardio, weightlifting, yoga, zumba and more",
    },
    {
      icon: Users,
      title: "Community",
      description: "Join a supportive community of fitness enthusiasts",
    },
    {
      icon: Target,
      title: "Results",
      description: "Achieve your fitness goals with our proven methods",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Transform Your <span className="text-red-600">Body</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join FitZone and start your fitness journey with professional trainers and state-of-the-art facilities
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6"
              onClick={() => (window.location.href = "/classes")}
            >
              Explore Classes
            </Button>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black text-lg px-8 py-6"
              onClick={() => (window.location.href = "/subscriptions")}
            >
              View Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose FitZone</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="bg-gray-800 border-gray-700 p-6 hover:border-red-600 transition-colors"
                >
                  <Icon className="w-12 h-12 text-red-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Choose a subscription plan and start your transformation today
          </p>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6"
              onClick={() => (window.location.href = "/subscriptions")}
            >
              View Subscription Plans
            </Button>
        </div>
      </section>
    </div>
  );
}
