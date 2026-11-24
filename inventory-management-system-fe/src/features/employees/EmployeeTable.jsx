/**
 * ============================================================
 * EMPLOYEE TABLE — Premium employee list with card header
 * ============================================================
 */

"use client";

import DataTable from "@/components/ui/DataTable";
import { Eye, Edit, Trash2 } from "lucide-react";

export default function EmployeeTable({
  employees = [],
  loading = false,
  onView,
  onAllocate,
  onDelete,
}) {
  const columns = [
    { key: "employeeId", label: "Employee ID" },
    {
      key: "name",
      label: "Name",
      render: (row) => <span className="font-medium text-text-primary">{row.name}</span>,
    },
    {
      key: "email",
      label: "Email",
      render: (row) => <span className="text-text-secondary">{row.email}</span>,
    },
    { key: "department", label: "Department" },
    { key: "position", label: "Position" },
    { key: "joiningDate", label: "Joining Date" },
    { key: "assets", label: "Assets" },
    { key: "lastAllocated", label: "Last Allocated" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex justify-center gap-1.5">
          <button
            onClick={() => onView(row)}
            className="p-1.5 rounded-md text-text-muted hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            aria-label="View assets"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onAllocate(row)}
            className="p-1.5 rounded-md text-text-muted hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
            aria-label="Allocate asset"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(row.id)}
            className="p-1.5 rounded-md text-text-muted hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            aria-label="Delete employee"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-surface border border-border border-b-0 rounded-t-xl px-6 py-4 shadow-[var(--shadow-card)]">
        <h2 className="text-base font-semibold text-text-primary">
          All Employees ({employees.length})
        </h2>
        <p className="text-sm text-text-secondary mt-0.5">
          A list of all employees and their asset information
        </p>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        loading={loading}
        emptyMessage="No employees found."
      />
    </div>
  );
}
