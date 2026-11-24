/**
 * Employees Page — Manages employees and asset allocation.
 */

"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import EmployeeTable from "@/features/employees/EmployeeTable";
import AddEmployeeModal from "@/features/employees/AddEmployeeModal";
import AllocateAssetModal from "@/features/employees/AllocateAssetModal";
import ViewAssetsModal from "@/features/employees/ViewAssetsModal";
import { employeeService } from "@/services/employeeService";
import { formatDate } from "@/utils/helpers";
import toast from "react-hot-toast";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [allocateEmployee, setAllocateEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployees();

      const mapped = data.map((emp) => ({
        id: emp.id,
        employeeId: emp.employeeId,
        name: emp.name,
        email: emp.email,
        department: emp.department,
        position: emp.position,
        assets: emp.assets ?? 0,
        joiningDate: formatDate(emp.joiningDate),
        lastAllocated: formatDate(emp.lastAllocated),
      }));

      setEmployees(mapped);
    } catch (err) {
      console.error(err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const filteredEmployees = employees.filter((emp) =>
    `${emp.employeeId} ${emp.name} ${emp.email} ${emp.department} ${emp.position}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await employeeService.deleteEmployee(id);
      toast.success("Employee deleted successfully");
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <section className="page-enter">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 page-enter-content">
        <PageHeader
          title="Employees"
          description="Manage employees and their allocated assets"
          action={
            <Button icon={<Plus size={16} />} onClick={() => setShowAddModal(true)}>
              Add Employee
            </Button>
          }
        />

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search employees by name, ID, email, or department..."
        />

        <EmployeeTable
          employees={filteredEmployees}
          loading={loading}
          onView={(emp) => setViewEmployee(emp)}
          onAllocate={(emp) => setAllocateEmployee(emp)}
          onDelete={handleDelete}
        />

        <AddEmployeeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onEmployeeAdded={fetchEmployees}
        />

        <ViewAssetsModal
          isOpen={!!viewEmployee}
          onClose={() => setViewEmployee(null)}
          employee={viewEmployee}
          onAssetRemoved={fetchEmployees}
        />

        <AllocateAssetModal
          isOpen={!!allocateEmployee}
          onClose={() => setAllocateEmployee(null)}
          employee={allocateEmployee}
          onAssetAllocated={fetchEmployees}
        />
      </div>
    </section>
  );
}
