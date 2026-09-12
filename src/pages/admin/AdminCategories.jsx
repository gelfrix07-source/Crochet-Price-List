import { useState } from 'react'
import { useCategories } from '../../hooks/useCategories'
import {
  createCategory,
  deleteCategory,
  reorderCategories,
  updateCategory,
} from '../../services/categoryService'
import { Spinner } from '../../components/LoadingStates'
import { ErrorState } from '../../components/EmptyState'
import ConfirmDialog from '../../components/ConfirmDialog'

export default function AdminCategories() {
  const { categories, loading, error, refresh } = useCategories()
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')

  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    setAddError(null)
    try {
      await createCategory({ name: newName.trim(), display_order: categories.length })
      setNewName('')
      refresh()
    } catch (err) {
      console.error(err)
      setAddError('We couldn\u2019t add that category. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  const startEditing = (category) => {
    setEditingId(category.id)
    setEditingName(category.name)
  }

  const saveEdit = async (id) => {
    if (!editingName.trim()) return
    try {
      await updateCategory(id, { name: editingName.trim() })
      setEditingId(null)
      refresh()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteCategory(pendingDelete.id)
      setPendingDelete(null)
      refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  const move = async (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= categories.length) return
    const reordered = [...categories]
    ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
    const withOrders = reordered.map((cat, i) => ({ id: cat.id, display_order: i }))
    try {
      await reorderCategories(withOrders)
      refresh()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-heading text-2xl font-semibold text-ink">Categories</h1>

      <form onSubmit={handleAdd} className="card mb-6 flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="label-field" htmlFor="new-category">Add Category</label>
          <input
            id="new-category"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Keychains"
            className="input-field"
          />
        </div>
        <button type="submit" disabled={adding} className="btn-primary sm:w-fit">
          {adding ? 'Adding…' : '+ Add'}
        </button>
      </form>
      {addError && <p className="mb-4 font-body text-sm text-peach">{addError}</p>}

      {loading && <Spinner label="Loading categories…" />}
      {!loading && error && <ErrorState message={error} onRetry={refresh} />}

      {!loading && !error && (
        <div className="card divide-y divide-ink/5">
          {categories.length === 0 && (
            <p className="p-5 font-body text-sm text-ink-soft">No categories yet. Add your first one above.</p>
          )}
          {categories.map((category, index) => (
            <div key={category.id} className="flex items-center gap-3 p-4">
              <div className="flex flex-col">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="text-ink-soft disabled:opacity-30"
                  aria-label="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === categories.length - 1}
                  className="text-ink-soft disabled:opacity-30"
                  aria-label="Move down"
                >
                  ▼
                </button>
              </div>

              {editingId === category.id ? (
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="input-field flex-1"
                  autoFocus
                />
              ) : (
                <span className="flex-1 font-body text-sm font-semibold text-ink">{category.name}</span>
              )}

              {editingId === category.id ? (
                <>
                  <button onClick={() => saveEdit(category.id)} className="btn-secondary !px-4 !py-2 text-sm">
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="font-body text-sm text-ink-soft">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => startEditing(category)} className="btn-secondary !px-4 !py-2 text-sm">
                    Rename
                  </button>
                  <button
                    onClick={() => setPendingDelete(category)}
                    className="rounded-full px-4 py-2 font-body text-sm font-semibold text-peach transition-colors hover:bg-peach/10"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this category?"
        message={`Products in "${pendingDelete?.name}" will become uncategorized. This cannot be undone.`}
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
