/**
 * ============================================================
 * MODAL — Premium overlay dialog with animations
 * ============================================================
 *
 * USAGE:
 *   <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Product">
 *     <p>Modal body content here</p>
 *   </Modal>
 */

"use client";

import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-md",
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className={`
            bg-surface w-full ${maxWidth} rounded-xl 
            shadow-[var(--shadow-modal)] border border-border/50
            p-6 relative animate-slideUp
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="
              absolute top-4 right-4 p-1 rounded-md
              text-text-muted hover:text-text-primary hover:bg-surface-hover
              transition-all duration-200
            "
            aria-label="Close modal"
          >
            <X size={16} />
          </button>

          {/* Header */}
          {title && (
            <div className="pb-4 mb-4 border-b border-border">
              <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
              {description && (
                <p className="text-sm text-text-secondary mt-1">{description}</p>
              )}
            </div>
          )}

          {/* Body */}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
