/**
 * Dashboard Page — Role-aware Admin & Employee Dashboard.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Laptop, Clock, CheckCircle2, Box, ArrowRight, AlertCircle } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import DashboardStats from "@/features/dashboard/DashboardStats";
import LowStockTable from "@/features/dashboard/LowStockTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { dashboardService } from "@/services/dashboardService";
import {
  formatDate,
  formatQueryStatus,
  getPriorityClasses,
  getQueryStatusClasses,
} from "@/utils/helpers";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getDashboardData();
        setDashboard(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  if (!dashboard && !error) return <LoadingSpinner message="Loading dashboard..." />;

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  // Admin Dashboard View
  if (dashboard.role === "ADMIN") {
    return (
      <section className="page-enter">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 page-enter-content">
          <PageHeader
            title="Admin Dashboard"
            description="Company-wide overview of stock, allocations, and support requests"
          />
          <DashboardStats cardData={dashboard.cards} />
          <LowStockTable data={dashboard.lowStockTable || []} />
        </div>
      </section>
    );
  }

  // Employee / User Self-Service Dashboard View
  const { cards, linkedEmployee, myAssets = [], myRecentQueries = [] } = dashboard;

  return (
    <section className="page-enter">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 page-enter-content">
        <PageHeader
          title="My Workspace"
          description={
            linkedEmployee
              ? `${linkedEmployee.employeeId || ""} • ${linkedEmployee.department} • ${linkedEmployee.position}`
              : "Overview of your assigned equipment and support tickets"
          }
        />

        {!linkedEmployee && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-sm text-amber-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-semibold">Employee profile not linked yet</p>
              <p className="mt-0.5 text-amber-700">
                Ask your IT Admin to link your user account to an employee profile so you can view assigned hardware and raise support tickets.
              </p>
            </div>
          </div>
        )}

        {/* User Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="My Assigned Assets"
            value={cards?.myAssetsCount ?? 0}
            subText="Devices allocated to you"
            icon={<Laptop size={18} className="text-blue-600" />}
            iconBg="bg-blue-50"
          />
          <StatCard
            title="My Open Queries"
            value={cards?.myOpenQueries ?? 0}
            subText={`${cards?.myInProgressQueries ?? 0} in progress`}
            icon={<Clock size={18} className="text-amber-600" />}
            iconBg="bg-amber-50"
          />
          <StatCard
            title="Resolved Queries"
            value={cards?.myClosedQueries ?? 0}
            subText="Completed tickets"
            icon={<CheckCircle2 size={18} className="text-emerald-600" />}
            iconBg="bg-emerald-50"
          />
          <StatCard
            title="Catalog Items Ready"
            value={cards?.availableProductsCount ?? 0}
            subText="Products in stock"
            icon={<Box size={18} className="text-violet-600" />}
            iconBg="bg-violet-50"
          />
        </div>

        {/* Two-column self-service summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assigned Assets Preview */}
          <div className="bg-surface border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-text-primary">My Assigned Assets</h2>
                <p className="text-xs text-text-secondary mt-0.5">Hardware currently issued to you</p>
              </div>
              <Link
                href="/my-assets"
                className="text-xs font-medium text-accent hover:text-accent-hover inline-flex items-center gap-1"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-border-light">
              {myAssets.length === 0 ? (
                <p className="px-6 py-8 text-sm text-text-muted text-center">
                  No assets assigned to your account yet.
                </p>
              ) : (
                myAssets.slice(0, 5).map((asset) => (
                  <div key={asset.assignmentId} className="px-6 py-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{asset.assetName}</p>
                      <p className="text-xs text-text-muted">
                        {asset.category} • SN: {asset.serialNumber}
                      </p>
                    </div>
                    <span className="text-xs text-text-secondary">
                      Issued {formatDate(asset.allocatedDate)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Queries Preview */}
          <div className="bg-surface border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-text-primary">My Recent Queries</h2>
                <p className="text-xs text-text-secondary mt-0.5">Latest support ticket updates</p>
              </div>
              <Link
                href="/queries"
                className="text-xs font-medium text-accent hover:text-accent-hover inline-flex items-center gap-1"
              >
                Manage <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-border-light">
              {myRecentQueries.length === 0 ? (
                <p className="px-6 py-8 text-sm text-text-muted text-center">
                  No support queries submitted yet.
                </p>
              ) : (
                myRecentQueries.map((q) => (
                  <div key={q.id} className="px-6 py-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{q.title}</p>
                      <p className="text-xs text-text-muted">
                        {q.asset} • {q.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge text={q.priority} className={getPriorityClasses(q.priority)} />
                      <StatusBadge
                        text={formatQueryStatus(q.status)}
                        className={getQueryStatusClasses(q.status)}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
