/**
 * ============================================================
 * DASHBOARD STATS — Grid of 4 premium stat cards
 * ============================================================
 */

import StatCard from "@/components/ui/StatCard";
import { Box, AlertTriangle, TrendingUp, Users } from "lucide-react";

export default function DashboardStats({ cardData }) {
  if (!cardData) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        title="Total Stock"
        value={cardData.totalStock}
        subText={`${cardData.availableStock} available`}
        icon={<Box size={18} className="text-blue-600" />}
        iconBg="bg-blue-50"
      />

      <StatCard
        title="Low Stock Alerts"
        value={cardData.lowStockAlerts}
        subText="Items need reorder"
        icon={<AlertTriangle size={18} className="text-amber-600" />}
        iconBg="bg-amber-50"
      />

      <StatCard
        title="Allocated Assets"
        value={cardData.allocatedAssets}
        subText="Currently in use"
        icon={<TrendingUp size={18} className="text-emerald-600" />}
        iconBg="bg-emerald-50"
      />

      <StatCard
        title="Total Employees"
        value={cardData.totalEmployees}
        subText={`${cardData.openQueries} open queries`}
        icon={<Users size={18} className="text-violet-600" />}
        iconBg="bg-violet-50"
      />
    </div>
  );
}
