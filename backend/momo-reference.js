// IMPORTANT MoMo Error Code Reference:
// 
// Common MoMo Result Codes:
// 0     - Success
// 9000  - Transaction confirmed
// 1006  - Invalid signature
// 11    - Invalid access_key
// 12    - Invalid secret_key  
// 13    - Invalid partner_code
// 1001  - Transaction is being processed
// 1004  - Amount invalid (too small or too large)
// 1005  - Merchant not exists
// 1007  - Request time is invalid
// 1026  - IP not in whitelist
// 2001  - Transaction not found
// 3001  - User cancelled
// 3002  - Transaction declined
// 4001  - Insufficient balance
// 11007 - Invalid credential (partner_code, access_key, or secret_key)
//
// For resultCode 11007 - This typically means:
// 1. Partner credentials are incorrect or expired
// 2. Using production credentials in sandbox or vice versa

module.exports = {
    // MoMo Sandbox Test Credentials (public test account)
    SANDBOX: {
        PARTNER_CODE: 'MOMOBKUN20180529',
        ACCESS_KEY: 'klm05TvNBqgzqN31',
        SECRET_KEY: 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa',
        API_URL: 'https://test-payment.momo.vn/v2/gateway/api/create'
    }
};
