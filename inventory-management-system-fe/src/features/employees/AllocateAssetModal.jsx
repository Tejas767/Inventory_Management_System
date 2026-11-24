/**
 * ============================================================
 * ALLOCATE ASSET MODAL — Assign a product to an employee
 * ============================================================
 */

"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import FormSelect from "@/components/forms/FormSelect";
import toast from "react-hot-toast";
import { productService } from "@/services/productService";
import { employeeAssetService } from "@/services/employeeAssetService";

export default function AllocateAssetModal({
  isOpen,
  onClose,
  employee,
  onAssetAllocated,
}) {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch available products when modal opens
  useEffect(() => {
    if (isOpen && employee) {
      productService.getProducts().then(setProducts).catch(() => setProducts([]));
    }
  }, [isOpen, employee]);

  const handleAllocate = async () => {
    if (!selectedProductId || !employee) return;

    try {
      setLoading(true);
      await employeeAssetService.allocateAsset({
        employeeId: employee.id,
        productId: selectedProductId,
        allocatedDate: new Date().toLocaleDateString("en-IN"),
      });

      toast.success("Asset allocated successfully");
      onAssetAllocated();
      handleClose();
    } catch (err) {
      toast.error(err.message || "Failed to allocate asset");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedProductId("");
    onClose();
  };

  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Allocate Asset"
      description={`Allocate an asset to ${employee.name}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        <FormSelect
          label="Select Product"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          options={products.map((p) => ({
            value: p.id,
            label: `${p.name} (${p.category?.name || p.category || "N/A"})`,
          }))}
          placeholder="Choose a product"
        />

        <Button
          onClick={handleAllocate}
          loading={loading}
          disabled={!selectedProductId}
          className="w-full"
        >
          Allocate Asset
        </Button>
      </div>
    </Modal>
  );
}
