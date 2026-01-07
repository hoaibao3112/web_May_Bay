// Quick script to check if services exist in the database
const mysql = require('mysql2/promise');

async function checkServices() {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'web_may_bay'
    });

    console.log('Connected to database');

    // Check services
    const [services] = await connection.query('SELECT * FROM dich_vu_dua_don LIMIT 5');
    console.log(`\nFound ${services.length} services in dich_vu_dua_don table:`);
    console.log(services);

    // Check airports
    const [airports] = await connection.query('SELECT * FROM san_bay LIMIT 5');
    console.log(`\nFound ${airports.length} airports in san_bay table:`);
    console.log(airports);

    // Check providers
    const [providers] = await connection.query('SELECT * FROM nha_cung_cap_dua_don LIMIT 5');
    console.log(`\nFound ${providers.length} providers in nha_cung_cap_dua_don table:`);
    console.log(providers);

    await connection.end();
}

checkServices().catch(console.error);
