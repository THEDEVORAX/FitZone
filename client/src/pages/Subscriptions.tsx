import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Subscriptions() {
  const { user } = useAuth();
  const { data: plans, isLoading } = trpc.subscriptions.getPlans.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading subscription plans...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Subscription Plans</h1>
          <p className="text-xl text-gray-300">
            Choose the perfect plan for your fitness journey
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {plans && plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className="bg-gray-900 border-gray-800 p-8 relative hover:border-red-600 transition-colors"
                >
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-red-600">
                        ${plan.monthlyPrice}
                      </span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      or ${plan.yearlyPrice}/year
                    </p>
                  </div>

                  {plan.features && (
                    <div className="space-y-3 mb-8">
                      {JSON.parse(plan.features as string).map(
                        (feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <Check size={20} className="text-red-600" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {user ? (
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => (window.location.href = "/subscriptions")}
                    >
                      Subscribe Now
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => (window.location.href = getLoginUrl())}
                    >
                      Login to Subscribe
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">No subscription plans available</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            What's Included
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              "Access to all fitness classes",
              "Professional trainer guidance",
              "Personalized workout plans",
              "Nutrition consultation",
              "Progress tracking",
              "Community support",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-black rounded-lg border border-gray-800"
              >
                <Check size={24} className="text-red-600 flex-shrink-0" />
                <span className="text-lg text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
