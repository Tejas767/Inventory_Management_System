/**
 * ============================================================
 * ADD QUERY MODAL — Form to submit a new query
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

export default function AddQueryModal({ isOpen, onClose, onQueryAdded }) {
  const [employees, setEmployees] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    employeeId: "",
    assetId: "",
    priority: "Low",
  });

  // Fetch employees when modal opens
  useEffect(() => {
    if (isOpen) {
      employeeService.getEmployees().then((data) => {
        setEmployees(Array.isArray(data) ? data : []);
      }).catch(() => setEmployees([]));
    }
  }, [isOpen]);

  // When employee changes, fetch their assets
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
    // Basic validation
    if (!formData.title || !formData.description || !formData.employeeId || !formData.assetId) {
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
      onQueryAdded();
      handleClose();
    } catch (err) {
      toast.error(err.message || "Failed to create query");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: "", description: "", employeeId: "", assetId: "", priority: "Low" });
    setFilteredAssets([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Submit New Query">
      <div className="space-y-4">
        <FormSelect
          label="Employee"
          value={formData.employeeId}
          onChange={(e) => handleEmployeeChange(e.target.value)}
          options={employees.map((emp) => ({ value: emp.id, label: emp.name }))}
          placeholder="Select employee"
          required
        />

        <FormSelect
          label="Asset"
          value={formData.assetId}
          onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
          options={filteredAssets.map((a) => ({
            value: a.assignmentId,
            label: a.assetName,
          }))}
          placeholder="Select asset"
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
      </div>
    </Modal>
  );
}
