const mongoose = require('mongoose');
const User = require('../models/user');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log("MongoDB connected");
        runTest();
    })
    .catch(err => {
        console.log("MongoDB connection error:", err);
    });

async function runTest() {
    try {
        console.log("Attempting to register user...");
        // Clean up previous test user if exists
        await User.deleteOne({ email: 'test@debug.com' });

        const user = new User({ email: 'test@debug.com', username: 'testdebug' });
        const registeredUser = await User.register(user, 'password');
        console.log("User registered successfully:", registeredUser);
    } catch (err) {
        console.error("CAUGHT ERROR:");
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}
