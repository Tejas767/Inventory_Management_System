/**
 * Dashboard Page — Premium SaaS dashboard layout.
 */

"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import DashboardStats from "@/features/dashboard/DashboardStats";
import LowStockTable from "@/features/dashboard/LowStockTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { dashboardService } from "@/services/dashboardService";

export default function DashboardPage() {
  const [cardData, setCardData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getDashboardData();
        setCardData(data.cards);
        setTableData(data.lowStockTable || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  if (!cardData && !error) return <LoadingSpinner message="Loading dashboard..." />;

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <section className="page-enter">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 page-enter-content">
        <PageHeader
          title="Dashboard"
          description="Overview of your inventory management system"
        />
        <DashboardStats cardData={cardData} />
        <LowStockTable data={tableData} />
      </div>
    </section>
  );
}
