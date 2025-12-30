const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'calculations.ts');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Define category mappings (from current to desired)
const categoryMappings = {
  "'Cardiology'": "'cardiology'",
  "'Critical Care'": "'critical-care'",
  "'Gastroenterology'": "'gastroenterology'",
  "'General'": "'general'",
  "'Hematology'": "'hematology'",
  "'Hepatology'": "'hepatology'",
  "'Metabolism'": "'metabolism'"
};

// Replace each category
for (const [oldCat, newCat] of Object.entries(categoryMappings)) {
  const regex = new RegExp(`category:\\s*${oldCat}`, 'g');
  content = content.replace(regex, `category: ${newCat}`);
}

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('Categories updated successfully!');
