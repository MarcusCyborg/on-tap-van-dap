import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCREENSHOT_DIR = path.resolve(__dirname, '../screenshots');
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/318f27a3-27e4-4b66-9765-16806254986a/screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function saveShot(page: any, name: string) {
  const localPath = path.join(SCREENSHOT_DIR, name);
  const artifactPath = path.join(ARTIFACT_DIR, name);
  await page.screenshot({ path: localPath, fullPage: false });
  fs.copyFileSync(localPath, artifactPath);
  console.log(`📸 Đã lưu ảnh: ${name}`);
}

async function run() {
  console.log('🚀 Bắt đầu kiểm thử trình duyệt thực tế với Microsoft Edge...');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });

  // 1. Desktop 1440x900 - Home View
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await desktopCtx.newPage();

  await page.goto('http://localhost:4173/#/');
  await page.waitForSelector('h1');
  console.log('✅ Đã tải Trang chủ (Desktop 1440x900)');
  await saveShot(page, '01-home-desktop.png');

  // 2. Mobile 390x844 - Home View
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto('http://localhost:4173/#/');
  await mobilePage.waitForSelector('h1');
  console.log('✅ Đã tải Trang chủ (Mobile 390x844)');
  await saveShot(mobilePage, '02-home-mobile.png');

  // 3. Navigate to Subject TOC (Machine Learning)
  await page.goto('http://localhost:4173/#/subjects/ml');
  await page.waitForSelector('h1');
  console.log('✅ Đã tải Mục lục chuyên đề Machine Learning');
  await saveShot(page, '03-subject-ml-toc.png');

  // 4. Test Concept Reader with Sim 1 (XS05: Mean, Median & Ngoại lệ)
  await page.goto('http://localhost:4173/#/learn/XS05');
  await page.waitForSelector('h1');
  console.log('✅ Đã tải Reader XS05 (Mean, Median & Ngoại lệ)');

  // Change outlier slider to 50
  const slider = await page.$('input[type="range"]');
  if (slider) {
    await slider.fill('50');
    await page.waitForTimeout(200);
  }
  await saveShot(page, '04-reader-xs05-sim-mean-median.png');

  // 5. Test Concept Reader with Sim 3 (ML29: Confusion Matrix & Ngưỡng)
  await page.goto('http://localhost:4173/#/learn/ML29');
  await page.waitForSelector('h1');
  console.log('✅ Đã tải Reader ML29 (Confusion Matrix)');
  await saveShot(page, '05-reader-ml29-confusion-matrix.png');

  // 6. Test Concept Reader with Sim 6 (DL09: Gradient Descent)
  await page.goto('http://localhost:4173/#/learn/DL09');
  await page.waitForSelector('h1');
  console.log('✅ Đã tải Reader DL09 (Gradient Descent)');

  // Click "Một bước" button
  const stepBtn = await page.getByRole('button', { name: 'Một bước' });
  if (stepBtn) {
    await stepBtn.click();
    await page.waitForTimeout(200);
  }
  await saveShot(page, '06-reader-dl09-gradient-descent.png');

  // 7. Test Concept Reader with Sim 7 (GT12: Binary Search)
  await page.goto('http://localhost:4173/#/learn/GT12');
  await page.waitForSelector('h1');
  console.log('✅ Đã tải Reader GT12 (Binary Search)');

  // Click "Bước tiếp"
  const nextStepBtn = await page.getByRole('button', { name: 'Bước tiếp' });
  if (nextStepBtn) {
    await nextStepBtn.click();
    await page.waitForTimeout(200);
  }
  await saveShot(page, '07-reader-gt12-binary-search.png');

  // 8. Test Search Modal
  await page.goto('http://localhost:4173/#/');
  const searchBtn = await page.getByLabel('Tìm kiếm nội dung (Phím tắt: Ctrl+K hoặc /)');
  await searchBtn.click();
  await page.waitForSelector('input[placeholder*="Tìm theo ID"]');
  await page.fill('input[placeholder*="Tìm theo ID"]', 'do lech chuan');
  await page.waitForTimeout(300);
  console.log('✅ Đã mở Modal tìm kiếm và nhập "do lech chuan"');
  await saveShot(page, '08-search-modal.png');

  // Close search modal with Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 9. Test Practice Hub & Exam Session
  await page.goto('http://localhost:4173/#/practice');
  await page.waitForSelector('h1');
  console.log('✅ Đã tải Practice Hub');

  // Start Exam 1
  const exam1Btn = await page.getByRole('button', { name: 'Bắt đầu làm Đề 1' });
  await exam1Btn.click();
  await page.waitForSelector('h1');
  console.log('✅ Đã vào bài thi thử Đề 1');
  await saveShot(page, '09-practice-session-q1.png');

  // Reveal answer in exam
  const revealBtn = await page.getByRole('button', { name: /Xem đáp án đối chiếu/ });
  if (revealBtn) {
    await revealBtn.click();
    await page.waitForTimeout(200);
  }

  // Score 2 points
  const score2Btn = await page.getByRole('button', { name: /2 điểm/ });
  if (score2Btn) {
    await score2Btn.click();
    await page.waitForTimeout(200);
  }
  await saveShot(page, '10-practice-session-scored.png');

  // 10. Test Mobile Navigation Drawer
  await mobilePage.goto('http://localhost:4173/#/');
  const menuBtn = await mobilePage.getByLabel('Mở menu điều hướng');
  if (menuBtn) {
    await menuBtn.click();
    await mobilePage.waitForTimeout(200);
  }
  console.log('✅ Đã mở Drawer điều hướng trên mobile');
  await saveShot(mobilePage, '11-mobile-drawer.png');

  await browser.close();
  console.log('🎉 TOÀN BỘ KIỂM THỬ TRÌNH DUYỆT THỰC TẾ ĐÃ HOÀN TẤT THÀNH CÔNG!');
}

run().catch(err => {
  console.error('❌ Lỗi kiểm thử trình duyệt:', err);
  process.exit(1);
});
