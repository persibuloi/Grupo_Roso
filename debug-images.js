require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
const base = Airtable.base('appPDMVHaoYx7wL9P');

base('Products').select({ 
  filterByFormula: '{Active} = TRUE()',
  maxRecords: 8
}).firstPage((err, records) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log(`PRODUCTOS ACTIVOS: ${records.length}\n`);
  
  records.forEach((record, index) => {
    const fields = record.fields;
    console.log(`${index + 1}. ${fields.Name}`);
    
    if (fields.Images && fields.Images.length > 0) {
      console.log(`   IMAGEN: ${fields.Images[0].url}`);
    } else {
      console.log(`   SIN IMAGEN`);
    }
    console.log('');
  });
});
