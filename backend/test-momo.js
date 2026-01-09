// Test MoMo configuration
require('dotenv').config();
const crypto = require('crypto');
const axios = require('axios');

console.log('🔍 Testing MoMo Configuration...\n');

// Check environment variables
const partnerCode = process.env.MOMO_PARTNER_CODE;
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;
const apiUrl = process.env.MOMO_API_URL;
const redirectUrl = process.env.MOMO_REDIRECT_URL;
const ipnUrl = process.env.MOMO_IPN_URL;

console.log('📋 Configuration Check:');
console.log('✓ MOMO_PARTNER_CODE:', partnerCode ? '✓ Set' : '❌ Missing');
console.log('✓ MOMO_ACCESS_KEY:', accessKey ? '✓ Set' : '❌ Missing');
console.log('✓ MOMO_SECRET_KEY:', secretKey ? `✓ Set (${secretKey.substring(0, 5)}...)` : '❌ Missing');
console.log('✓ MOMO_API_URL:', apiUrl || '❌ Missing');
console.log('✓ MOMO_REDIRECT_URL:', redirectUrl || '❌ Missing');
console.log('✓ MOMO_IPN_URL:', ipnUrl || '❌ Missing');

if (!partnerCode || !accessKey || !secretKey || !apiUrl || !redirectUrl || !ipnUrl) {
    console.log('\n❌ Missing required environment variables!');
    process.exit(1);
}

// Test MoMo API call
async function testMoMoAPI() {
    console.log('\n🚀 Testing MoMo API Request...\n');

    const requestId = 'TEST' + Date.now();
    const orderId = 'TEST' + Date.now();
    const amount = 10000; // 10,000 VND for testing
    const orderInfo = 'TestMoMoPayment'; // No spaces to avoid encoding issues
    const requestType = 'captureWallet';
    const extraData = '';

    // MoMo requires params in alphabetical order for signature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    console.log('🔐 Raw Signature String:');
    console.log(rawSignature);
    console.log('');
    console.log('📝 Raw Signature Length:', rawSignature.length);

    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    console.log('\n✅ Generated Signature:', signature);

    const requestBody = {
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang: 'vi'
    };

    console.log('\n📤 Request Body:');
    console.log(JSON.stringify(requestBody, null, 2));

    try {
        console.log('\n🔄 Sending request to MoMo...');
        const response = await axios.post(apiUrl, requestBody);

        console.log('\n✅ MoMo Response:');
        console.log(JSON.stringify(response.data, null, 2));

        if (response.data && response.data.payUrl) {
            console.log('\n✅ SUCCESS! Payment URL generated:');
            console.log(response.data.payUrl);
        } else {
            console.log('\n⚠️ Response received but no payUrl');
            console.log('Result Code:', response.data.resultCode);
            console.log('Message:', response.data.message);
        }
    } catch (error) {
        console.log('\n❌ Error calling MoMo API:');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Full Response Data:');
            console.log(JSON.stringify(error.response.data, null, 2));

            // Log detailed error info
            const errorData = error.response.data;
            console.log('\n📋 Error Details:');
            console.log('- Result Code:', errorData.resultCode);
            console.log('- Message:', errorData.message);
            console.log('- Local Message:', errorData.localMessage);

            // Save to file for inspection
            require('fs').writeFileSync('momo-error.json', JSON.stringify({
                requestBody,
                response: errorData
            }, null, 2));
            console.log('\n💾 Full error saved to momo-error.json');
        } else {
            console.log('Error:', error.message);
        }
    }
}

testMoMoAPI();
