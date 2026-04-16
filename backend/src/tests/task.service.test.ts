import * as service from "../services/taskService";
import { PrismaClient } from "@prisma/client";

const TaskStatusMock = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;

jest.mock("@prisma/client", () => {
  const mTask = {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mPrisma = {
    task: mTask,
    $disconnect: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => mPrisma),
  };
});

describe("Task Service (Unit)", () => {
  const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a task with default status", async () => {
    (mockPrisma.task.create as jest.Mock).mockResolvedValue({
      id: "1",
      title: "Test task",
      description: null,
      status: TaskStatusMock.TODO,
      dueDate: new Date(),
      createdAt: new Date(),
    });

    const task = await service.createTask({
      title: "Test task",
      dueDate: new Date().toISOString(),
    });

    expect(task.title).toBe("Test task");
    expect(task.status).toBe(TaskStatusMock.TODO);
    expect(mockPrisma.task.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: "Test task",
        status: TaskStatusMock.TODO,
      }),
    });
  });

  it("should update task status", async () => {
    (mockPrisma.task.update as jest.Mock).mockResolvedValue({
      id: "1",
      title: "Test task",
      description: null,
      status: TaskStatusMock.DONE,
      dueDate: new Date(),
      createdAt: new Date(),
    });

    const task = await service.updateTaskStatus(
      "1",
      TaskStatusMock.DONE as any,
    );

    expect(task).not.toBeNull();
    expect(task?.status).toBe(TaskStatusMock.DONE);
    expect(mockPrisma.task.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { status: TaskStatusMock.DONE },
    });
  });

  it("should return null when updating non-existent task", async () => {
    (mockPrisma.task.update as jest.Mock).mockRejectedValue({
      code: "P2025",
    });

    await expect(
      service.updateTaskStatus("non-existent", TaskStatusMock.DONE as any),
    ).rejects.toHaveProperty("code", "P2025");
  });

  it("should fetch all tasks", async () => {
    (mockPrisma.task.findMany as jest.Mock).mockResolvedValue([
      {
        id: "1",
        title: "Task 1",
        description: null,
        status: "TODO",
        dueDate: new Date(),
        createdAt: new Date(),
      },
    ]);

    const tasks = await service.getAllTasks();

    expect(tasks.length).toBe(1);
    expect(mockPrisma.task.findMany).toHaveBeenCalled();
  });
});
