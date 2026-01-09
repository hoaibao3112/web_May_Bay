// Check exact env values
require('dotenv').config();

console.log('=== Checking .env file values ===\n');

const vars = {
    'MOMO_PARTNER_CODE': process.env.MOMO_PARTNER_CODE,
    'MOMO_ACCESS_KEY': process.env.MOMO_ACCESS_KEY,
    'MOMO_SECRET_KEY': process.env.MOMO_SECRET_KEY,
};

Object.entries(vars).forEach(([key, value]) => {
    console.log(`${key}:`);
    console.log(`  Value: "${value}"`);
    console.log(`  Length: ${value?.length || 0}`);
    console.log(`  Has spaces: ${value?.includes(' ') ? 'YES ⚠️' : 'NO ✓'}`);
    console.log(`  Starts with space: ${value?.startsWith(' ') ? 'YES ⚠️' : 'NO ✓'}`);
    console.log(`  Ends with space: ${value?.endsWith(' ') ? 'YES ⚠️' : 'NO ✓'}`);
    console.log('');
});

// Expected values
const expected = {
    'PARTNER_CODE': 'MOMOBKUN20180529',
    'ACCESS_KEY': 'klm05TvNBqgzqN31',
    'SECRET_KEY': 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa',
};

console.log('=== Comparing with expected values ===\n');

console.log('PARTNER_CODE match:', process.env.MOMO_PARTNER_CODE === expected.PARTNER_CODE ? '✓' : '✗');
console.log('ACCESS_KEY match:', process.env.MOMO_ACCESS_KEY === expected.ACCESS_KEY ? '✓' : '✗');
console.log('SECRET_KEY match:', process.env.MOMO_SECRET_KEY === expected.SECRET_KEY ? '✓' : '✗');

if (process.env.MOMO_ACCESS_KEY !== expected.ACCESS_KEY) {
    console.log('\n❌ ACCESS_KEY mismatch!');
    console.log('Expected:', expected.ACCESS_KEY);
    console.log('Got:     ', process.env.MOMO_ACCESS_KEY);
    console.log('Bytes:   ', Buffer.from(process.env.MOMO_ACCESS_KEY).toString('hex'));
}

if (process.env.MOMO_SECRET_KEY !== expected.SECRET_KEY) {
    console.log('\n❌ SECRET_KEY mismatch!');
    console.log('Expected:', expected.SECRET_KEY);
    console.log('Got:     ', process.env.MOMO_SECRET_KEY);
    console.log('Bytes:   ', Buffer.from(process.env.MOMO_SECRET_KEY).toString('hex'));
}
