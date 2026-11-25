/**
 * My Assets Page — Shows hardware/assets allocated to the logged-in user.
 */

"use client";

import { useEffect, useState } from "react";
import { Laptop, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import AddQueryModal from "@/features/queries/AddQueryModal";
import { employeeAssetService } from "@/services/employeeAssetService";
import { formatDate } from "@/utils/helpers";
import toast from "react-hot-toast";

export default function MyAssetsPage() {
  const [assets, setAssets] = useState([]);
  const [linkedEmployee, setLinkedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportingAssetId, setReportingAssetId] = useState("");
  const [showQueryModal, setShowQueryModal] = useState(false);

  const loadMyAssets = async () => {
    try {
      setLoading(true);
      const data = await employeeAssetService.getMyAssets();
      setAssets(data.assets || []);
      setLinkedEmployee(data.linkedEmployee || null);
    } catch (err) {
      toast.error(err.message || "Failed to load your assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyAssets();
  }, []);

  const handleReportIssue = (asset) => {
    setReportingAssetId(asset.assignmentId);
    setShowQueryModal(true);
  };

  const columns = [
    {
      key: "assetName",
      label: "Asset Name",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0">
            <Laptop size={15} className="text-accent" />
          </div>
          <span className="font-medium text-text-primary">{row.assetName}</span>
        </div>
      ),
    },
    { key: "category", label: "Category" },
    { key: "serialNumber", label: "Serial Number" },
    {
      key: "allocatedDate",
      label: "Assigned On",
      render: (row) => formatDate(row.allocatedDate),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Button
          variant="secondary"
          onClick={() => handleReportIssue(row)}
          icon={<AlertTriangle size={14} />}
          className="text-xs px-3 py-1.5"
        >
          Report Issue
        </Button>
      ),
    },
  ];

  return (
    <section className="page-enter">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 page-enter-content">
        <PageHeader
          title="My Assigned Assets"
          description={
            linkedEmployee
              ? `Allocated to ${linkedEmployee.name} (${linkedEmployee.employeeId || linkedEmployee.department})`
              : "Hardware and equipment currently issued to your account"
          }
        />

        {!loading && !linkedEmployee && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
            Your user account is not linked to an Employee profile yet. Please ask an Admin to link your profile in <strong>Users &amp; Roles</strong>.
          </div>
        )}

        <div>
          <div className="bg-surface border border-border border-b-0 rounded-t-xl px-6 py-4 shadow-[var(--shadow-card)]">
            <h2 className="text-base font-semibold text-text-primary">
              Issued Equipment ({assets.length})
            </h2>
            <p className="text-sm text-text-secondary mt-0.5">
              Click &ldquo;Report Issue&rdquo; on any device to open a support ticket with IT
            </p>
          </div>
          <DataTable
            columns={columns}
            data={assets}
            loading={loading}
            emptyMessage="No assets have been allocated to you yet."
          />
        </div>

        <AddQueryModal
          isOpen={showQueryModal}
          onClose={() => {
            setShowQueryModal(false);
            setReportingAssetId("");
          }}
          defaultAssetId={reportingAssetId}
          onQueryAdded={() => toast.success("You can track your ticket in My Queries")}
        />
      </div>
    </section>
  );
}
