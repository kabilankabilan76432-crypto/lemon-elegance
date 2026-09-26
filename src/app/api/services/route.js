import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/Service';
import { getAuthUser } from '@/lib/auth';
import { seedDB } from '@/lib/seed';

export async function GET(req) {
  try {
    await connectDB();
    await seedDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const activeOnly = searchParams.get('activeOnly');

    let query = {};
    if (activeOnly !== 'false') {
      query.isActive = true;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const services = await Service.find(query).sort({ category: 1, name: 1 });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching services', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized: Admin role required' }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const service = await Service.create(body);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating service', error: error.message }, { status: 500 });
  }
}
