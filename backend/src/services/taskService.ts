import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  dueDate: Date;
  createdAt: Date;
}

export const createTask = async (data: {
  title: string;
  description?: string;
  dueDate: string;
  status?: TaskStatus;
}): Promise<Task> => {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status ?? TaskStatus.TODO,
      dueDate: new Date(data.dueDate)
    }
  });
};

export const getAllTasks = async (): Promise<Task[]> => {
  return prisma.task.findMany({ orderBy: { dueDate: 'asc' } });
};

export const getTaskById = async (id: string): Promise<Task | null> => {
  return prisma.task.findUnique({ where: { id } });
};

export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task | null> => {
  return prisma.task.update({
    where: { id },
    data: { status }
  });
};

export const deleteTask = async (id: string): Promise<boolean> => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return false;
  await prisma.task.delete({ where: { id } });
  return true;
};
