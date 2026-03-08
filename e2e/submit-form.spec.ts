import { test, expect, Page } from "@playwright/test";
import path from "path";

const TEST_FILES_DIR = path.join(__dirname, "test-files");

// ─── Helper: fill step 1 required fields ─────────────────────
async function fillStep1(page: Page) {
  await page.locator('input[name="associationName"]').fill("جمعية الاختبار");
  await page.locator('input[name="licenseNumber"]').fill("12345");
  await page.locator('input[name="foundingDate"]').fill("2020-01-01");
  await page
    .locator('input[name="supervisoryAuthority"]')
    .fill("وزارة الموارد البشرية");
  await page.locator('input[name="geographicLocation"]').fill("الرياض");
  await page.locator('input[name="serviceScope"]').fill("المنطقة الوسطى");
  await page.locator('input[name="headquartersAddress"]').fill("حي العليا");
  await page
    .locator('textarea[name="socialMediaLinks"]')
    .fill("https://example.com");
}

// ─── Helper: enable upload and get file input ────────────────
async function enableStrategicPlanUpload(page: Page) {
  await fillStep1(page);
  await page.getByRole("button", { name: "التالي" }).click();
  await page.waitForTimeout(500);
  await page.locator('input[name="hasStrategicPlan"][value="نعم"]').click();
  await page.waitForTimeout(300);
}

// ═══════════════════════════════════════════════════════════════
// STEP NAVIGATION TESTS
// ═══════════════════════════════════════════════════════════════

