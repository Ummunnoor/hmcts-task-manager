import { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { deleteTask, updateTaskStatus } from '../services/api';
import ConfirmModal from './ConfirmModal';
import React from 'react';

interface TaskListProps {
  tasks: Task[];
  onRefresh: () => void;
  loading: boolean;
  onSuccess: (message: string) => void;
}

const statusLabels: Record<TaskStatus, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  DONE: 'Done'
};

const TaskList = ({ tasks, onRefresh, loading, onSuccess }: TaskListProps) => {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // modal state
  const [modalTaskId, setModalTaskId] = useState<string | null>(null);

  // keep localTasks in sync when parent updates
  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    const task = localTasks.find(t => t.id === id);
    if (!task || task.status === 'DONE') return; // 🚫 prevent updates

    setUpdatingId(id);
    setError('');

    // ✅ optimistic update
    const previousTasks = [...localTasks];
    setLocalTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTaskStatus(id, newStatus);
      onSuccess('✅ Task updated successfully');
    } catch (err) {
      setError((err as Error).message || 'Failed to update task');

      // 🔁 rollback if failed
      setLocalTasks(previousTasks);
    } finally {
      setUpdatingId(null);
      onRefresh(); // sync with backend
    }
  };

  const confirmDelete = async () => {
    if (!modalTaskId) return;

    setDeletingId(modalTaskId);
    setError('');

    try {
      await deleteTask(modalTaskId);

      // ✅ optimistic remove
      setLocalTasks(prev => prev.filter(t => t.id !== modalTaskId));

      onSuccess('🗑️ Task deleted successfully');
    } catch (err) {
      setError((err as Error).message || 'Failed to delete task');
    } finally {
      setDeletingId(null);
      setModalTaskId(null);
      onRefresh();
    }
  };

  if (loading) return <p>Loading tasks…</p>;
  if (!localTasks.length) return <p>No tasks have been created yet.</p>;

  return (
    <section>
      {error && <div className="error">{error}</div>}

      <div className="task-grid">
        {localTasks.map(task => {
          const isUpdating = updatingId === task.id;
          const isDeleting = deletingId === task.id;
          const isDone = task.status === 'DONE';

          return (
            <article key={task.id} className="task-card">
              <div className="task-card__head">
                <h3>{task.title}</h3>

                <button
                  className="text-button"
                  disabled={isDeleting}
                  onClick={() => setModalTaskId(task.id)}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>

              <p>{task.description || 'No description provided'}</p>

              <div className="task-card__meta">
                <span>
                  Due {new Date(task.dueDate).toLocaleString()}
                </span>

                <select
                  value={task.status}
                  disabled={isUpdating || isDone} // ✅ disable ONLY dropdown + block DONE
                  onChange={e =>
                    handleStatusChange(task.id, e.target.value as TaskStatus)
                  }
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          );
        })}
      </div>

      {/* ✅ Modal */}
      <ConfirmModal
        isOpen={!!modalTaskId}
        message="Are you sure you want to delete this task?"
        onCancel={() => setModalTaskId(null)}
        onConfirm={confirmDelete}
        loading={!!deletingId}
      />
    </section>
  );
};

export default TaskList;