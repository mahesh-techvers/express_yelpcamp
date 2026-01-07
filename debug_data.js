const mongoose = require('mongoose');
const Campground = require('./models/campground');
const User = require('./models/user'); // Assuming User model is in models/user.js

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!");
        console.log(err);
    });

const checkData = async () => {
    try {
        console.log("Checking All Users...");
        const users = await User.find({});
        console.log(`Found ${users.length} users:`);
        users.forEach(u => console.log(` - ${u.username} (${u._id})`));

        if (users.length === 0) {
            console.log("No users found! Creating one...");
            const newUser = new User({ email: 'tim@tim.com', username: 'Tim' });
            // Password logic might depend on passport-local-mongoose, but let's try basic save or just rely on register if possible.
            // Since we don't have the context of auth fully loaded, let's just create a raw doc for now if possible, 
            // but passport-local-mongoose adds fields. 
            // Safer to use User.register if available or just manual.
            // Let's just report 0 users first.
        }


        console.log("Checking Campgrounds...");
        const campgrounds = await Campground.find({}).limit(5).populate('author');
        campgrounds.forEach((camp, index) => {
            console.log(`Campground ${index}: ID=${camp._id}`);
            console.log(`  Title: ${camp.title}`);
            console.log(`  Author field:`, camp.author);
            if (camp.author === undefined) console.log("  Author is UNDEFINED");
            if (camp.author === null) console.log("  Author is NULL");
        });

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.connection.close();
    }
}

checkData();
