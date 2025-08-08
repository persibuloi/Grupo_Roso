// API Route para obtener categorías
import { NextResponse } from 'next/server';
import type { Category } from '@/lib/types';

export async function GET() {
  console.log('📚 API Categories - Inicio');
  try {
    const Airtable = require('airtable');
    Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
    const base = Airtable.base('appPDMVHaoYx7wL9P');

    const records = await base('Categories').select({
      maxRecords: 100
    }).all();

    const toSlug = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-');

    const categories: Category[] = records.map((record: any): Category => {
      const f = record.fields;
      const name = f.Name || '';
      return {
        id: record.id,
        name,
        slug: name ? toSlug(name) : record.id,
        description: f.Description || ''
      };
    });

    console.log(`📚 API Categories - ${categories.length} categorías`);
    return NextResponse.json({ success: true, count: categories.length, categories });
  } catch (error: any) {
    console.error('❌ API Categories - Error:', error.message);
    return NextResponse.json({ success: false, error: error.message, count: 0, categories: [] }, { status: 500 });
  }
}