test.describe("Step Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/submit");
    await page.waitForSelector("form");
  });

  test("displays step 1 by default", async ({ page }) => {
    await expect(page.getByText("أولاً: البيانات التعريفية")).toBeVisible();
    await expect(page.getByText("1. اسم الجمعية")).toBeVisible();
  });

  test("navigates to step 2 on next click", async ({ page }) => {
    await fillStep1(page);
    await page.getByRole("button", { name: "التالي" }).click();
    await expect(
      page.getByText("ثانياً: القدرات المؤسسية والحوكمة"),
    ).toBeVisible();
  });

  test("navigates back to step 1 on prev click", async ({ page }) => {
    await fillStep1(page);
    await page.getByRole("button", { name: "التالي" }).click();
    await page.getByRole("button", { name: "السابق" }).click();
    await expect(page.getByText("أولاً: البيانات التعريفية")).toBeVisible();
  });

  test("preserves step 1 data after navigating back", async ({ page }) => {
    await fillStep1(page);
    await page.getByRole("button", { name: "التالي" }).click();
    await page.getByRole("button", { name: "السابق" }).click();

    const name = await page
      .locator('input[name="associationName"]')
      .inputValue();
    expect(name).toBe("جمعية الاختبار");
  });

  test("prev button is disabled on step 1", async ({ page }) => {
    const prevBtn = page.getByRole("button", { name: "السابق" });
    await expect(prevBtn).toBeDisabled();
  });

  test("does not have a step 6 attachments section", async ({ page }) => {
    await expect(page.getByText("سادساً")).toHaveCount(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════

test.describe("Zod Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/submit");
    await page.waitForSelector("form");
  });

  test("shows validation errors when submitting step 1 empty", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "التالي" }).click();
    await expect(page.getByText("يرجى إدخال اسم الجمعية")).toBeVisible();
    await expect(page.getByText("يرجى إدخال رقم ترخيص الجمعية")).toBeVisible();
  });

  test("blocks step advancement with non-numeric license number", async ({
    page,
  }) => {
    // Fill all step 1 fields but put invalid data in license
    await page.locator('input[name="associationName"]').fill("جمعية");
    await page.locator('input[name="licenseNumber"]').fill("abc");
    await page.locator('input[name="foundingDate"]').fill("2020-01-01");
    await page.locator('input[name="supervisoryAuthority"]').fill("وزارة");
    await page.locator('input[name="geographicLocation"]').fill("الرياض");
    await page.locator('input[name="serviceScope"]').fill("محلي");
    await page.locator('input[name="headquartersAddress"]').fill("العليا");
    await page.locator('textarea[name="socialMediaLinks"]').fill("x.com");
    await page.getByRole("button", { name: "التالي" }).click();
    await page.waitForTimeout(1000);
    // Should remain on step 1 (not advance to step 2)
    await expect(page.getByText("أولاً: البيانات التعريفية")).toBeVisible();
    await expect(
      page.getByText("ثانياً: القدرات المؤسسية والحوكمة"),
    ).toHaveCount(0);
  });

  test("accepts Arabic numerals in license number", async ({ page }) => {
    await page.locator('input[name="associationName"]').fill("جمعية الاختبار");
    await page.locator('input[name="licenseNumber"]').fill("١٢٣٤٥");
    await page.locator('input[name="foundingDate"]').fill("2020-01-01");
    await page.locator('input[name="supervisoryAuthority"]').fill("وزارة");
    await page.locator('input[name="geographicLocation"]').fill("الرياض");
    await page.locator('input[name="serviceScope"]').fill("محلي");
    await page.locator('input[name="headquartersAddress"]').fill("العليا");
    await page
      .locator('textarea[name="socialMediaLinks"]')
      .fill("https://x.com");
    await page.getByRole("button", { name: "التالي" }).click();
    await expect(
      page.getByText("ثانياً: القدرات المؤسسية والحوكمة"),
    ).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════
// FORM LABELS TESTS
// ═══════════════════════════════════════════════════════════════

test.describe("Form Labels", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/submit");
    await page.waitForSelector("form");
  });

  test("step 1 has all 8 question labels", async ({ page }) => {
    const labels = [
      "1. اسم الجمعية",
      "2. رقم ترخيص الجمعية",
      "3. تاريخ التأسيس",
      "4. جهة الاشراف الفني",
      "5. الموقع الجغرافي للجمعية",
      "6. النطاق الجغرافي لخدمات الجمعية",
      "7. عنوان المقر الرئيس للجمعية",
      "8. الموقع الإلكتروني للجمعية",
    ];
    for (const label of labels) {
      await expect(page.getByText(label, { exact: false })).toBeVisible();
    }
  });

  test("step 2 has strategic plan and operational plan questions", async ({
    page,
  }) => {
    await fillStep1(page);
    await page.getByRole("button", { name: "التالي" }).click();
    await expect(
      page.getByText("15. هل تمتلك الجمعية خطة استراتيجية معتمدة"),
    ).toBeVisible();
    await expect(
      page.getByText("17. هل تمتلك الجمعية خطة تشغيلية"),
    ).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════
// CONDITIONAL FILE UPLOAD TESTS
// ═══════════════════════════════════════════════════════════════

test.describe("Conditional File Uploads", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/submit");
    await page.waitForSelector("form");
    await fillStep1(page);
    await page.getByRole("button", { name: "التالي" }).click();
    await page.waitForTimeout(500);
  });

  test("no file upload zones visible initially on step 2", async ({ page }) => {
    await expect(page.getByText("اضغط لرفع الملفات")).toHaveCount(0);
  });

  test("shows upload zone when strategic plan = نعم", async ({ page }) => {
    await page.locator('input[name="hasStrategicPlan"][value="نعم"]').click();
    await expect(page.getByText("اضغط لرفع الملفات").first()).toBeVisible();
  });

  test("hides upload zone when strategic plan switched to لا", async ({
    page,
  }) => {
    await page.locator('input[name="hasStrategicPlan"][value="نعم"]').click();
    await expect(page.getByText("اضغط لرفع الملفات").first()).toBeVisible();

    await page.locator('input[name="hasStrategicPlan"][value="لا"]').click();
    await expect(page.getByText("اضغط لرفع الملفات")).toHaveCount(0);
  });

  test("shows upload zone when operational plan = نعم", async ({ page }) => {
    await page.locator('input[name="hasOperationalPlan"][value="نعم"]').click();
    await expect(page.getByText("اضغط لرفع الملفات").first()).toBeVisible();
  });

  test("shows upload zone when performance reports = نعم", async ({ page }) => {
    await page
      .locator('input[name="hasPerformanceReports"][value="نعم"]')
      .click();
    await expect(page.getByText("اضغط لرفع الملفات").first()).toBeVisible();
  });

  test("shows 3 upload zones when all 3 are نعم", async ({ page }) => {
    await page.locator('input[name="hasStrategicPlan"][value="نعم"]').click();
    await page.locator('input[name="hasOperationalPlan"][value="نعم"]').click();
    await page
      .locator('input[name="hasPerformanceReports"][value="نعم"]')
      .click();
    await expect(page.getByText("اضغط لرفع الملفات")).toHaveCount(3);
  });
});

