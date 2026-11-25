/**
 * ============================================================
 * PRODUCT TABLE — Premium product list with card header
 * ============================================================
 */

"use client";

import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getProductStatusClasses } from "@/utils/helpers";

export default function ProductTable({
  products = [],
  loading = false,
  onEdit,
  onDelete,
  canManage = false,
}) {
  const baseColumns = [
    {
      key: "name",
      label: "Product Name",
      render: (row) => (
        <span className="font-medium text-text-primary">{row.name || "-"}</span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (row) => <span className="text-text-secondary">{row.category || "-"}</span>,
    },
    { key: "serialNumber", label: "Serial Number" },
    {
      key: "quantity",
      label: "Quantity",
      render: (row) => row.quantity ?? 0,
    },
    {
      key: "allocated",
      label: "Allocated",
      render: (row) => row.allocated ?? 0,
    },
    {
      key: "available",
      label: "Available",
      render: (row) => row.available ?? 0,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <StatusBadge
          text={row.status || "Available"}
          className={getProductStatusClasses(row.status || "Available")}
        />
      ),
    },
  ];

  const columns = canManage
    ? [
        ...baseColumns,
        {
          key: "actions",
          label: "Actions",
          render: (row) => (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(row)}
                aria-label="Edit product"
                className="p-1.5 rounded-md text-text-muted hover:text-accent hover:bg-accent-light transition-all duration-200"
              >
                <PencilSquareIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(row)}
                aria-label="Delete product"
                className="p-1.5 rounded-md text-text-muted hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ),
        },
      ]
    : baseColumns;

  return (
    <div>
      <div className="bg-surface border border-border border-b-0 rounded-t-xl px-6 py-4 shadow-[var(--shadow-card)]">
        <h2 className="text-base font-semibold text-text-primary">
          All Products ({products.length})
        </h2>
        <p className="text-sm text-text-secondary mt-0.5">
          {canManage
            ? "Manage your inventory assets and track stock levels"
            : "Browse available company hardware and stock levels"}
        </p>
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        emptyMessage="No products found."
      />
    </div>
  );
}
