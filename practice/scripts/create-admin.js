import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Check for MongoDB URI
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env.local');
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get admin details from command line arguments or use defaults
    const name = process.argv[2] || 'Admin User';
    const email = process.argv[3] || 'admin@example.com';
    const password = process.argv[4] || 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log(`❌ User with email "${email}" already exists!`);
      process.exit(1);
    }

    // Hash password
    console.log('Hashing password...');
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create admin user
    console.log('Creating admin user...');
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('-----------------------------------');
    console.log(`Name:     ${name}`);
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     admin`);
    console.log('-----------------------------------\n');
    console.log('⚠️  Please save these credentials and change the password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