// ═══════════════════════════════════════════════════════════════
// FILE UPLOAD TESTS — ALL FILE TYPES
// ═══════════════════════════════════════════════════════════════

test.describe("File Upload — All File Types", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/submit");
    await page.waitForSelector("form");
    await enableStrategicPlanUpload(page);
  });

  test("uploads a PDF file and shows filename", async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(TEST_FILES_DIR, "test.pdf"));
    await expect(page.getByText("test.pdf")).toBeVisible();
  });

  test("uploads a Word document (.docx) and shows filename", async ({
    page,
  }) => {
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(TEST_FILES_DIR, "test.docx"));
    await expect(page.getByText("test.docx")).toBeVisible();
  });

  test("uploads an Excel file (.xlsx) and shows filename", async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(TEST_FILES_DIR, "test.xlsx"));
    await expect(page.getByText("test.xlsx")).toBeVisible();
  });

  test("uploads a PNG image and shows filename", async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(TEST_FILES_DIR, "test.png"));
    await expect(page.getByText("test.png")).toBeVisible();
  });

  test("uploads a JPG image and shows filename", async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(TEST_FILES_DIR, "test.jpg"));
    await expect(page.getByText("test.jpg")).toBeVisible();
  });

  test("uploads a plain text file and shows filename", async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(TEST_FILES_DIR, "test.txt"));
    await expect(page.getByText("test.txt")).toBeVisible();
  });

  test("uploads multiple files at once", async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles([
      path.join(TEST_FILES_DIR, "test.pdf"),
      path.join(TEST_FILES_DIR, "test.png"),
      path.join(TEST_FILES_DIR, "test.docx"),
    ]);
    await expect(page.getByText("test.pdf")).toBeVisible();
    await expect(page.getByText("test.png")).toBeVisible();
    await expect(page.getByText("test.docx")).toBeVisible();
  });

  test("shows file size in MB", async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(TEST_FILES_DIR, "test.pdf"));
    await expect(page.locator("text=/\\d+\\.\\d+ MB/")).toBeVisible();
  });

  test("removes a file when X button is clicked", async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(TEST_FILES_DIR, "test.pdf"));
    await expect(page.getByText("test.pdf")).toBeVisible();

    // Click the remove button inside the file item
    const fileItem = page.locator("text=test.pdf").locator("../..");
    await fileItem.locator("button").click();
    await page.waitForTimeout(500);

    // File should be removed
    await expect(page.getByText("test.pdf")).toHaveCount(0);
  });

  test("uploads files to different categories independently", async ({
    page,
  }) => {
    // Enable operational plan upload too
    await page.locator('input[name="hasOperationalPlan"][value="نعم"]').click();
    await page.waitForTimeout(300);

    // Upload to strategic plan (first file input)
    const fileInputs = page.locator('input[type="file"]');
    await fileInputs
      .nth(0)
      .setInputFiles(path.join(TEST_FILES_DIR, "test.pdf"));

    // Upload to operational plan (second file input)
    await fileInputs
      .nth(1)
      .setInputFiles(path.join(TEST_FILES_DIR, "test.docx"));

    await expect(page.getByText("test.pdf")).toBeVisible();
    await expect(page.getByText("test.docx")).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════
// SUBMIT BUTTON TESTS
// ═══════════════════════════════════════════════════════════════

test.describe("Submit Button", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/submit");
    await page.waitForSelector("form");
  });

  test("shows التالي on step 1, not إرسال", async ({ page }) => {
    await expect(page.getByRole("button", { name: "التالي" })).toBeVisible();
    await expect(page.getByRole("button", { name: "إرسال الطلب" })).toHaveCount(
      0,
    );
  });

  test("shows التالي on step 2", async ({ page }) => {
    await fillStep1(page);
    await page.getByRole("button", { name: "التالي" }).click();
    await expect(page.getByRole("button", { name: "التالي" })).toBeVisible();
  });
});
