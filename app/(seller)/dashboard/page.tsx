import { Card } from "@/components/ui/card/Card";
import { Plus, Car, Eye, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DealerDashboard() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Showroom</h1>
          <p className="text-slate-400">Manage your listings and track your performance.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus size={18} /> List New Car
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active Listings" value="12" icon={<Car />} />
        <StatCard title="Total Views" value="1,284" icon={<Eye />} />
        <StatCard title="Leads" value="24" icon={<MessageSquare />} />
      </div>

      {/* Empty State / Inventory List Placeholder */}
      <Card className="p-12 border-dashed border-slate-800 bg-transparent flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-500">
          <Car size={32} />
        </div>
        <h3 className="text-lg font-medium text-white">No active listings</h3>
        <p className="text-slate-400 max-w-xs mt-2">Start adding cars to your showroom to reach thousands of buyers.</p>
      </Card>
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="p-6 bg-slate-900/50 border-slate-800">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">{icon}</div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </Card>
  )
}