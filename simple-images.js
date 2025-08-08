require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
const base = Airtable.base('appPDMVHaoYx7wL9P');

base('Products').select({ maxRecords: 3 }).firstPage((err, records) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  records.forEach((record, index) => {
    const fields = record.fields;
    console.log(`PRODUCTO ${index + 1}: ${fields.Name}`);
    
    if (fields.Images && fields.Images.length > 0) {
      console.log(`URL: ${fields.Images[0].url}`);
    } else {
      console.log('Sin imagen');
    }
    console.log('---');
  });
});
