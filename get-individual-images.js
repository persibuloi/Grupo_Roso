require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
const base = Airtable.base('appPDMVHaoYx7wL9P');

base('Products').select({ 
  maxRecords: 8,
  filterByFormula: '{Active} = TRUE()'
}).firstPage((err, records) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('URLS INDIVIDUALES POR PRODUCTO:\n');
  
  records.forEach((record, index) => {
    const fields = record.fields;
    console.log(`${index + 1}. ${fields.Name}`);
    console.log(`   SKU: ${fields.SKU}`);
    
    if (fields.Images && fields.Images.length > 0) {
      console.log(`   IMAGEN: ${fields.Images[0].url}`);
    } else {
      console.log(`   IMAGEN: Sin imagen - usar placeholder`);
    }
    console.log('');
  });
});
