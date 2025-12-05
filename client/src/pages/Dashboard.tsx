import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, Zap, Award, Bell } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: bookings } = trpc.classBookings.getUserBookings.useQuery();
  const { data: subscriptions } =
    trpc.subscriptions.getUserSubscriptions.useQuery();
  const { data: notifications } =
    trpc.notifications.getUserNotifications.useQuery();
  const { data: rewards } = trpc.rewards.getUserRewards.useQuery();

  const activeSubscription = subscriptions?.find(
    (s) => s.status === "active"
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="py-8 bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
          <p className="text-gray-400">Manage your fitness journey</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Subscription Card */}
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Subscription</h3>
                <Zap size={24} className="text-red-600" />
              </div>
              {activeSubscription ? (
                <div>
                  <p className="text-2xl font-bold text-red-600 mb-2">Active</p>
                  <p className="text-sm text-gray-400 mb-4">
                    Expires:{" "}
                    {new Date(activeSubscription.endDate).toLocaleDateString()}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-gray-300 border-gray-600 hover:border-gray-400"
                    onClick={() => (window.location.href = "/subscriptions")}
                  >
                    Manage
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-gray-400 mb-4">
                    No Active Plan
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => (window.location.href = "/subscriptions")}
                  >
                    Subscribe Now
                  </Button>
                </div>
              )}
            </Card>

            {/* Bookings Card */}
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Bookings</h3>
                <Calendar size={24} className="text-red-600" />
              </div>
              <p className="text-2xl font-bold mb-4">
                {bookings?.filter((b) => b.status === "booked").length || 0}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-gray-300 border-gray-600 hover:border-gray-400"
                onClick={() => (window.location.href = "/classes")}
              >
                Book Classes
              </Button>
            </Card>

            {/* Rewards Card */}
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Rewards</h3>
                <Award size={24} className="text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600 mb-4">
                {rewards?.points || 0}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-gray-300 border-gray-600 hover:border-gray-400"
              >
                View Rewards
              </Button>
            </Card>

            {/* Notifications Card */}
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <Bell size={24} className="text-red-600" />
              </div>
              <p className="text-2xl font-bold mb-4">
                {notifications?.filter((n) => !n.isRead).length || 0}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-gray-300 border-gray-600 hover:border-gray-400"
              >
                View All
              </Button>
            </Card>
          </div>

          {/* Upcoming Classes */}
          {bookings && bookings.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Your Upcoming Classes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings
                  .filter((b) => b.status === "booked")
                  .slice(0, 3)
                  .map((booking) => (
                    <Card
                      key={booking.id}
                      className="bg-gray-900 border-gray-800 p-6 hover:border-red-600 transition-colors"
                    >
                      <h3 className="text-lg font-bold mb-2">Class</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        {new Date(booking.bookedAt).toLocaleDateString()}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-gray-300 border-gray-600 hover:border-gray-400"
                      >
                        View Details
                      </Button>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Recent Notifications */}
          {notifications && notifications.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Recent Notifications</h2>
              <div className="space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <Card
                    key={notification.id}
                    className={`p-4 border-l-4 ${
                      notification.isRead
                        ? "bg-gray-900 border-gray-700"
                        : "bg-gray-800 border-red-600"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{notification.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
