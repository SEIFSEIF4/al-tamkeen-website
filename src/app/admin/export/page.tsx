"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Loader2, Download } from "lucide-react";
import * as XLSX from "xlsx";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  VerticalAlign,
  WidthType,
  BorderStyle,
  ExternalHyperlink,
} from "docx";
import { saveAs } from "file-saver";

// Define the shape of our data
interface Registration {
  id: string;
  created_at: string;
  user_name: string;
  phone_number: string;
  form_data: {
    association_name?: string;
    license_number?: string;
    founding_date?: string;
    supervisory_authority?: string;
    geographic_location?: string;
    service_scope?: string;
    headquarters_address?: string;
    work_field?: string;
    social_media_links?: string;
    board_start_date?: string;
    board_end_date?: string;
    board_period?: string;
    full_time_employees?: string;
    has_executive_director?: string;
    executive_director_name?: string;
    executive_director_phone?: string;
    has_strategic_plan?: string;
    strategic_plan_end_date?: string;
    has_operational_plan?: string;
    governance_score?: string;
    average_budget?: string;
    awards_and_certificates?: string;
    has_performance_reports?: string;
    has_external_auditor_notes?: string;
    external_auditor_notes?: string;
    top_partnerships?: string;
    physical_assets?: string;
    has_debts?: string;
    has_endowments?: string;
    endowment_revenue?: string;
    specialized_expertise?: string;
    database_size?: string;
    has_investment_unit?: string;
    programs_count?: string;
    development_projects_count?: string;
    startup_reasons?: string;
    main_goal?: string;
    market_gaps?: string;
    contact_person?: string;
    contact_person_position?: string;
    contact_person_phone?: string;
    board_approval?: string;
    dedicated_team?: string;
    final_aspirations?: string;
    file_urls?: Record<string, string[]>;
    [key: string]: any;
  };
}

// Arabic mapping for Excel headers
const fieldLabels: Record<string, string> = {
  id: "معرف الطلب",
  created_at: "تاريخ الإنشاء",
  user_name: "اسم المستخدم",
  phone_number: "رقم الهاتف",
  association_name: "اسم الجمعية",
  license_number: "رقم الترخيص",
  founding_date: "تاريخ التأسيس",
  supervisory_authority: "جهة الاشراف الفني",
  geographic_location: "الموقع الجغرافي",
  service_scope: "نطاق الخدمة",
  headquarters_address: "عنوان المقر",
  work_field: "مجال عمل الجمعية",
  social_media_links: "الموقع والتواصل",
  board_start_date: "تاريخ بداية المجلس",
  board_end_date: "تاريخ نهاية المجلس",
  board_period: "فترة المجلس",
  full_time_employees: "عدد الموظفين",
  has_executive_director: "مدير تنفيذي",
  executive_director_name: "اسم المدير التنفيذي",
  executive_director_phone: "جوال المدير التنفيذي",
  has_strategic_plan: "خطة استراتيجية",
  strategic_plan_end_date: "تاريخ انتهاء الخطة",
  has_operational_plan: "خطة تشغيلية",
  governance_score: "درجة الحوكمة",
  average_budget: "متوسط الميزانية",
  awards_and_certificates: "الجوائز والشهادات",
  has_performance_reports: "تقارير الأداء",
  has_external_auditor_notes: "ملاحظات المراجع الخارجي",
  external_auditor_notes: "تفاصيل الملاحظات",
  top_partnerships: "الشراكات الاستراتيجية",
  physical_assets: "الأصول المادية",
  has_debts: "ديون على الجمعية",
  has_endowments: "أصول أو أوقاف",
  endowment_revenue: "إيرادات الأوقاف",
  specialized_expertise: "الخبرات التخصصية",
  database_size: "حجم قاعدة البيانات",
  has_investment_unit: "وحدة استثمار",
  programs_count: "عدد البرامج والمشاريع",
  development_projects_count: "عدد المشاريع التنموية",
  startup_reasons: "أسباب التأسيس",
  main_goal: "الهدف الرئيسي",
  market_gaps: "فجوات السوق",
  contact_person: "ضابط الاتصال",
  contact_person_position: "المنصب",
  contact_person_phone: "جوال ضابط الاتصال",
  board_approval: "موافقة المجلس",
  dedicated_team: "فريق مفرغ",
  final_aspirations: "التطلعات",
  file_urls: "روابط الملفات",
};

const fileCategoryLabels: Record<string, string> = {
  strategicPlan: "الخطة الاستراتيجية",
  operationalPlan: "الخطة التشغيلية",
  performanceReports: "تقارير الأداء",
};

import JSZip from "jszip";
import { AdminGuard } from "@/components/admin/admin-guard";

