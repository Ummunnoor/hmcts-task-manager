import { Task, TaskStatus } from '../types';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const handleResponse = async (response: Response) => {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.message || 'API request failed';
    throw new Error(message);
  }
  return body;
};

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${baseUrl}/tasks`);
  return handleResponse(response);
};

export const createTask = async (payload: {
  title: string;
  description?: string;
  dueDate: string;
  status: TaskStatus;
}): Promise<Task> => {
  const response = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
};

export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task> => {
  const response = await fetch(`${baseUrl}/tasks/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return handleResponse(response);
};

export const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch(`${baseUrl}/tasks/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Unable to delete task');
  }
};
