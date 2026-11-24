/**
 * ============================================================
 * PAGE HEADER — Title + description + optional action button
 * ============================================================
 *
 * USAGE:
 *   <PageHeader
 *     title="Products"
 *     description="Manage your inventory assets"
 *     action={<Button icon={<Plus size={16} />}>Add Product</Button>}
 *   />
 */

export default function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-text-secondary mt-1 text-sm">
            {description}
          </p>
        )}
      </div>

      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
