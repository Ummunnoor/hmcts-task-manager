import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Task API (Integration)', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.task.deleteMany(); 
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: 'Prepare case summary',
        dueDate: new Date().toISOString()
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Prepare case summary');
    expect(res.body.status).toBe('TODO');
  });

  it('should retrieve all tasks', async () => {
    await prisma.task.create({
      data: {
        title: 'Test Task',
        dueDate: new Date()
      }
    });

    const res = await request(app).get('/tasks');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should retrieve a task by id', async () => {
    const task = await prisma.task.create({
      data: {
        title: 'Single Task',
        dueDate: new Date()
      }
    });

    const res = await request(app).get(`/tasks/${task.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(task.id);
  });

  it('should update task status', async () => {
    const task = await prisma.task.create({
      data: {
        title: 'Update Task',
        dueDate: new Date()
      }
    });

    const res = await request(app)
      .patch(`/tasks/${task.id}/status`)
      .send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('IN_PROGRESS');
  });

  it('should delete a task', async () => {
    const task = await prisma.task.create({
      data: {
        title: 'Delete Task',
        dueDate: new Date()
      }
    });

    const res = await request(app).delete(`/tasks/${task.id}`);

    expect(res.status).toBe(204);

    const getRes = await request(app).get(`/tasks/${task.id}`);
    expect(getRes.status).toBe(404);
  });

  it('should return 400 when creating task without title', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        dueDate: new Date().toISOString()
      });

    expect(res.status).toBe(400);
  });

  it('should return 400 for invalid status update', async () => {
    const task = await prisma.task.create({
      data: {
        title: 'Invalid Status Task',
        dueDate: new Date()
      }
    });

    const res = await request(app)
      .patch(`/tasks/${task.id}/status`)
      .send({ status: 'INVALID' });

    expect(res.status).toBe(400);
  });

  it('should return 404 for non-existent task', async () => {
    const res = await request(app).get('/tasks/non-existent-id');

    expect(res.status).toBe(404);
  });
});