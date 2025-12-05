import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Dumbbell, Calendar, CreditCard } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="py-8 bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage gym operations and users</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Total Users</h3>
                <Users size={24} className="text-red-600" />
              </div>
              <p className="text-3xl font-bold">0</p>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Active Classes</h3>
                <Dumbbell size={24} className="text-red-600" />
              </div>
              <p className="text-3xl font-bold">0</p>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Trainers</h3>
                <Users size={24} className="text-red-600" />
              </div>
              <p className="text-3xl font-bold">0</p>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Revenue</h3>
                <CreditCard size={24} className="text-red-600" />
              </div>
              <p className="text-3xl font-bold">$0</p>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="bg-gray-900 border-gray-800 mb-6">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="trainers">Trainers</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h3 className="text-2xl font-bold mb-6">Manage Users</h3>
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No users to display</p>
                  <Button className="bg-red-600 hover:bg-red-700">
                    Add User
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Trainers Tab */}
            <TabsContent value="trainers">
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h3 className="text-2xl font-bold mb-6">Manage Trainers</h3>
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No trainers to display</p>
                  <Button className="bg-red-600 hover:bg-red-700">
                    Add Trainer
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Classes Tab */}
            <TabsContent value="classes">
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h3 className="text-2xl font-bold mb-6">Manage Classes</h3>
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No classes to display</p>
                  <Button className="bg-red-600 hover:bg-red-700">
                    Add Class
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h3 className="text-2xl font-bold mb-6">Payment History</h3>
                <div className="text-center py-12">
                  <p className="text-gray-400">No payments to display</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
