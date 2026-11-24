/**
 * ============================================================
 * VIEW ASSETS MODAL — Displays assets allocated to an employee
 * ============================================================
 */

"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/ui/DataTable";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { employeeAssetService } from "@/services/employeeAssetService";
import { formatDate } from "@/utils/helpers";

export default function ViewAssetsModal({
  isOpen,
  onClose,
  employee,
  onAssetRemoved,
}) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch employee's assets when modal opens
  useEffect(() => {
    if (isOpen && employee) {
      setLoading(true);
      employeeAssetService
        .getEmployeeAssets(employee.id)
        .then(setAssets)
        .catch(() => setAssets([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen, employee]);

  const handleRemove = async (assignmentId) => {
    try {
      await employeeAssetService.removeAsset(assignmentId);
      toast.success("Asset removed successfully");

      // Refresh the list
      const updated = await employeeAssetService.getEmployeeAssets(employee.id);
      setAssets(updated);
      onAssetRemoved();
    } catch (err) {
      toast.error(err.message || "Failed to remove asset");
    }
  };

  const columns = [
    { key: "assetName", label: "Asset Name" },
    { key: "category", label: "Category" },
    { key: "serialNumber", label: "Serial Number" },
    {
      key: "allocatedDate",
      label: "Allocated Date",
      render: (row) => formatDate(row.allocatedDate),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex justify-center">
          <button
            onClick={() => handleRemove(row.assignmentId || row._id || row.id)}
            className="p-1.5 rounded-md text-text-muted hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            aria-label="Remove asset"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Allocated Assets — ${employee.name}`}
      description="View and manage assets allocated to this employee"
      maxWidth="max-w-3xl"
    >
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={assets}
          loading={loading}
          emptyMessage="No assets allocated to this employee."
        />
      </div>
    </Modal>
  );
}
