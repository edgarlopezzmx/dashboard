// app/api/upload/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = `profiles/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const bucket = process.env.STORAGE_BUCKET || 'dash-files';
    const storage = supabase.storage.from(bucket);

    const { error } = await storage.upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
    });
    
    if (error) {
        console.error('Supabase upload error:', error);
        return NextResponse.json({ error: 'Failed to upload file to Supabase' }, { status: 500 });
    }

    const {data: publicUrlData} = storage.getPublicUrl(filePath);

    await prisma.uploadedFile.create({
        data: {
            filename: file.name,
            path: publicUrlData.publicUrl,
        },
    });

    return NextResponse.json({ 
        message: 'File uploaded successfully', 
        publicUrl: publicUrlData.publicUrl 
    }, 
    { status: 200 });
}
