const crypto = require('crypto');

// MoMo EXACT public test credentials
const partnerCode = 'MOMOBKUN20180529';
const accessKey = 'klm05TvNBqgzqN31';
const secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';

// Test data
const requestId = 'TEST123456789';
const orderId = 'TEST123456789';
const amount = 10000;
const orderInfo = 'TestPayment';
const redirectUrl = 'http://localhost:5000/payments/momo-return';
const ipnUrl = 'http://localhost:5000/payments/momo-ipn';
const requestType = 'captureWallet';
const extraData = '';

// Build raw signature string EXACTLY as MoMo expects
const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

console.log('Raw Signature String:');
console.log(rawSignature);
console.log('');

// Calculate signature
const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

console.log('Calculated Signature:', signature);
console.log('');

// Now let's try what MoMo documentation says
// Sometimes the issue is encoding - try with Buffer.from
const signatureWithBuffer = crypto
    .createHmac('sha256', secretKey)
    .update(Buffer.from(rawSignature, 'utf-8'))
    .digest('hex');

console.log('Signature (with Buffer):', signatureWithBuffer);
console.log('Signatures match:', signature === signatureWithBuffer ? 'YES' : 'NO');
