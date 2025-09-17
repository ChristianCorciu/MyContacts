import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../apps.js';
import User from '../models/user.js';
import Contact from '../models/contact.js';

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Contact.deleteMany({});

  const userRes = await request(app)
    .post('/auth/register')
    .send({ email: 'contacttest@example.com', password: 'password', name: 'Contact Test' });
  
  token = null; // ton register ne renvoie pas de token
  userId = userRes.body.id;
});

describe('Contact Routes', () => {
  it('should create a contact for an authenticated user', async () => {
    // créer token via login
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'contacttest@example.com', password: 'password' });
    token = loginRes.body.token;

    const res = await request(app)
      .post('/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe('John Doe');
    expect(res.body.user.toString()).toBe(userId.toString());
  });

  it('should not create a contact without a token', async () => {
    const res = await request(app)
      .post('/contacts')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
      });
    expect(res.statusCode).toEqual(401);
  });

  it('should get all contacts for an authenticated user', async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'contacttest@example.com', password: 'password' });
    token = loginRes.body.token;

    await request(app)
      .post('/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Contact 1', email: 'c1@ex.com', phone: '111' });

    const res = await request(app)
      .get('/contacts')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Contact 1');
  });

  it('should delete a contact', async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'contacttest@example.com', password: 'password' });
    token = loginRes.body.token;

    const contactRes = await request(app)
      .post('/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'To Delete', email: 'del@ex.com', phone: '999' });

    const contactId = contactRes.body._id;

    const res = await request(app)
      .delete(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Contact supprimé avec succès.');
  });

  it('should update a contact', async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'contacttest@example.com', password: 'password' });
    token = loginRes.body.token;

    const contactRes = await request(app)
      .post('/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Original Name', email: 'orig@ex.com', phone: '555' });

    const contactId = contactRes.body._id;

    const res = await request(app)
      .put(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Updated Name');
  });
});
