import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../apps.js'; 
import User from '../models/user.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth Routes', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id'); // id renvoyé
    expect(res.body.email).toBe('test@example.com');
  });

  it('should not register a user with a duplicate email', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User 2'
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toBe('Utilisateur déjà existant');
  });

  it('should login an existing user successfully', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        email: 'login@example.com',
        password: 'password123',
        name: 'Login User'
      });

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with incorrect password', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        email: 'login@example.com',
        password: 'password123',
        name: 'Login User'
      });

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'login@example.com',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Email ou mot de passe incorrect');
  });
});
