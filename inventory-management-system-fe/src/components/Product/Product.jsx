"use client";
import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function ProductPage() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    categoryId: "",
    quantity: 0,
    minStock: 0,
    serialNumber: "",
    purchaseDate: "",
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addingProduct, setAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* =============================== 🔄 FETCH CATEGORIES & PRODUCTS =============================== */
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      const json = await res.json();
      const cats = json?.data || [];
      setCategories(cats);

      // After categories are fetched, fetch products
      fetchProducts(cats);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  const fetchProducts = async (categoriesList = []) => {
    try {
      setLoading(true); // ✅ START LOADING

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      const json = await res.json();
      const data = json?.data || [];

      const normalized = data.map((p) => ({
        ...p,
        categoryName:
          p?.category?.name ||
          categoriesList.find((c) => c.id === p.categoryId)?.name ||
          "-",
      }));

      setProducts(normalized);
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false); // ✅ STOP LOADING
    }
  };

  /* 🔎 Search filter */
  const filteredProducts = (products || []).filter((p) => {
    const name = p?.name?.toLowerCase() || "";
    const category = (p.categoryName || "").toLowerCase();
    const serial = p?.serialNumber?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return (
      name.includes(search) ||
      category.includes(search) ||
      serial.includes(search)
    );
  });

  /* 🎨 Status badge */
  const getStatusClass = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-700";
      case "Out of Stock":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  /* 🔁 Auto-calc available & status (EDIT MODAL) */
  useEffect(() => {
    if (!editingProduct) return;
    const available =
      Number(editingProduct.quantity) - Number(editingProduct.allocated || 0);
    let status = "Available";
    if (available < 0) status = "Out of Stock";
    else if (available <= 3) status = "Low Stock";
    setEditingProduct((prev) => ({ ...prev, available, status }));
  }, [editingProduct?.quantity, editingProduct?.allocated]);

  /* =============================== ✏️ UPDATE PRODUCT (PUT) =============================== */
  const handleUpdateProduct = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProduct),
        },
      );

      // 🔴 If backend returns error
      if (!res.ok) {
        const text = await res.text();
        toast.error(text || "Update failed");
        return;
      }

      // ✅ If update successful
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p)),
      );

      toast.success("Product updated successfully");

      setEditingProduct(null);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Server error while updating");
    }
  };

  /* =============================== ➕ ADD PRODUCT (POST) =============================== */

  const handleAddProduct = async () => {
    let validationErrors = {};

    if (!newProduct.name.trim()) {
      validationErrors.name = "Product name is required";
    }

    if (!newProduct.categoryId) {
      validationErrors.categoryId = "Category is required";
    }

    if (!newProduct.serialNumber.trim()) {
      validationErrors.serialNumber = "Serial number is required";
    }

    if (newProduct.quantity <= 0) {
      validationErrors.quantity = "Quantity must be greater than 0";
    }

    if (newProduct.minStock < 0) {
      validationErrors.minStock = "Min stock cannot be negative";
    }

    if (newProduct.minStock > newProduct.quantity) {
      validationErrors.minStock = "Min stock cannot be greater than quantity";
    }

    if (newProduct.serialNumber.length < 3) {
      validationErrors.serialNumber =
        "Serial number must be at least 3 characters";
    }

    // 🚨 STOP HERE IF ANY ERRORS
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const payload = {
      ...newProduct,
      quantity: Number(newProduct.quantity),
      minStock: Number(newProduct.minStock || 0),
      allocated: 0,
      available: Number(newProduct.quantity), // <-- add this
      purchaseDate:
        newProduct.purchaseDate || new Date().toISOString().split("T")[0],
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        alert("Failed to add product: " + text);
        return;
      }

      const result = await res.json();

      const newP = {
        ...result.data,
        category:
          categories.find((c) => c.id === result.data.categoryId)?.name || "-",
        available: Number(result.data.quantity) - (result.data.allocated || 0), // <-- add this
      };

      setProducts((prev) => [...prev, newP]);

      toast.success("Product added successfully");

      setAddingProduct(false);
      setNewProduct({
        name: "",
        categoryId: "",
        quantity: 0,
        minStock: 0,
        serialNumber: "",
        purchaseDate: "",
      });

      setErrors({});
    } catch (err) {
      console.error("Add failed", err);
      toast.error("Failed to add product");
    }
  };

  /* =============================== 🗑️ DELETE PRODUCT =============================== */
  const confirmDeleteProduct = async () => {
    if (!deleteProduct?.id) {
      alert("Product ID not found!");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${deleteProduct.id}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        const text = await res.text();
        toast.error("please remove all allocated assets")
        return;
      }

      // Remove from frontend state only if backend delete succeeded
      setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
      setDeleteProduct(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete request failed. See console for details.");
    }
  };

  /* =============================== RENDER =============================== */
  return (
    <div className="bg-gray-100 min-h-screen">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            marginTop: "140px", // <-- push toasts 60px below top
            // marginRight: '100px'
          },
        }}
      />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Products
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Manage your inventory assets
            </p>
          </div>
          <button
            className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium"
            onClick={() => {
              setAddingProduct(true);
              setErrors({});
            }}
          >
            + Add Product
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-white p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by name, category, or serial number..."
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 rounded-lg border border-white bg-gray-50
                 focus:border-gray-400 focus:ring-0 transition duration-200 ease-in-out text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl overflow-x-auto">
          <table className="w-full min-w-[700px] sm:min-w-full">
            <thead className="bg-gray-50 text-xs sm:text-sm text-black-500">
              <tr>
                {[
                  "Product Name",
                  "Category",
                  "Serial Number",
                  "Quantity",
                  "Allocated",
                  "Available",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className={`px-3 sm:px-6 py-2 sm:py-3 text-left font-extrabold whitespace-nowrap ${h === "Actions" ? "pl-3 pr-2 sm:pl-6 sm:pr-2" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-500">
                    Loading products...
                  </td>
                </tr>
              )}

              {!loading && filteredProducts?.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredProducts?.map((p, index) => {
                  const available = p?.available ?? 0;
                  const status = p?.status ?? "Available";

                  return (
                    <React.Fragment key={p?.id || index}>
                      <tr>
                        <td colSpan={8}>
                          <div className="border-t border-gray-300 mx-2 sm:mx-4"></div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 font-medium text-gray-800">
                          {p?.name || "-"}
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                          {p.category || "-"}
                        </td>

                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                          {p?.serialNumber || "-"}
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                          {p?.quantity ?? 0}
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                          {p?.allocated ?? 0}
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                          {available}
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusClass(status)}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 flex gap-2 sm:gap-4">
                          <button onClick={() => setEditingProduct({ ...p })}>
                            <PencilSquareIcon className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
                          </button>
                          <button onClick={() => setDeleteProduct(p)}>
                            <TrashIcon className="w-4 sm:w-5 h-4 sm:h-5 text-red-500 hover:text-red-600" />
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* =============================== Modals =============================== */}

        {/* Delete Modal */}
        {deleteProduct && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-0">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-xl p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-2 sm:mb-4">
                Are you sure?
              </h2>
              <p className="text-sm text-gray-500 mb-4 sm:mb-6">
                Delete this product?
              </p>
              <div className="flex justify-end gap-2 sm:gap-4">
                <button
                  onClick={() => setDeleteProduct(null)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteProduct}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm sm:text-base"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
            <div
              className="absolute inset-0 bg-black/20"
              onClick={() => setEditingProduct(null)}
            />
            <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl p-4 sm:p-6">
              <button
                className="absolute top-3 sm:top-4 right-3 sm:right-4"
                onClick={() => setEditingProduct(null)}
              >
                <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-black" />
              </button>

              <h2 className="text-lg font-semibold">Edit Product</h2>
              <p className="text-sm text-gray-500 mb-4">
                Update product details
              </p>

              <div className="space-y-3 sm:space-y-4">
                {/* Product Name */}
                <div>
                  <label className="text-sm font-medium">Product Name</label>
                  <input
                    className="w-full mt-1 border px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="w-full mt-1 border px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base"
                    value={editingProduct.categoryId || ""}
                    onChange={(e) => {
                      const catId = e.target.value;
                      setEditingProduct({
                        ...editingProduct,
                        categoryId: catId,
                        categoryName:
                          categories.find((c) => c.id === catId)?.name || "-",
                      });
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity & Min Stock */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {/* Quantity */}
                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <input
                      type="number"
                      className="w-full mt-1 border px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base"
                      value={editingProduct.quantity}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          quantity: Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                    {errors?.quantity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.quantity}
                      </p>
                    )}
                  </div>

                  {/* Min Stock */}
                  <div>
                    <label className="text-sm font-medium">Min Stock</label>
                    <input
                      type="number"
                      className="w-full mt-1 border px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base"
                      value={editingProduct.minStock}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          minStock: Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>
                </div>

                {/* Available */}
                <div>
                  <label className="text-sm font-medium">Available</label>
                  <input
                    className="w-full mt-1 border px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gray-100 text-sm sm:text-base"
                    value={editingProduct.available}
                    readOnly
                  />
                </div>

                <button
                  onClick={handleUpdateProduct}
                  className="w-full bg-black text-white py-2 rounded-lg text-sm sm:text-base"
                >
                  Update Product
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {addingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
            <div
              className="absolute inset-0 bg-black/20"
              onClick={() => setAddingProduct(false)}
            />
            <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl p-4 sm:p-6">
              <button
                className="absolute top-3 sm:top-4 right-3 sm:right-4"
                onClick={() => setAddingProduct(false)}
              >
                <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-black" />
              </button>

              <h2 className="text-lg font-bold">Add New Product</h2>
              <p className="text-sm text-gray-500 mb-4">
                Add a new product to your inventory
              </p>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-sm font-medium">Product Name</label>
                  <input
                    className={`w-full mt-1 border px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base 
  ${errors.name ? "border-red-500" : ""}`}
                    value={newProduct.name}
                    onChange={(e) => {
                      setNewProduct({ ...newProduct, name: e.target.value });
                      setErrors({ ...errors, name: "" });
                    }}
                  />

                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => {
                      const value = e.target.value;

                      setNewProduct({
                        ...newProduct,
                        categoryId: value,
                      });

                      // Remove error when category is selected
                      if (value) {
                        setErrors({
                          ...errors,
                          categoryId: "",
                        });
                      }
                    }}
                    className="w-full border rounded px-3 py-2 mt-1"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {errors.categoryId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.categoryId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Serial Number</label>
                  <input
                    className={`w-full mt-1 border px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base 
  ${errors.serialNumber ? "border-red-500" : ""}`}
                    value={newProduct.serialNumber}
                    onChange={(e) => {
                      setNewProduct({
                        ...newProduct,
                        serialNumber: e.target.value,
                      });
                      setErrors({ ...errors, serialNumber: "" });
                    }}
                  />

                  {errors.serialNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.serialNumber}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full mt-1 border px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base"
                      value={newProduct.quantity}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          quantity: Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Min Stock</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full mt-1 border px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base"
                      value={newProduct.minStock}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          minStock: Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Purchase Date</label>
                  <input
                    type="date"
                    className="w-full mt-1 border px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base"
                    value={newProduct.purchaseDate}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        purchaseDate: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  onClick={handleAddProduct}
                  className="w-full bg-black text-white py-2 rounded-lg text-sm sm:text-base"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
