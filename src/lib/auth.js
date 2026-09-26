import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'lemon_elegance_super_secret_jwt_key_2026';

export function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
}

export async function getAuthUser(req) {
  try {
    await connectDB();
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch (err) {
    console.error('Auth verification error:', err.message);
    return null;
  }
}
