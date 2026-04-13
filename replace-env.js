const fs = require('fs');
const path = require('path');

const filePath = path.join(
  __dirname,
  'src/environments/environment.prod.ts'
);

let content = fs.readFileSync(filePath, 'utf8');

const replacements = {
  __GEMINI_API_KEY__:       process.env.GEMINI_API_KEY,
  __FIREBASE_API_KEY__:     process.env.FIREBASE_API_KEY,
  __FIREBASE_APP_ID__:      process.env.FIREBASE_APP_ID,
  __FIREBASE_MEASUREMENT__: process.env.FIREBASE_MEASUREMENT,
  __VAPID_KEY__:            process.env.VAPID_KEY,
};

for (const [placeholder, value] of Object.entries(replacements)) {
  if (!value) {
    console.warn(`⚠️  WARNING: No value found for ${placeholder}`);
    continue;
  }
  content = content.replaceAll(placeholder, value);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ environment.prod.ts placeholders replaced successfully');