const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const clearDatabase = async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collection of collections) {
        await mongoose.connection.collections[collection].deleteMany({});
    }
};

beforeAll(async () => {
    await connectDB();
});

afterEach(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
});