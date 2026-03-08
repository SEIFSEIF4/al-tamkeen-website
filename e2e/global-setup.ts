import fs from "fs";
import path from "path";

/**
 * Playwright global setup — creates test fixture files.
 * These files persist across all test runs.
 */
export default function globalSetup() {
  const dir = path.join(__dirname, "test-files");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Only create files if they don't already exist
  const files: Record<string, string | Buffer> = {
    "test.pdf": "%PDF-1.4 test content for upload",
    "test.docx": "PK\x03\x04 mock docx content",
    "test.xlsx": "PK\x03\x04 mock xlsx spreadsheet",
    "test.txt": "plain text content for testing upload",
    "test.png": Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde,
    ]),
    "test.jpg": Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00,
    ]),
  };

  for (const [name, content] of Object.entries(files)) {
    const filePath = path.join(dir, name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
    }
  }
}
