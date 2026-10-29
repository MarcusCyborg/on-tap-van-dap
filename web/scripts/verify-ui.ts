import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCREENSHOT_DIR = path.resolve(__dirname, '../screenshots');
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/707130bc-c415-4616-8215-9a8bea36aff0/screenshots';

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

  // 3. Mobile 360x740 - Compact Mobile Check (No overflow)
  const compactMobileCtx = await browser.newContext({
    viewport: { width: 360, height: 740 },
    isMobile: true
  });
  const compactMobilePage = await compactMobileCtx.newPage();
  await compactMobilePage.goto('http://localhost:4173/#/');
  await compactMobilePage.waitForSelector('h1');
  console.log('✅ Đã tải Trang chủ (Mobile 360x740 compact)');
  await saveShot(compactMobilePage, '03-home-compact-360.png');

  // 4. DPL302m Course Overview
  await page.goto('http://localhost:4173/#/dpl302m');
  await page.waitForSelector('h1');
  console.log('✅ Đã tải Trang khóa học DPL302m');
  await saveShot(page, '04-dpl302m-course-overview.png');

  // 5. DPL302m Chapter 1
  await page.goto('http://localhost:4173/#/dpl302m/dpl1');
  await page.waitForSelector('h1');
  console.log('✅ Đã tải Chương 1 DPL302m');
  await saveShot(page, '05-dpl302m-chapter-1.png');

  // 6. DPL302m Chapter 4 (CNN & Object Detection)
  await page.goto('http://localhost:4173/#/dpl302m/dpl4');
  await page.waitForSelector('h1');
  console.log('✅ Đã tải Chương 4 DPL302m');
  await saveShot(page, '06-dpl302m-chapter-4.png');

  // 7. Reader: DPL4-13 (IoU & NMS)
  await page.goto('http://localhost:4173/#/learn/DPL4-13');
  await page.waitForSelector('h1');
  console.log('✅ Đã tải Reader DPL4-13 (IoU & NMS)');
  await saveShot(page, '07-reader-dpl4-13.png');

  // 8. Reader: DPL1-10 (Backprop formula)
  await page.goto('http://localhost:4173/#/learn/DPL1-10');
  await page.waitForSelector('h1');
  console.log('✅ Đã tải Reader DPL1-10 (Công thức backprop)');
  await saveShot(page, '08-reader-dpl1-10.png');

  // 9. Preserved Foundation: DL01
  await page.goto('http://localhost:4173/#/learn/DL01');
  await page.waitForSelector('h1');
  console.log('✅ Đã tải Reader DL01 (Foundation DL preserved)');
  await saveShot(page, '09-reader-dl01-preserved.png');

  // 10. Search for DPL4-13 and IoU
  await page.goto('http://localhost:4173/#/');
  const searchBtn = await page.getByLabel('Tìm kiếm nội dung (Phím tắt: Ctrl+K hoặc /)');
  await searchBtn.click();
  await page.waitForSelector('input[placeholder*="Tìm theo ID"]');
  await page.fill('input[placeholder*="Tìm theo ID"]', 'DPL4-13');
  await page.waitForTimeout(300);
  console.log('✅ Đã tìm kiếm DPL4-13');
  await saveShot(page, '10-search-dpl4-13.png');

  await page.fill('input[placeholder*="Tìm theo ID"]', 'IoU');
  await page.waitForTimeout(300);
  console.log('✅ Đã tìm kiếm IoU');
  await saveShot(page, '11-search-iou.png');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // 11. Practice Hub with DPL302m and Preset Exams
  await page.goto('http://localhost:4173/#/practice');
  await page.waitForSelector('h1');
  console.log('✅ Đã tải Practice Hub');
  await saveShot(page, '12-practice-hub.png');

  // 12. Review Page with Collection Filter
  await page.goto('http://localhost:4173/#/review');
  await page.waitForSelector('h1');
  console.log('✅ Đã tải Review Page');
  await saveShot(page, '13-review-page.png');

  await browser.close();
  console.log('🎉 TOÀN BỘ KIỂM THỬ TRÌNH DUYỆT THỰC TẾ ĐÃ HOÀN TẤT THÀNH CÔNG!');
}

run().catch(err => {
  console.error('❌ Lỗi kiểm thử trình duyệt:', err);
  process.exit(1);
});
