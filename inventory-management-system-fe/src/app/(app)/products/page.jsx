/**
 * Products Page — Manages inventory products.
 */

"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ProductTable from "@/features/products/ProductTable";
import AddProductModal from "@/features/products/AddProductModal";
import EditProductModal from "@/features/products/EditProductModal";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/constants/roles";
import RoleGate from "@/lib/rbac/RoleGate";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const { role } = useAuth();
  const isAdmin = role === ROLES.ADMIN;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const cats = await categoryService.getCategories();
        setCategories(cats);

        const prods = await productService.getProducts();
        const enriched = prods.map((p) => ({
          ...p,
          category: p?.category?.name || cats.find((c) => c.id === p.categoryId)?.name || "-",
        }));
        setProducts(enriched);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredProducts = products.filter((p) => {
    const search = searchTerm.toLowerCase();
    return (
      (p.name || "").toLowerCase().includes(search) ||
      (p.category || "").toLowerCase().includes(search) ||
      (p.serialNumber || "").toLowerCase().includes(search)
    );
  });

  const handleDelete = async () => {
    if (!deletingProduct?.id) return;
    try {
      await productService.deleteProduct(deletingProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      toast.success("Product deleted");
      setDeletingProduct(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  return (
    <section className="page-enter">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 page-enter-content">
        <PageHeader
          title={isAdmin ? "Products" : "Equipment Catalog"}
          description={
            isAdmin
              ? "Manage your inventory assets"
              : "Browse available company hardware and stock levels"
          }
          action={
            <RoleGate allowedRoles={[ROLES.ADMIN]}>
              <Button icon={<Plus size={16} />} onClick={() => setShowAddModal(true)}>
                Add Product
              </Button>
            </RoleGate>
          }
        />

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products by name, category, or serial number..."
        />

        <ProductTable
          products={filteredProducts}
          loading={loading}
          canManage={isAdmin}
          onEdit={(p) => setEditingProduct({ ...p })}
          onDelete={(p) => setDeletingProduct(p)}
        />

        <AddProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          categories={categories}
          onProductAdded={(newP) => setProducts((prev) => [...prev, newP])}
        />

        <EditProductModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
          categories={categories}
          onProductUpdated={(updated) =>
            setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
          }
        />

        <ConfirmDialog
          isOpen={!!deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={handleDelete}
          title="Delete Product?"
          message="Are you sure you want to delete this product?"
          confirmLabel="Delete"
        />
      </div>
    </section>
  );
}
