/**
 * My Profile Page — Account details, Linked Employee Profile, Name & Password update.
 */

"use client";

import { useEffect, useState } from "react";
import { UserCircle, Briefcase, KeyRound } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import FormField from "@/components/forms/FormField";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/helpers";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    authService
      .getMe()
      .then((data) => {
        setProfile(data);
        setName(data.name || "");
      })
      .catch((err) => toast.error(err.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty");
    try {
      setSavingName(true);
      const updated = await authService.updateProfile(name.trim());
      setProfile((prev) => ({ ...prev, name: updated.name }));
      updateUser({ name: updated.name });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      return toast.error("Fill in both password fields");
    }
    if (newPassword.length < 8) {
      return toast.error("New password must be at least 8 characters");
    }
    try {
      setSavingPwd(true);
      await authService.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password changed successfully");
    } catch (err) {
      toast.error(err.message || "Password change failed");
    } finally {
      setSavingPwd(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;

  const emp = profile?.linkedEmployee;

  return (
    <section className="page-enter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 page-enter-content">
        <PageHeader
          title="My Profile"
          description="Manage your account details and view your employee information"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Info */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-[var(--shadow-card)] space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserCircle className="w-5 h-5 text-accent" />
                <h2 className="text-base font-semibold text-text-primary">Account Details</h2>
              </div>
              <StatusBadge
                text={profile?.role || "USER"}
                className={
                  profile?.role === "ADMIN"
                    ? "bg-indigo-50 text-indigo-700"
                    : "bg-emerald-50 text-emerald-700"
                }
              />
            </div>

            <form onSubmit={handleUpdateName} className="space-y-4">
              <FormField
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <FormField
                label="Email Address"
                value={profile?.email || ""}
                readOnly
              />
              <Button type="submit" loading={savingName}>
                Save Profile
              </Button>
            </form>
          </div>

          {/* Linked Employee Info */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-[var(--shadow-card)] space-y-4">
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-5 h-5 text-accent" />
              <h2 className="text-base font-semibold text-text-primary">Employee Profile</h2>
            </div>

            {emp ? (
              <dl className="space-y-3 text-sm pt-1">
                <div className="flex justify-between py-2 border-b border-border-light">
                  <dt className="text-text-secondary">Employee ID</dt>
                  <dd className="font-semibold text-text-primary">{emp.employeeId || "-"}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-border-light">
                  <dt className="text-text-secondary">Department</dt>
                  <dd className="font-medium text-text-primary">{emp.department}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-border-light">
                  <dt className="text-text-secondary">Position</dt>
                  <dd className="font-medium text-text-primary">{emp.position}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-text-secondary">Joining Date</dt>
                  <dd className="font-medium text-text-primary">{formatDate(emp.joiningDate)}</dd>
                </div>
              </dl>
            ) : (
              <div className="p-4 rounded-lg bg-surface-hover border border-border text-sm text-text-secondary">
                No employee record is linked to your account yet. An Admin can link your profile from <strong>Users &amp; Roles</strong>.
              </div>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-[var(--shadow-card)] space-y-4">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-5 h-5 text-accent" />
            <h2 className="text-base font-semibold text-text-primary">Change Password</h2>
          </div>

          <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
            />
            <FormField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
            />
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" loading={savingPwd}>
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
