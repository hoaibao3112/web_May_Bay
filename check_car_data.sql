-- Quick check if car booking exists
SELECT 'Checking car rental booking...' as status;
SELECT * FROM don_thue_xe WHERE id = 1;

-- Check if car type exists
SELECT 'Checking car type...' as status;
SELECT * FROM loai_xe_thue WHERE id = 1;

-- Check if car exists
SELECT 'Checking specific car...' as status;
SELECT * FROM xe_thue WHERE id = 1;

-- Check if company exists
SELECT 'Checking car company...' as status;
SELECT * FROM nha_cung_cap_xe WHERE id = 1;
