const mongoose = require('mongoose');
const User = require('../models/userModel'); // Import your User model
const bcrypt = require('bcrypt');

async function seedUsers() {
  try {
    // Check if there are already Users in the database
    const existingUsers = await User.find({email: 'admin@gmail.com'});
    if (!existingUsers) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const defaultUsers = [
        { 
          name: 'Admin', 
          email: 'admin@gmail.com',
          phone: '01816111222',
          roles: "admin",
          password: hashedPassword
        },
        // { name: 'Jane Smith', email: 'janesmith@example.com' },
      ];

      // Insert the default Users into the database
      await User.insertMany(defaultUsers);

      console.log('Default Users have been seeded.');
    } else {
      console.log('Users already exist. Skipping seeding.');
    }
  } catch (error) {
    console.error('Error seeding Users:', error);
  }
}

// Connect to your MongoDB database
mongoose.connect('mongodb://localhost:27017', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  dbName: "test-db"
})
  .then(() => {
    console.error('Database connection ready');
    seedUsers()
      .then(() => {
        // Close the database connection after seeding
        mongoose.connection.close();
      })
      .catch(error => {
        console.error('Error seeding Users:', error);
        mongoose.connection.close();
      });
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });
