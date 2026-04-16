import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Notification from './components/Notification';
import { Task } from './types';
import { fetchTasks } from './services/api';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <main className="page-shell">
      {/* GOV-style header */}
      <header className="banner">
        <div>
          <p className="govuk-caption-xl">
            HMCTS Caseworker task management
          </p>
          <h1>Manage your casework tasks</h1>
          <p>
            Create, update and track tasks for case hearings and reviews.
          </p>
        </div>
      </header>

      {/* Global notification */}
      <Notification
        message={message}
        onClose={() => setMessage('')}
      />

      <div className="layout">
        {/* Task creation */}
        <TaskForm
          onCreate={() => {
            setMessage('✅ Task created successfully');
            loadTasks();
          }}
        />

        {/* Task list */}
        <div className="panel">
          <h2>Task overview</h2>

          {error && <div className="error">{error}</div>}

          <TaskList
            tasks={tasks}
            loading={loading}
            onRefresh={loadTasks}
            onSuccess={(msg) => setMessage(msg)}
          />
        </div>
      </div>
    </main>
  );
}

export default App;