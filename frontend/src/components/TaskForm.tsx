import { FormEvent, useState } from 'react';
import { createTask } from '../services/api';
import { TaskStatus } from '../types';

interface TaskFormProps {
  onCreate: () => void;
}

const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

const TaskForm = ({ onCreate }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!title || !dueDate) {
      setError('Task title and due date are required');
      return;
    }

    setLoading(true);

    try {
      await createTask({ title, description: description || undefined, dueDate, status });
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('TODO');
      onCreate();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Create a new task</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Case summary" />
        </label>

        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details" />
        </label>

        <label>
          Due date
          <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>

        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            {statuses.map((option) => (
              <option key={option} value={option}>
                {option.replace('_', ' ')}
              </option>
            ))}
          </select>
        </label>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create task'}
        </button>
      </form>
    </section>
  );
};

export default TaskForm;
