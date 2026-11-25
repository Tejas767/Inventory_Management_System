/**
 * ============================================================
 * CONFIRM DIALOG — Premium delete/confirm dialog
 * ============================================================
 *
 * USAGE:
 *   <ConfirmDialog
 *     isOpen={showDelete}
 *     onClose={() => setShowDelete(false)}
 *     onConfirm={handleDelete}
 *     title="Delete Product?"
 *     message="This action cannot be undone."
 *   />
 */

"use client";

import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  variant = "danger",
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center">
        {/* Warning icon */}
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center mb-4
          ${variant === "danger" ? "bg-red-50" : "bg-accent-light"}
        `}>
          <AlertTriangle
            size={22}
            className={variant === "danger" ? "text-red-500" : "text-accent"}
          />
        </div>

        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="text-sm text-text-secondary mt-2 mb-6">{message}</p>

        <div className="flex gap-3 w-full">
          <Button variant="secondary" onClick={onClose} disabled={loading} className="flex-1">
            Cancel
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading} className="flex-1">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
