import { NextRequest, NextResponse } from 'next/server';
import { getStoredContent, saveStoredContent, resetStoredContent } from '@/lib/storage';
import { SiteContent } from '@/lib/content-types';

export async function GET() {
  try {
    const content = getStoredContent();
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Failed to get content:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve content' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SiteContent;
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid payload structure' },
        { status: 400 }
      );
    }
    saveStoredContent(body);
    return NextResponse.json({
      success: true,
      message: 'Site content updated successfully',
      data: body,
    });
  } catch (error) {
    console.error('Failed to save content:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const defaultData = resetStoredContent();
    return NextResponse.json({
      success: true,
      message: 'Site content reset to factory defaults',
      data: defaultData,
    });
  } catch (error) {
    console.error('Failed to reset content:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reset content' },
      { status: 500 }
    );
  }
}
