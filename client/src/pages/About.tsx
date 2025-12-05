import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function About() {
  const team = [
    {
      name: "Ahmed Hassan",
      role: "Founder & CEO",
      specialization: "Fitness Expert",
    },
    {
      name: "Fatima Ali",
      role: "Head Trainer",
      specialization: "Cardio & HIIT",
    },
    {
      name: "Mohammed Karim",
      role: "Strength Coach",
      specialization: "Weightlifting",
    },
    {
      name: "Layla Ibrahim",
      role: "Yoga Instructor",
      specialization: "Yoga & Flexibility",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About FitZone</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your premier fitness destination for transformation and wellness
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">Our Story</h2>
            <p className="text-gray-300 text-lg mb-6">
              FitZone was founded in 2015 with a simple mission: to make fitness
              accessible and enjoyable for everyone. What started as a small gym
              with just a few equipment pieces has grown into a thriving fitness
              community with state-of-the-art facilities and professional trainers.
            </p>
            <p className="text-gray-300 text-lg mb-6">
              Over the years, we've helped thousands of members achieve their
              fitness goals through personalized training, diverse classes, and a
              supportive community. Our commitment to excellence and innovation has
              made us a leader in the fitness industry.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="bg-gray-900 border-red-600 p-8">
              <h3 className="text-2xl font-bold mb-4 text-red-600">Our Vision</h3>
              <p className="text-gray-300">
                To be the most trusted and innovative fitness center, inspiring
                individuals to achieve their health and wellness goals while
                building a supportive community.
              </p>
            </Card>
            <Card className="bg-gray-900 border-red-600 p-8">
              <h3 className="text-2xl font-bold mb-4 text-red-600">Our Mission</h3>
              <p className="text-gray-300">
                To provide world-class fitness facilities, professional training,
                and personalized guidance to help our members transform their
                bodies and minds.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="bg-black border-gray-700 p-6 text-center hover:border-red-600 transition-colors"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-gray-700 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-red-600 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-400">{member.specialization}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <Card className="bg-gray-900 border-gray-700 p-8 text-center">
              <h3 className="text-xl font-bold mb-4 text-red-600">Excellence</h3>
              <p className="text-gray-300">
                We strive for excellence in everything we do, from training to
                customer service.
              </p>
            </Card>
            <Card className="bg-gray-900 border-gray-700 p-8 text-center">
              <h3 className="text-xl font-bold mb-4 text-red-600">Community</h3>
              <p className="text-gray-300">
                We believe in building a supportive community where everyone can
                thrive.
              </p>
            </Card>
            <Card className="bg-gray-900 border-gray-700 p-8 text-center">
              <h3 className="text-xl font-bold mb-4 text-red-600">Innovation</h3>
              <p className="text-gray-300">
                We continuously innovate to provide the best fitness experience.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
