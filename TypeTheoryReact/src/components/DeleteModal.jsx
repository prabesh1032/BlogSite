export default function DeleteModal({
  isOpen,
  title = "Delete this blog?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{description}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer "
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-700 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
