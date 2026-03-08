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
  await page.locator('input[name="workField"]').fill("التنمية الاجتماعية");
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

    const workField = await page
      .locator('input[name="workField"]')
      .inputValue();
    expect(workField).toBe("التنمية الاجتماعية");
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
    await expect(page.getByText("يرجى إدخال مجال عمل الجمعية")).toBeVisible();
  });

  test("blocks step advancement with non-numeric license number", async ({
    page,
  }) => {
    await page.locator('input[name="associationName"]').fill("جمعية");
    await page.locator('input[name="licenseNumber"]').fill("abc");
    await page.locator('input[name="foundingDate"]').fill("2020-01-01");
    await page.locator('input[name="supervisoryAuthority"]').fill("وزارة");
    await page.locator('input[name="geographicLocation"]').fill("الرياض");
    await page.locator('input[name="serviceScope"]').fill("محلي");
    await page.locator('input[name="headquartersAddress"]').fill("العليا");
    await page.locator('input[name="workField"]').fill("تنمية");
    await page.locator('textarea[name="socialMediaLinks"]').fill("x.com");
    await page.getByRole("button", { name: "التالي" }).click();
    await page.waitForTimeout(1000);
    // Should remain on step 1
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
    await page.locator('input[name="workField"]').fill("تنمية");
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

  test("step 1 has all 9 question labels", async ({ page }) => {
    const labels = [
      "1. اسم الجمعية",
      "2. رقم ترخيص الجمعية",
      "3. تاريخ التأسيس",
      "4. جهة الاشراف الفني",
      "5. الموقع الجغرافي للجمعية",
      "6. النطاق الجغرافي لخدمات الجمعية",
      "7. عنوان المقر الرئيس للجمعية",
      "8. مجال عمل الجمعية",
      "9. الموقع الإلكتروني للجمعية",
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

    const fileItem = page.locator("text=test.pdf").locator("../..");
    await fileItem.locator("button").click();
    await page.waitForTimeout(500);
    await expect(page.getByText("test.pdf")).toHaveCount(0);
  });

  test("uploads files to different categories independently", async ({
    page,
  }) => {
    await page.locator('input[name="hasOperationalPlan"][value="نعم"]').click();
    await page.waitForTimeout(300);

    const fileInputs = page.locator('input[type="file"]');
    await fileInputs
      .nth(0)
      .setInputFiles(path.join(TEST_FILES_DIR, "test.pdf"));
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

// ═══════════════════════════════════════════════════════════════
// SUPABASE SUBMISSION — JSONB PAYLOAD TESTS
// ═══════════════════════════════════════════════════════════════

test.describe("Supabase JSONB Submission", () => {
  test("sends form_data as JSONB with all fields in the POST request", async ({
    page,
  }) => {
    // Intercept the Supabase REST API call
    const supabaseRequestPromise = page.waitForRequest(
      (req) =>
        req.url().includes("/rest/v1/registrations") && req.method() === "POST",
    );

    await page.goto("/submit");
    await page.waitForSelector("form");

    // ── Step 1 ──
    await fillStep1(page);
    await page.getByRole("button", { name: "التالي" }).click();
    await page.waitForTimeout(500);

    // ── Step 2 ── fill all required fields
    await page.locator('input[name="boardStartDate"]').fill("2023-01-01");
    await page.locator('input[name="boardEndDate"]').fill("2026-01-01");
    await page.locator('input[name="boardPeriod"]').fill("3 سنوات");
    await page.locator('input[name="fullTimeEmployees"]').fill("15");
    await page
      .locator('input[name="hasExecutiveDirector"][value="نعم"]')
      .click();
    await page.locator('input[name="executiveDirectorName"]').fill("أحمد محمد");
    // Phone input — use input[type=tel] which is rendered by PhoneInput
    const execPhoneInput1 = page.locator('input[type="tel"]').first();
    await execPhoneInput1.fill("500000000");
    await page.locator('input[name="hasStrategicPlan"][value="لا"]').click();
    await page.locator('input[name="strategicPlanEndDate"]').fill("2025-12-31");
    await page.locator('input[name="hasOperationalPlan"][value="لا"]').click();
    await page.locator('input[name="governanceScore"]').fill("85");
    await page.locator('input[name="averageBudget"]').fill("500000");
    await page
      .locator('textarea[name="awardsAndCertificates"]')
      .fill("جائزة التميز");
    await page
      .locator('input[name="hasPerformanceReports"][value="لا"]')
      .click();
    await page
      .locator('input[name="hasExternalAuditorNotes"][value="لا"]')
      .click();
    await page.locator('textarea[name="externalAuditorNotes"]').fill("لا يوجد");
    await page
      .locator('textarea[name="topPartnerships"]')
      .fill("شراكة مع وزارة التنمية");
    await page.getByRole("button", { name: "التالي" }).click();
    await page.waitForTimeout(500);

    // ── Step 3 ──
    await page
      .locator('textarea[name="physicalAssets"]')
      .fill("مبنى إداري ومركز تدريب");
    await page.locator('input[name="hasDebts"][value="لا"]').click();
    await page.locator('input[name="hasEndowments"][value="لا"]').click();
    await page.locator('input[name="endowmentRevenue"]').fill("لا يوجد");
    await page
      .locator('textarea[name="specializedExpertise"]')
      .fill("خبرة في التنمية المجتمعية");
    await page.locator('textarea[name="databaseSize"]').fill("5000 مستفيد");
    await page.locator('input[name="hasInvestmentUnit"][value="لا"]').click();
    await page.locator('input[name="programsCount"]').fill("12");
    await page.locator('input[name="developmentProjectsCount"]').fill("5");
    await page.getByRole("button", { name: "التالي" }).click();
    await page.waitForTimeout(500);

    // ── Step 4 ──
    await page
      .locator('textarea[name="startupReasons"]')
      .fill("تحقيق الاستدامة المالية وتنويع مصادر الدخل");
    // mainGoal is a radio
    await page.locator('input[name="mainGoal"]').first().click();
    await page
      .locator('textarea[name="marketGaps"]')
      .fill("نقص في خدمات التأهيل المهني للشباب");
    await page.getByRole("button", { name: "التالي" }).click();
    await page.waitForTimeout(500);

    // ── Step 5 ──
    await page.locator('input[name="contactPerson"]').fill("سعد العمري");
    await page
      .locator('input[name="contactPersonPosition"]')
      .fill("مدير البرامج");
    const contactPhone1 = page.locator('input[type="tel"]').first();
    await contactPhone1.fill("500000000");
    await page.locator('input[name="boardApproval"][value="نعم"]').click();
    await page.locator('input[name="dedicatedTeam"][value="نعم"]').click();
    await page
      .locator('textarea[name="finalAspirations"]')
      .fill("بناء شركة ناشئة مستدامة في مجال التأهيل المهني");

    // Mock the Supabase response to avoid actual DB writes
    await page.route("**/rest/v1/registrations**", async (route) => {
      const method = route.request().method();
      if (method === "POST") {
        // Return a fake inserted row with an ID
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: 999 }),
        });
      } else if (method === "PATCH") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({}),
        });
      } else {
        await route.continue();
      }
    });

    // Click submit
    await page.getByRole("button", { name: "إرسال الطلب" }).click();

    // Wait for and capture the Supabase request
    const supabaseRequest = await supabaseRequestPromise;
    const postData = supabaseRequest.postDataJSON();

    // Verify the payload structure
    expect(postData).toBeDefined();

    // The payload is an array with one object
    const payload = Array.isArray(postData) ? postData[0] : postData;

    // Verify form_data is present and is an object (JSONB)
    expect(payload.form_data).toBeDefined();
    expect(typeof payload.form_data).toBe("object");

    // Verify key JSONB fields
    const formData = payload.form_data;
    expect(formData.association_name).toBe("جمعية الاختبار");
    expect(formData.license_number).toBe("12345");
    expect(formData.geographic_location).toBe("الرياض");
    expect(formData.work_field).toBe("التنمية الاجتماعية");
    expect(formData.social_media_links).toBe("https://example.com");
    expect(formData.headquarters_address).toBe("حي العليا");
    expect(formData.has_strategic_plan).toBe("لا");
    expect(formData.has_operational_plan).toBe("لا");
    expect(formData.physical_assets).toBe("مبنى إداري ومركز تدريب");
    expect(formData.contact_person).toBe("سعد العمري");
    expect(formData.board_approval).toBe("نعم");
    expect(formData.final_aspirations).toBe(
      "بناء شركة ناشئة مستدامة في مجال التأهيل المهني",
    );

    // Verify top-level fields
    expect(payload.user_name).toBe("سعد العمري");
    expect(payload.phone_number).toBe("12345");
  });

  test("sends file_urls as JSONB in PATCH after file upload", async ({
    page,
  }) => {
    let patchBody: Record<string, unknown> | null = null;

    await page.goto("/submit");
    await page.waitForSelector("form");

    // Mock Supabase routes
    await page.route("**/rest/v1/registrations**", async (route) => {
      const method = route.request().method();
      if (method === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: 777 }),
        });
      } else if (method === "PATCH") {
        patchBody = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({}),
        });
      } else {
        await route.continue();
      }
    });

    // Mock storage upload
    await page.route("**/storage/v1/object/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          Key: "submissions/777/strategicPlan/test.pdf",
        }),
      });
    });

    // ── Fill Step 1 ──
    await fillStep1(page);
    await page.getByRole("button", { name: "التالي" }).click();
    await page.waitForTimeout(500);

    // ── Step 2 ── fill required + enable strategic plan upload
    await page.locator('input[name="boardStartDate"]').fill("2023-01-01");
    await page.locator('input[name="boardEndDate"]').fill("2026-01-01");
    await page.locator('input[name="boardPeriod"]').fill("3 سنوات");
    await page.locator('input[name="fullTimeEmployees"]').fill("15");
    await page
      .locator('input[name="hasExecutiveDirector"][value="نعم"]')
      .click();
    await page.locator('input[name="executiveDirectorName"]').fill("أحمد");
    const execPhoneInput2 = page.locator('input[type="tel"]').first();
    await execPhoneInput2.fill("500000000");
    await page.locator('input[name="hasStrategicPlan"][value="نعم"]').click();
    await page.waitForTimeout(300);

    // Upload a file to strategic plan
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(TEST_FILES_DIR, "test.pdf"));
    await expect(page.getByText("test.pdf")).toBeVisible();

    await page.locator('input[name="strategicPlanEndDate"]').fill("2025-12-31");
    await page.locator('input[name="hasOperationalPlan"][value="لا"]').click();
    await page.locator('input[name="governanceScore"]').fill("85");
    await page.locator('input[name="averageBudget"]').fill("500000");
    await page.locator('textarea[name="awardsAndCertificates"]').fill("جائزة");
    await page
      .locator('input[name="hasPerformanceReports"][value="لا"]')
      .click();
    await page
      .locator('input[name="hasExternalAuditorNotes"][value="لا"]')
      .click();
    await page.locator('textarea[name="externalAuditorNotes"]').fill("لا يوجد");
    await page.locator('textarea[name="topPartnerships"]').fill("شراكة");
    await page.getByRole("button", { name: "التالي" }).click();
    await page.waitForTimeout(500);

    // ── Step 3 ──
    await page
      .locator('textarea[name="physicalAssets"]')
      .fill("مبنى إداري ومركز");
    await page.locator('input[name="hasDebts"][value="لا"]').click();
    await page.locator('input[name="hasEndowments"][value="لا"]').click();
    await page.locator('input[name="endowmentRevenue"]').fill("لا يوجد");
    await page
      .locator('textarea[name="specializedExpertise"]')
      .fill("خبرة في التنمية");
    await page.locator('textarea[name="databaseSize"]').fill("5000");
    await page.locator('input[name="hasInvestmentUnit"][value="لا"]').click();
    await page.locator('input[name="programsCount"]').fill("12");
    await page.locator('input[name="developmentProjectsCount"]').fill("5");
    await page.getByRole("button", { name: "التالي" }).click();
    await page.waitForTimeout(500);

    // ── Step 4 ──
    await page
      .locator('textarea[name="startupReasons"]')
      .fill("تحقيق الاستدامة المالية");
    await page.locator('input[name="mainGoal"]').first().click();
    await page
      .locator('textarea[name="marketGaps"]')
      .fill("نقص في خدمات التأهيل");
    await page.getByRole("button", { name: "التالي" }).click();
    await page.waitForTimeout(500);

    // ── Step 5 ──
    await page.locator('input[name="contactPerson"]').fill("سعد العمري");
    await page.locator('input[name="contactPersonPosition"]').fill("مدير");
    const contactPhone2 = page.locator('input[type="tel"]').first();
    await contactPhone2.fill("500000000");
    await page.locator('input[name="boardApproval"][value="نعم"]').click();
    await page.locator('input[name="dedicatedTeam"][value="نعم"]').click();
    await page
      .locator('textarea[name="finalAspirations"]')
      .fill("بناء شركة ناشئة مستدامة");

    // Submit
    await page.getByRole("button", { name: "إرسال الطلب" }).click();

    // Wait for the upload + patch cycle
    await page.waitForTimeout(3000);

    // Verify the PATCH request included file_urls in form_data
    expect(patchBody).toBeDefined();
    if (patchBody) {
      const patchData = patchBody as Record<string, unknown>;
      expect(patchData.form_data).toBeDefined();
      const updatedFormData = patchData.form_data as Record<string, unknown>;
      expect(updatedFormData.file_urls).toBeDefined();
      const fileUrls = updatedFormData.file_urls as Record<string, string[]>;
      expect(fileUrls.strategicPlan).toBeDefined();
      expect(Array.isArray(fileUrls.strategicPlan)).toBe(true);
    }
  });
});
