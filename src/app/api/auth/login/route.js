import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { seedDB } from '@/lib/seed';

export async function POST(req) {
  try {
    await connectDB();
    await seedDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Please enter email and password' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken(user._id);

    return NextResponse.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error logging in', error: error.message }, { status: 500 });
  }
}
