/**
 * ============================================================
 * ADD PRODUCT MODAL — Form to add a new product
 * ============================================================
 */

"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import FormField from "@/components/forms/FormField";
import FormSelect from "@/components/forms/FormSelect";
import toast from "react-hot-toast";
import { productService } from "@/services/productService";

export default function AddProductModal({
  isOpen,
  onClose,
  categories = [],
  onProductAdded,
}) {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    quantity: 0,
    minStock: 0,
    serialNumber: "",
    purchaseDate: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Update a single form field
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate the form before submission
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.serialNumber.trim()) newErrors.serialNumber = "Serial number is required";
    if (formData.serialNumber.length < 3) newErrors.serialNumber = "Serial number must be at least 3 characters";
    if (formData.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0";
    if (formData.minStock < 0) newErrors.minStock = "Min stock cannot be negative";
    if (formData.minStock > formData.quantity) newErrors.minStock = "Min stock cannot be greater than quantity";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      minStock: Number(formData.minStock || 0),
      allocated: 0,
      available: Number(formData.quantity),
      purchaseDate: formData.purchaseDate || new Date().toISOString().split("T")[0],
    };

    try {
      setLoading(true);
      const newProduct = await productService.createProduct(payload);

      // Enrich with category name for display
      const enriched = {
        ...newProduct,
        category: categories.find((c) => c.id === newProduct.categoryId)?.name || "-",
        available: Number(newProduct.quantity) - (newProduct.allocated || 0),
      };

      toast.success("Product added successfully");
      onProductAdded(enriched);
      handleClose();
    } catch (err) {
      console.error("Add failed:", err);
      toast.error(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // Reset and close
  const handleClose = () => {
    setFormData({ name: "", categoryId: "", quantity: 0, minStock: 0, serialNumber: "", purchaseDate: "" });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Product" description="Add a new product to your inventory">
      <div className="space-y-4">
        <FormField
          label="Product Name"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          error={errors.name}
          required
        />

        <FormSelect
          label="Category"
          value={formData.categoryId}
          onChange={(e) => updateField("categoryId", e.target.value)}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          placeholder="Select Category"
          error={errors.categoryId}
          required
        />

        <FormField
          label="Serial Number"
          value={formData.serialNumber}
          onChange={(e) => updateField("serialNumber", e.target.value)}
          error={errors.serialNumber}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) => updateField("quantity", Math.max(0, Number(e.target.value)))}
            error={errors.quantity}
          />
          <FormField
            label="Min Stock"
            type="number"
            min="0"
            value={formData.minStock}
            onChange={(e) => updateField("minStock", Math.max(0, Number(e.target.value)))}
            error={errors.minStock}
          />
        </div>

        <FormField
          label="Purchase Date"
          type="date"
          value={formData.purchaseDate}
          onChange={(e) => updateField("purchaseDate", e.target.value)}
        />

        <Button
          onClick={handleSubmit}
          loading={loading}
          className="w-full"
        >
          Add Product
        </Button>
      </div>
    </Modal>
  );
}
