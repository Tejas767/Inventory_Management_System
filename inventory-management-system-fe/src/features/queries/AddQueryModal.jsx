/**
 * ============================================================
 * ADD QUERY MODAL — Role-aware form to submit a new query
 * ============================================================
 */

"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import FormField from "@/components/forms/FormField";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import toast from "react-hot-toast";
import { queryService } from "@/services/queryService";
import { employeeService } from "@/services/employeeService";
import { employeeAssetService } from "@/services/employeeAssetService";
import { toPriorityEnum } from "@/utils/helpers";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/constants/roles";

export default function AddQueryModal({
  isOpen,
  onClose,
  onQueryAdded,
  defaultAssetId = "",
}) {
  const { role } = useAuth();
  const isAdmin = role === ROLES.ADMIN;

  const [employees, setEmployees] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [linkedEmployee, setLinkedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    employeeId: "",
    assetId: defaultAssetId || "",
    priority: "Low",
  });

  useEffect(() => {
    if (!isOpen) return;

    if (isAdmin) {
      employeeService
        .getEmployees()
        .then((data) => setEmployees(Array.isArray(data) ? data : []))
        .catch(() => setEmployees([]));
    } else {
      employeeAssetService
        .getMyAssets()
        .then(({ assets, linkedEmployee: emp }) => {
          setLinkedEmployee(emp);
          setFilteredAssets(assets);
          setFormData((prev) => ({
            ...prev,
            employeeId: emp?.id || "",
            assetId: defaultAssetId || prev.assetId || "",
          }));
        })
        .catch(() => {
          setLinkedEmployee(null);
          setFilteredAssets([]);
        });
    }
  }, [isOpen, isAdmin, defaultAssetId]);

  const handleEmployeeChange = async (employeeId) => {
    setFormData((prev) => ({ ...prev, employeeId, assetId: "" }));

    if (employeeId) {
      try {
        const assets = await employeeAssetService.getEmployeeAssets(employeeId);
        setFilteredAssets(assets);
      } catch {
        setFilteredAssets([]);
      }
    } else {
      setFilteredAssets([]);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.assetId || (isAdmin && !formData.employeeId)) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      priority: toPriorityEnum(formData.priority),
      employeeId: formData.employeeId,
      assetId: formData.assetId,
    };

    try {
      setLoading(true);
      await queryService.createQuery(payload);
      toast.success("Query submitted successfully");
      onQueryAdded?.();
      handleClose();
    } catch (err) {
      toast.error(err.message || "Failed to create query");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      employeeId: "",
      assetId: "",
      priority: "Low",
    });
    setFilteredAssets([]);
    onClose();
  };

  const noAssetsForUser = !isAdmin && (!linkedEmployee || filteredAssets.length === 0);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Submit New Query">
      <div className="space-y-4">
        {noAssetsForUser ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
            {!linkedEmployee
              ? "Your user account is not linked to an Employee profile yet. Please ask an Admin to link your profile in Users & Roles."
              : "You do not have any assigned assets yet. Once an Admin allocates hardware to you, you can report issues here."}
          </div>
        ) : (
          <>
            {isAdmin ? (
              <FormSelect
                label="Employee"
                value={formData.employeeId}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                options={employees.map((emp) => ({ value: emp.id, label: emp.name }))}
                placeholder="Select employee"
                required
              />
            ) : (
              <div className="px-3.5 py-2.5 rounded-lg bg-surface-hover border border-border text-sm">
                <span className="text-text-secondary">Reporting as: </span>
                <span className="font-semibold text-text-primary">
                  {linkedEmployee?.name} ({linkedEmployee?.employeeId || linkedEmployee?.department})
                </span>
              </div>
            )}

            <FormSelect
              label="Asset"
              value={formData.assetId}
              onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
              options={filteredAssets.map((a) => ({
                value: a.assignmentId,
                label: `${a.assetName}${a.serialNumber ? ` (${a.serialNumber})` : ""}`,
              }))}
              placeholder="Select assigned asset"
              required
            />

            <FormField
              label="Issue Title"
              placeholder="Issue title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <FormTextarea
              label="Description"
              placeholder="Describe the issue..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />

            <FormSelect
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={[
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
              ]}
            />

            <div className="flex justify-end pt-2">
              <Button onClick={handleSubmit} loading={loading}>
                Submit Query
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
