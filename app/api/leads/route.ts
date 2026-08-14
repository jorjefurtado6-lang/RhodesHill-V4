import { NextRequest, NextResponse } from 'next/server';
import { getStoredLeads, saveStoredLead, updateStoredLeadStatus, deleteStoredLead } from '@/lib/storage';

export async function GET() {
  try {
    const leads = getStoredLeads();
    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    console.error('Failed to get leads:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve leads' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || (!body.email && !body.phone)) {
      return NextResponse.json(
        { success: false, message: 'Name and contact info are required' },
        { status: 400 }
      );
    }
    const created = saveStoredLead(body);
    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully',
      data: created,
    });
  } catch (error) {
    console.error('Failed to save lead:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'ID and status required' },
        { status: 400 }
      );
    }
    const updated = updateStoredLeadStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Lead status updated successfully',
    });
  } catch (error) {
    console.error('Failed to update lead:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Lead ID is required' },
        { status: 400 }
      );
    }
    deleteStoredLead(id);
    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete lead:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
