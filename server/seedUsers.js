// server/seedUsers.js
// Usage:
// 1) Run manually: node seedUsers.js
// 2) Or import in index.js: const { seed } = require('./seedUsers')

const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fullstack_quick';

const SAMPLE_USERS = [
  { name: 'Alice Kumar', email: 'alice@student.nitw.ac.in', password: 'Password123!', bio: 'Hello, I am Alice.' },
  { name: 'Bob Rao', email: 'bob@student.nitw.ac.in', password: 'Password123!', bio: 'Designer & coffee fan.' },
  { name: 'Chaitanya R', email: 'chaitanya@student.nitw.ac.in', password: 'Password123!', bio: 'Full-stack enthusiast.' },
  { name: 'Deepa S', email: 'deepa@student.nitw.ac.in', password: 'Password123!', bio: 'Data science learner.' },
  { name: 'Esha N', email: 'esha@student.nitw.ac.in', password: 'Password123!', bio: 'Frontend developer.' },
  { name: 'Farhan T', email: 'farhan@student.nitw.ac.in', password: 'Password123!', bio: 'Backend engineer.' }
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB for seeding");
  
  const created = [];
  for (const u of SAMPLE_USERS) {
    try {
      // build a UI-Avatars URL (random background, rounded, size 128)
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&size=128&rounded=true`;

      // find existing user by email
      let user = await User.findOne({ email: u.email.toLowerCase() });

      if (!user) {
        // create new user with hashed password and avatarUrl
        const hash = await User.hashPassword(u.password);
        user = new User({
          name: u.name,
          email: u.email.toLowerCase(),
          passwordHash: hash,
          bio: u.bio,
          avatarUrl: avatar
        });
        await user.save();
        console.log('Created user', user.email);
      } else {
        // update profile fields and avatar for existing user (idempotent)
        user.name = u.name;
        user.bio = u.bio;
        user.avatarUrl = avatar;
        await user.save();
        console.log('Updated user', user.email);
      }

      created.push(user);
    } catch (err) {
      console.error('Error upserting', u.email, err.message || err);
    }
  }


  console.log("Seeding complete.");
  await mongoose.disconnect();
  return created;
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
} else {
  module.exports = { seed };
}
