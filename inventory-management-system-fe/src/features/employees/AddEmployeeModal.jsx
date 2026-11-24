/**
 * ============================================================
 * ADD EMPLOYEE MODAL — Form to create a new employee
 * ============================================================
 */

"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import FormField from "@/components/forms/FormField";
import toast from "react-hot-toast";
import { employeeService } from "@/services/employeeService";
import { employeeSchema } from "@/lib/schemas/employeeSchema";

export default function AddEmployeeModal({
  isOpen,
  onClose,
  onEmployeeAdded,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    joiningDate: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Validate using Zod schema
  const validate = () => {
    const result = employeeSchema.safeParse(formData);
    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await employeeService.createEmployee(formData);
      toast.success("Employee added successfully ✅");
      onEmployeeAdded(); // Trigger refetch
      handleClose();
    } catch (err) {
      toast.error(err.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", department: "", position: "", joiningDate: "" });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Employee" description="Add a new employee to the system">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField
          label="Full Name"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          error={errors.name}
          required
        />
        <FormField
          label="Email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          error={errors.email}
          required
        />
        <FormField
          label="Department"
          placeholder="Department"
          value={formData.department}
          onChange={(e) => updateField("department", e.target.value)}
          error={errors.department}
          required
        />
        <FormField
          label="Position"
          placeholder="Position"
          value={formData.position}
          onChange={(e) => updateField("position", e.target.value)}
          error={errors.position}
          required
        />
        <FormField
          label="Joining Date"
          type="date"
          value={formData.joiningDate}
          onChange={(e) => updateField("joiningDate", e.target.value)}
          error={errors.joiningDate}
          required
        />

        <Button type="submit" loading={loading} className="w-full">
          Add Employee
        </Button>
      </form>
    </Modal>
  );
}
