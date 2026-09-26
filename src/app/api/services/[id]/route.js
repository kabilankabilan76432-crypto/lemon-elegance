import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/Service';
import { getAuthUser } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const service = await Service.findById(params.id);
    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching service', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized: Admin role required' }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const service = await Service.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating service', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized: Admin role required' }, { status: 403 });
    }

    await connectDB();
    await Service.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting service', error: error.message }, { status: 500 });
  }
}
