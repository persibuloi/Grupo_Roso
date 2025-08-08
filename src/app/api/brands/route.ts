// API Route para obtener marcas
import { NextResponse } from 'next/server';
import type { Brand } from '@/lib/types';

export async function GET() {
  console.log('🏷️ API Brands - Inicio');
  try {
    const Airtable = require('airtable');
    Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
    const base = Airtable.base('appPDMVHaoYx7wL9P');

    const records = await base('Brands').select({
      maxRecords: 100
    }).all();

    const toSlug = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-');

    const brands: Brand[] = records.map((record: any): Brand => {
      const f = record.fields;
      const name = f.Name || '';
      return {
        id: record.id,
        name,
        slug: name ? toSlug(name) : record.id,
        description: f.Description || ''
      };
    });

    console.log(`🏷️ API Brands - ${brands.length} marcas`);
    return NextResponse.json({ success: true, count: brands.length, brands });
  } catch (error: any) {
    console.error('❌ API Brands - Error:', error.message);
    return NextResponse.json({ success: false, error: error.message, count: 0, brands: [] }, { status: 500 });
  }
}