export default function ExportPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<"excel" | "word" | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    setExporting("excel");
    try {
      const flatData = registrations.map((reg) => {
        const row: Record<string, any> = {
          [fieldLabels.id]: reg.id,
          [fieldLabels.created_at]: new Date(reg.created_at).toLocaleDateString(
            "ar-SA",
          ),
          [fieldLabels.user_name]: reg.user_name,
          [fieldLabels.phone_number]: reg.phone_number,
        };

        Object.entries(reg.form_data).forEach(([key, value]) => {
          const label = fieldLabels[key] || key;
          if (
            key === "file_urls" &&
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            // Categorized file URLs
            Object.entries(value as Record<string, string[]>).forEach(
              ([cat, urls]) => {
                const catLabel = fileCategoryLabels[cat] || cat;
                if (Array.isArray(urls)) {
                  row[`مرفقات - ${catLabel}`] = urls.join(", ");
                }
              },
            );
          } else if (key === "file_urls" && Array.isArray(value)) {
            row[label] = value.join(", ");
          } else {
            row[label] = value;
          }
        });

        return row;
      });

      const ws = XLSX.utils.json_to_sheet(flatData);
      const colWidths = Object.keys(flatData[0] || {}).map(() => ({ wch: 20 }));
      ws["!cols"] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Submissions");

      XLSX.writeFile(
        wb,
        `al-tamkeen-submissions-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } catch (error) {
      console.error("Export Excel failed:", error);
    } finally {
      setExporting(null);
    }
  };

  const handleExportWordZip = async () => {
    setExporting("word");
    try {
      const zip = new JSZip();

      // Process each registration concurrently
      await Promise.all(
        registrations.map(async (reg, index) => {
          const children = [];

          // Title
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `طلب رقم: ${index + 1} - ${reg.form_data.association_name || reg.user_name}`,
                  rightToLeft: true,
                }),
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              bidirectional: true,
            }),
          );

          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `تاريخ التقديم: ${new Date(reg.created_at).toLocaleDateString("ar-SA")}`,
                  rightToLeft: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
              bidirectional: true,
              spacing: { after: 400 },
            }),
          );

          // Define Sections
          const createSection = (
            title: string,
            items: { label: string; key: string; isMain?: boolean }[],
            startIndex: number,
          ) => {
            // Section Header
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    color: "000000",
                    size: 32, // 16pt
                    rightToLeft: true,
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.RIGHT,
                bidirectional: true,
                spacing: { before: 400, after: 200 },
              }),
            );

            items.forEach((item, idx) => {
              const questionNum = startIndex + idx;
              let answer = "";

              if (item.isMain) {
                const mainVal = reg[item.key as keyof Registration];
                answer = mainVal ? String(mainVal) : "";
              } else {
                const rawValue = reg.form_data[item.key];
                if (rawValue === null || rawValue === undefined) {
                  answer = "";
                } else if (Array.isArray(rawValue)) {
                  // Safe handling for arrays
                  answer = rawValue.map((val) => String(val)).join(", ");
                } else if (typeof rawValue === "object") {
                  // Fallback for objects
                  try {
                    answer = JSON.stringify(rawValue);
                  } catch {
                    answer = String(rawValue);
                  }
                } else {
                  answer = String(rawValue);
                }
              }

              if (!answer || answer.trim() === "") {
                answer = "لا توجد اجابه";
              }

              // Question
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${questionNum}. ${item.label}`,
                      bold: true,
                      size: 24, // 12pt
                      color: "000000",
                      rightToLeft: true,
                    }),
                  ],
                  alignment: AlignmentType.RIGHT,
                  bidirectional: true,
                  spacing: { before: 100 },
                }),
              );

              // Answer
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: answer,
                      color: "1E3A5F", // Dark Blue/Comfortable
                      size: 24, // 12pt
                      rightToLeft: true,
                    }),
                  ],
                  alignment: AlignmentType.RIGHT,
                  bidirectional: true,
                  spacing: { after: 200 },
                  indent: { right: 300 }, // Indent for visual hierarchy
                }),
              );
            });
          };

          // 1. First Section
          createSection(
            "أولاً: البيانات التعريفية",
            [
              { label: "اسم الجمعية", key: "association_name" },
              { label: "رقم ترخيص الجمعية", key: "license_number" },
              { label: "تاريخ التأسيس", key: "founding_date" },
              { label: "جهة الاشراف الفني", key: "supervisory_authority" },
              {
                label: "الموقع الجغرافي للجمعية (المنطقة والمدينة)",
                key: "geographic_location",
              },
              { label: "النطاق الجغرافي لخدمات الجمعية", key: "service_scope" },
              {
                label: "عنوان المقر الرئيس للجمعية",
                key: "headquarters_address",
              },
              { label: "مجال عمل الجمعية", key: "work_field" },
              {
                label: "الموقع الإلكتروني للجمعية وحسابات التواصل الاجتماعي",
                key: "social_media_links",
              },
            ],
            1,
          );

          // 2. Second Section
          createSection(
            "ثانياً: القدرات المؤسسية والحوكمة",
            [
              { label: "تاريخ بداية مجلس الإدارة", key: "board_start_date" },
              { label: "تاريخ نهاية مجلس الإدارة", key: "board_end_date" },
              { label: "فترة مجلس الإدارة", key: "board_period" },
              {
                label: "عدد الموظفين المتفرغين في الجمعية",
                key: "full_time_employees",
              },
              {
                label: "هل يوجد مدير تنفيذي متفرغ للجمعية؟",
                key: "has_executive_director",
              },
              { label: "اسم المدير التنفيذي", key: "executive_director_name" },
              { label: "رقم الجوال", key: "executive_director_phone" },
              {
                label: "هل تمتلك الجمعية خطة استراتيجية معتمدة؟",
                key: "has_strategic_plan",
              },
              {
                label: "تاريخ انتهاء الخطة الاستراتيجية الحالية",
                key: "strategic_plan_end_date",
              },
              {
                label: "هل تمتلك الجمعية خطة تشغيلية؟",
                key: "has_operational_plan",
              },
              {
                label: "درجة الجمعية في آخر تقييم للحوكمة",
                key: "governance_score",
              },
              {
                label: "متوسط الميزانية السنوية للجمعية في آخر ثلاث سنوات",
                key: "average_budget",
              },
              {
                label: "أهم الجوائز والشهادات التي حصلت عليها الجمعية",
                key: "awards_and_certificates",
              },
              {
                label: "هل تتوفر تقارير الأداء السنوية والمالية لآخر عامين؟",
                key: "has_performance_reports",
              },
              {
                label: "هل توجد أي ملاحظات على الجمعية من المراجع الخارجي؟",
                key: "has_external_auditor_notes",
              },
              { label: "تفاصيل الملاحظات", key: "external_auditor_notes" },
              {
                label:
                  "أهم ثلاث شراكات استراتيجية للجمعية مع القطاع الخاص أو القطاع الحكومي",
                key: "top_partnerships",
              },
            ],
            8,
          );

          // 3. Third Section
          createSection(
            "ثالثاً: الموارد والأصول المتاحة والمشاريع",
            [
              {
                label:
                  "ما هي الأصول المادية التي تمتلكها الجمعية وتسمح بالاستفادة منها في مشاريع استثمارية؟",
                key: "physical_assets",
              },
              { label: "هل يوجد ديون على الجمعية؟", key: "has_debts" },
              { label: "هل لدى الجمعية أصول أو اوقاف؟", key: "has_endowments" },
              {
                label: "كم تبلغ الإيرادات من الأصول / الأوقاف؟",
                key: "endowment_revenue",
              },
              {
                label:
                  "ما هي الخبرات التخصصية أو المعرفة الفنية التي تنفرد بها الجمعية؟",
                key: "specialized_expertise",
              },
              {
                label: "حجم قاعدة البيانات وتصنيف الفئات المستفيدة",
                key: "database_size",
              },
              {
                label:
                  "هل تمتلك الجمعية وحدة استثمار أو إدارة تنمية موارد مالية مستقلة؟",
                key: "has_investment_unit",
              },
              {
                label: "كم عدد برامج ومشاريع الجمعية لعام 2024م - 2025م",
                key: "programs_count",
              },
              {
                label: "كم عدد المشاريع التنموية منها؟",
                key: "development_projects_count",
              },
            ],
            16,
          );

          // 4. Fourth Section
          createSection(
            "رابعاً: الجاهزية والتوجه الريادي",
            [
              {
                label:
                  "ما هي الأسباب التي تدفع الجمعية للرغبة في تأسيس شركة ناشئة؟",
                key: "startup_reasons",
              },
              {
                label: "ما هو الهدف الرئيسي للجمعية من إنشاء هذه الشركة؟",
                key: "main_goal",
              },
              {
                label:
                  "ما هي الفجوات التي تراها الجمعية في سوق العمل وترتبط بمجال تخصصها؟",
                key: "market_gaps",
              },
            ],
            25,
          );

          // 5. Fifth Section
          createSection(
            "خامساً: الالتزام والقرار الإداري",
            [
              {
                label: "اسم ضابط الاتصال المسؤول عن المتابعة في المشروع",
                key: "contact_person",
              },
              { label: "المنصب", key: "contact_person_position" },
              { label: "الجوال", key: "contact_person_phone" },
              {
                label:
                  "هل وافق مجلس الإدارة على فكرة تأسيس ذراع استثماري أو شركة مستقلة؟",
                key: "board_approval",
              },
              {
                label:
                  "هل يوجد موظف أو فريق عمل سيتم تفريغه لمتابعة هذا المشروع؟",
                key: "dedicated_team",
              },
              {
                label: "تطلعاتكم النهائية من المشاركة في مشروع التمكين الريادي",
                key: "final_aspirations",
              },
            ],
            28,
          );

          // 6. Sixth Section - Attachments (categorized)
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "سادساً: المرفقات",
                  bold: true,
                  color: "000000",
                  size: 32,
                  rightToLeft: true,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.RIGHT,
              bidirectional: true,
              spacing: { before: 400, after: 200 },
            }),
          );

          const fileUrls = reg.form_data.file_urls;
          const hasFiles =
            fileUrls && typeof fileUrls === "object" && !Array.isArray(fileUrls)
              ? Object.values(fileUrls).some(
                  (urls) => Array.isArray(urls) && urls.length > 0,
                )
              : Array.isArray(fileUrls) && fileUrls.length > 0;

          if (
            hasFiles &&
            typeof fileUrls === "object" &&
            !Array.isArray(fileUrls)
          ) {
            // Categorized file URLs (new format)
            Object.entries(fileUrls as Record<string, string[]>).forEach(
              ([category, urls]) => {
                if (!Array.isArray(urls) || urls.length === 0) return;

                const categoryLabel = fileCategoryLabels[category] || category;

                // Category sub-header
                children.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: categoryLabel,
                        bold: true,
                        size: 26,
                        color: "4B3D90",
                        rightToLeft: true,
                      }),
                    ],
                    alignment: AlignmentType.RIGHT,
                    bidirectional: true,
                    spacing: { before: 200, after: 100 },
                  }),
                );

                urls.forEach((url, i) => {
                  // Extract filename from URL
                  const filename = decodeURIComponent(
                    url.split("/").pop() || `ملف ${i + 1}`,
                  );

                  children.push(
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${i + 1}. `,
                          bold: true,
                          size: 24,
                          color: "000000",
                          rightToLeft: true,
                        }),
                        new ExternalHyperlink({
                          children: [
                            new TextRun({
                              text: filename,
                              style: "Hyperlink",
                              color: "1E3A5F",
                              bold: true,
                              size: 24,
                              rightToLeft: true,
                            }),
                          ],
                          link: url,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                      bidirectional: true,
                      spacing: { after: 100 },
                    }),
                  );
                });
              },
            );
          } else if (Array.isArray(fileUrls) && fileUrls.length > 0) {
            // Legacy flat array format
            (fileUrls as string[]).forEach((url, i) => {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${i + 1}. `,
                      bold: true,
                      size: 24,
                      color: "000000",
                      rightToLeft: true,
                    }),
                    new ExternalHyperlink({
                      children: [
                        new TextRun({
                          text: "عرض الملف",
                          style: "Hyperlink",
                          color: "1E3A5F",
                          bold: true,
                          size: 24,
                          rightToLeft: true,
                        }),
                      ],
                      link: url,
                    }),
                  ],
                  alignment: AlignmentType.RIGHT,
                  bidirectional: true,
                  spacing: { after: 100 },
                }),
              );
            });
          } else {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "لا توجد مرفقات",
                    color: "1E3A5F",
                    size: 24,
                    rightToLeft: true,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
                bidirectional: true,
              }),
            );
          }

          const doc = new Document({
            sections: [{ children: children }],
          });

          const blob = await Packer.toBlob(doc);
          const fileName = `طلب-${index + 1}-${reg.user_name.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, "_")}.docx`;
          zip.file(fileName, blob);
        }),
      );

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(
        content,
        `طلبات-التمكين-${new Date().toISOString().split("T")[0]}.zip`,
      );
    } catch (error) {
      console.error("Export Word ZIP failed:", error);
    } finally {
      setExporting(null);
    }
  };

  return (
    <AdminGuard>
      <div
        className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4"
        dir="rtl"
      >
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-sm p-8">
          <div className="flex  items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#1E3A5F]">
                تصدير البيانات
              </h1>
              <p className="text-gray-500 mt-1">تنزيل جميع في قاعدة البيانات</p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold">
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                `${registrations.length} طلبات`
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleExportExcel}
              disabled={loading || exporting === "excel"}
              className="h-24 cursor-pointer text-lg bg-green-600 hover:bg-green-700 flex flex-col gap-2 items-center justify-center"
            >
              {exporting === "excel" ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-8 h-8" />
              )}
              <span>تصدير Excel (.xlsx)</span>
            </Button>

            <Button
              onClick={handleExportWordZip}
              disabled={loading || exporting === "word"}
              className="h-24 cursor-pointer text-lg bg-blue-600 hover:bg-blue-700 flex flex-col gap-2 items-center justify-center"
            >
              {exporting === "word" ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <FileText className="w-8 h-8" />
              )}
              <span>تصدير Word (ZIP)</span>
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-400 text-center">
              يتم تحديث البيانات تلقائياً من قاعدة البيانات Supabase
            </p>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
