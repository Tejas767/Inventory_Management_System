/**
 * Users & Roles Page — Admin-only User & Access Control Management.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, ShieldCheck, Link2, Trash2, UserCheck } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FormSelect from "@/components/forms/FormSelect";
import FormField from "@/components/forms/FormField";
import { userService } from "@/services/userService";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/constants/roles";
import { formatDate } from "@/utils/helpers";
import toast from "react-hot-toast";

export default function UsersManagementPage() {
  const { user: currentUser, role } = useAuth();
  const isAdmin = role === ROLES.ADMIN;

  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [linkingUser, setLinkingUser] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [createNewEmployee, setCreateNewEmployee] = useState(false);
  const [department, setDepartment] = useState("Engineering");
  const [position, setPosition] = useState("Staff");
  const [savingLink, setSavingLink] = useState(false);

  const [deletingUser, setDeletingUser] = useState(null);

  const loadData = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data.users || []);
      setEmployees(data.employees || []);
    } catch (err) {
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <section className="page-enter">
        <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-text-primary">Admin Access Required</h1>
          <p className="text-sm text-text-secondary">
            Only administrators can manage user accounts, roles, and employee links.
          </p>
          <Link href="/dashboard" className="inline-block">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </section>
    );
  }

  const handleToggleRole = async (target) => {
    const nextRole = target.role === "ADMIN" ? "USER" : "ADMIN";
    try {
      await userService.updateUserRole(target.id, nextRole);
      toast.success(`${target.name} is now ${nextRole}`);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to update role");
    }
  };

  const openLinkModal = (u) => {
    setLinkingUser(u);
    setSelectedEmployeeId(u.linkedEmployee?.id || "");
    setCreateNewEmployee(false);
  };

  const handleSaveLink = async () => {
    if (!linkingUser) return;
    try {
      setSavingLink(true);
      await userService.linkEmployee(linkingUser.id, {
        employeeId: selectedEmployeeId || null,
        createNew: createNewEmployee,
        department,
        position,
      });
      toast.success("Employee link updated");
      setLinkingUser(null);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to update link");
    } finally {
      setSavingLink(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      await userService.deleteUser(deletingUser.id);
      toast.success("User removed");
      setDeletingUser(null);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  const columns = [
    {
      key: "name",
      label: "User",
      render: (row) => (
        <div>
          <p className="font-medium text-text-primary">
            {row.name}
            {row.id === currentUser?.id && (
              <span className="ml-2 text-[11px] font-medium text-accent">(You)</span>
            )}
          </p>
          <p className="text-xs text-text-muted">{row.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <StatusBadge
          text={row.role}
          className={
            row.role === "ADMIN"
              ? "bg-indigo-50 text-indigo-700"
              : "bg-emerald-50 text-emerald-700"
          }
        />
      ),
    },
    {
      key: "linkedEmployee",
      label: "Linked Employee Profile",
      render: (row) =>
        row.linkedEmployee ? (
          <div className="text-xs">
            <p className="font-medium text-text-primary">
              {row.linkedEmployee.employeeId || "EMP"} • {row.linkedEmployee.name}
            </p>
            <p className="text-text-muted">
              {row.linkedEmployee.department} — {row.linkedEmployee.position}
            </p>
          </div>
        ) : (
          <span className="text-xs text-amber-600 font-medium">Not Linked</span>
        ),
    },
    {
      key: "createdAt",
      label: "Registered",
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: "actions",
      label: "Controls",
      render: (row) => {
        const isSelf = row.id === currentUser?.id;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => handleToggleRole(row)}
              disabled={isSelf}
              icon={row.role === "ADMIN" ? <UserCheck size={13} /> : <ShieldCheck size={13} />}
              className="text-xs px-2.5 py-1.5"
              title={isSelf ? "Cannot change your own role" : "Switch role"}
            >
              {row.role === "ADMIN" ? "Make User" : "Make Admin"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => openLinkModal(row)}
              icon={<Link2 size={13} />}
              className="text-xs px-2.5 py-1.5"
            >
              Link Employee
            </Button>
            <button
              onClick={() => setDeletingUser(row)}
              disabled={isSelf}
              title={isSelf ? "Cannot delete your own account" : "Delete user"}
              className="p-1.5 rounded-md text-text-muted hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <Trash2 size={15} />
            </button>
          </div>
        );
      },
    },
  ];

  const availableEmployees = employees.filter(
    (emp) => !emp.userId || emp.userId === linkingUser?.id
  );

  return (
    <section className="page-enter">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 page-enter-content">
        <PageHeader
          title="Users & Role Management"
          description="Promote/demote user roles and link registered accounts to Employee profiles"
        />

        <div>
          <div className="bg-surface border border-border border-b-0 rounded-t-xl px-6 py-4 shadow-[var(--shadow-card)]">
            <h2 className="text-base font-semibold text-text-primary">
              Registered Accounts ({users.length})
            </h2>
            <p className="text-sm text-text-secondary mt-0.5">
              Public signups default to USER. Only Admins can grant ADMIN privileges or link employee profiles.
            </p>
          </div>

          <DataTable
            columns={columns}
            data={users}
            loading={loading}
            emptyMessage="No user accounts found."
          />
        </div>

        {/* Link Employee Modal */}
        <Modal
          isOpen={!!linkingUser}
          onClose={() => setLinkingUser(null)}
          title={`Link Employee Profile — ${linkingUser?.name || ""}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setCreateNewEmployee(false)}
                className={`px-3 py-1.5 rounded-lg font-medium border transition ${
                  !createNewEmployee
                    ? "bg-accent text-white border-accent"
                    : "bg-surface border-border text-text-secondary"
                }`}
              >
                Select Existing Employee
              </button>
              <button
                type="button"
                onClick={() => setCreateNewEmployee(true)}
                className={`px-3 py-1.5 rounded-lg font-medium border transition ${
                  createNewEmployee
                    ? "bg-accent text-white border-accent"
                    : "bg-surface border-border text-text-secondary"
                }`}
              >
                Create New Employee Profile
              </button>
            </div>

            {!createNewEmployee ? (
              <FormSelect
                label="Employee Profile"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                options={[
                  { value: "", label: "— Unlink Employee —" },
                  ...availableEmployees.map((emp) => ({
                    value: emp.id,
                    label: `${emp.employeeId || "EMP"} • ${emp.name} (${emp.email})`,
                  })),
                ]}
              />
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-text-secondary">
                  Creates an Employee record using <strong>{linkingUser?.name}</strong> ({linkingUser?.email}) and links it automatically.
                </p>
                <FormField
                  label="Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
                <FormField
                  label="Position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setLinkingUser(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveLink} loading={savingLink}>
                Save Link
              </Button>
            </div>
          </div>
        </Modal>

        <ConfirmDialog
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleDeleteUser}
          title="Delete User Account?"
          message={`Are you sure you want to remove ${deletingUser?.email}? Their linked employee record will remain intact.`}
          confirmLabel="Delete"
        />
      </div>
    </section>
  );
}
