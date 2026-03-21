const fs = require('fs');
const files = [
  'app/utils/conversationflows.ts',
  'utils/personalizationMapper.ts',
  'utils/cyclesymptoms.ts'
];

console.log('FILE VERIFICATION:');
let allGood = true;
files.forEach(f => {
  if (fs.existsSync(f)) {
    const lines = fs.readFileSync(f, 'utf8').split('\n').length;
    console.log(`✅ ${f}: ${lines} lines`);
  } else {
    console.log(`❌ ${f}: NOT FOUND`);
    allGood = false;
  }
});

if (allGood) {
  console.log('\n✅ ALL FILES CREATED AND VERIFIED');
}
process.exit(allGood ? 0 : 1);
