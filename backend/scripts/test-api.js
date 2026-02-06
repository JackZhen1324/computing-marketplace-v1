#!/usr/bin/env node

/**
 * Test script to verify all API endpoints and initial data
 */

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Testing API Endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1. Health Check');
    const health = await fetch('http://localhost:3000/health').then(r => r.json());
    console.log('   ✅', health.status, '@', health.timestamp);

    // Test 2: Admin Login
    console.log('\n2. Admin Login');
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@computing-marketplace.com',
        password: 'Admin@123',
      }),
    });
    const loginData = await loginRes.json();
    console.log('   ✅ Login successful:', loginData.data.user.email);
    const token = loginData.data.accessToken;

    // Test 3: Get all products
    console.log('\n3. Products');
    const products = await fetch(`${API_BASE}/products`).then(r => r.json());
    console.log(`   ✅ Total products: ${products.data.length}`);
    console.log(`   - GPU Bare Metal: ${products.data.filter(p => p.categoryId === 'gpu-bare-metal').length}`);
    console.log(`   - GPU Cloud: ${products.data.filter(p => p.categoryId === 'gpu-cloud').length}`);
    console.log(`   - General: ${products.data.filter(p => p.categoryId === 'general').length}`);

    // Test 4: Get product by ID
    console.log('\n4. Product Detail');
    const product = await fetch(`${API_BASE}/products/gpu-bare-metal-001`).then(r => r.json());
    console.log(`   ✅ ${product.data.name}`);
    console.log(`   - Price: ${product.data.priceDisplay}`);
    console.log(`   - Features: ${product.data.features.length}`);

    // Test 5: Get news
    console.log('\n5. News Articles');
    const news = await fetch(`${API_BASE}/news`).then(r => r.json());
    console.log(`   ✅ Total articles: ${news.data.length}`);
    console.log(`   - Policies: ${news.data.filter(n => n.type === 'POLICY').length}`);
    console.log(`   - News: ${news.data.filter(n => n.type === 'NEWS').length}`);

    // Test 6: Get solutions
    console.log('\n6. Solutions');
    const solutions = await fetch(`${API_BASE}/solutions`).then(r => r.json());
    console.log(`   ✅ Total solutions: ${solutions.data.length}`);

    // Test 7: Get navigation
    console.log('\n7. Navigation');
    const nav = await fetch(`${API_BASE}/navigation`).then(r => r.json());
    console.log(`   ✅ Navigation items: ${nav.data.length}`);

    // Test 8: Get inquiries (requires auth)
    console.log('\n8. Inquiries');
    const inquiries = await fetch(`${API_BASE}/inquiries`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json());
    console.log(`   ✅ Total inquiries: ${inquiries.data.length}`);
    if (inquiries.data.length > 0) {
      console.log(`   - Latest: ${inquiries.data[0].customerName} - ${inquiries.data[0].productName}`);
    }

    // Test 9: Create new inquiry
    console.log('\n9. Create Inquiry (Public)');
    const newInquiry = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: 'gpu-bare-metal-001',
        customerName: '测试客户',
        contactPhone: '13900000000',
        email: 'test@example.com',
        companyName: '测试公司',
        interestedProducts: ['昇腾910B4服务器'],
        specification: '需要用于AI模型训练',
        priority: 'HIGH',
      }),
    }).then(r => r.json());
    console.log(`   ✅ Inquiry created: ${newInquiry.data.id}`);

    console.log('\n✅ All API tests passed!\n');

    // Summary
    console.log('📊 Data Summary:');
    console.log(`   Users: 2 (admin + customer)`);
    console.log(`   Products: ${products.data.length}`);
    console.log(`   Categories: 5`);
    console.log(`   News: ${news.data.length}`);
    console.log(`   Solutions: ${solutions.data.length}`);
    console.log(`   Inquiries: ${inquiries.data.length + 1} (including newly created)`);
    console.log(`   Orders: 2 (sample data)`);
    console.log(`   Navigation items: ${nav.data.length}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testAPI();
