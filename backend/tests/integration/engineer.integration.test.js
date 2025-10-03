const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const Engineer = require('../../src/models/engineer');

describe('Engineer API Integration Tests', () => {
    beforeAll(async () => {
        const uri = 'mongodb://localhost:27017/engineer_test'; // Use a test database
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await Engineer.deleteMany(); // Clean up the test database
        await mongoose.connection.close();
    });

    it('should create a new engineer', async () => {
        const engineerData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '1234567890'
        };

        const response = await request(app)
            .post('/api/engineers')
            .send(engineerData)
            .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe(engineerData.name);
        expect(response.body.email).toBe(engineerData.email);
        expect(response.body.phone).toBe(engineerData.phone);
    });

    it('should retrieve all engineers', async () => {
        const response = await request(app)
            .get('/api/engineers')
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should retrieve a single engineer by ID', async () => {
        const engineer = await Engineer.create({
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            phone: '0987654321'
        });

        const response = await request(app)
            .get(`/api/engineers/${engineer._id}`)
            .expect(200);

        expect(response.body).toHaveProperty('_id', engineer._id.toString());
        expect(response.body.name).toBe(engineer.name);
    });

    it('should update an engineer', async () => {
        const engineer = await Engineer.create({
            name: 'Mark Smith',
            email: 'mark.smith@example.com',
            phone: '1122334455'
        });

        const updatedData = {
            name: 'Mark Smith Updated',
            email: 'mark.updated@example.com',
            phone: '5566778899'
        };

        const response = await request(app)
            .put(`/api/engineers/${engineer._id}`)
            .send(updatedData)
            .expect(200);

        expect(response.body.name).toBe(updatedData.name);
        expect(response.body.email).toBe(updatedData.email);
        expect(response.body.phone).toBe(updatedData.phone);
    });

    it('should delete an engineer', async () => {
        const engineer = await Engineer.create({
            name: 'Delete Me',
            email: 'delete.me@example.com',
            phone: '1231231234'
        });

        await request(app)
            .delete(`/api/engineers/${engineer._id}`)
            .expect(204);

        const response = await request(app)
            .get(`/api/engineers/${engineer._id}`)
            .expect(404);
    });
});