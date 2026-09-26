import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/Service';
import { getAuthUser } from '@/lib/auth';
import { seedDB, sampleServices } from '@/lib/seed';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const activeOnly = searchParams.get('activeOnly');

  let services = [];

  try {
    await connectDB();
    await seedDB();

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

    services = await Service.find(query).sort({ category: 1, name: 1 });
  } catch (error) {
    console.warn('[Services API] Database fetch error, using static catalog fallback:', error.message);
  }

  // Fallback to sampleServices if database returned empty array or connection failed on Vercel
  if (!services || services.length === 0) {
    let filtered = sampleServices.map((s, idx) => ({ ...s, _id: `sample_${idx + 1}` }));
    if (activeOnly !== 'false') {
      filtered = filtered.filter((s) => s.isActive);
    }
    if (category && category !== 'All') {
      filtered = filtered.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    }
    services = filtered;
  }

  return NextResponse.json(services);
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
