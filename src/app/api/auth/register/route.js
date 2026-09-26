import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { seedDB } from '@/lib/seed';

export async function POST(req) {
  try {
    await connectDB();
    await seedDB();

    const { name, email, phone, password, role } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role === 'admin' ? 'admin' : 'customer',
    });

    const token = generateToken(user._id);

    return NextResponse.json(
      {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: 'Error registering user', error: error.message }, { status: 500 });
  }
}
