import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
