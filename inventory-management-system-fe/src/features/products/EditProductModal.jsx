/**
 * ============================================================
 * EDIT PRODUCT MODAL — Form to update a product
 * ============================================================
 */

"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import FormField from "@/components/forms/FormField";
import FormSelect from "@/components/forms/FormSelect";
import toast from "react-hot-toast";
import { productService } from "@/services/productService";

export default function EditProductModal({
  isOpen,
  onClose,
  product,
  categories = [],
  onProductUpdated,
}) {
  // Local copy of product for editing
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    }
  }, [product]);

  // Auto-calculate available & status when quantity changes
  useEffect(() => {
    if (!formData) return;

    const available = Number(formData.quantity) - Number(formData.allocated || 0);
    let status = "Available";
    if (available < 0) status = "Out of Stock";
    else if (available <= 3) status = "Low Stock";

    setFormData((prev) => ({ ...prev, available, status }));
  }, [formData?.quantity, formData?.allocated]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await productService.updateProduct(formData.id, formData);
      toast.success("Product updated successfully");
      onProductUpdated(formData);
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err.message || "Server error while updating");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Product" description="Update product details">
      <div className="space-y-4">
        <FormField
          label="Product Name"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
        />

        <FormSelect
          label="Category"
          value={formData.categoryId || ""}
          onChange={(e) => {
            const catId = e.target.value;
            updateField("categoryId", catId);
            updateField("categoryName", categories.find((c) => c.id === catId)?.name || "-");
          }}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          placeholder="Select Category"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => updateField("quantity", Math.max(0, Number(e.target.value)))}
          />
          <FormField
            label="Min Stock"
            type="number"
            value={formData.minStock}
            onChange={(e) => updateField("minStock", Math.max(0, Number(e.target.value)))}
          />
        </div>

        <FormField
          label="Available"
          value={formData.available}
          readOnly
        />

        <Button
          onClick={handleSubmit}
          loading={loading}
          className="w-full"
        >
          Update Product
        </Button>
      </div>
    </Modal>
  );
}
