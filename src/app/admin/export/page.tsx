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
    geographic_location?: string;
    service_scope?: string;
    headquarters_address?: string;
    social_media_links?: string;
    full_time_employees?: string;
    has_executive_director?: string;
    has_strategic_plan?: string;
    governance_score?: string;
    average_budget?: string;
    awards_and_certificates?: string;
    has_performance_reports?: string;
    top_partnerships?: string;
    physical_assets?: string;
    specialized_expertise?: string;
    database_size?: string;
    has_investment_unit?: string;
    startup_reasons?: string;
    main_goal?: string;
    market_gaps?: string;
    contact_person?: string;
    board_approval?: string;
    dedicated_team?: string;
    final_aspirations?: string;
    file_urls?: string[];
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
  geographic_location: "الموقع الجغرافي",
  service_scope: "نطاق الخدمة",
  headquarters_address: "عنوان المقر",
  social_media_links: "روابط التواصل",
  full_time_employees: "عدد الموظفين",
  has_executive_director: "مدير تنفيذي",
  has_strategic_plan: "خطة استراتيجية",
  governance_score: "درجة الحوكمة",
  average_budget: "متوسط الميزانية",
  awards_and_certificates: "الجوائز والشهادات",
  has_performance_reports: "تقارير الأداء",
  top_partnerships: "الشراكات الاستراتيجية",
  physical_assets: "الأصول المادية",
  specialized_expertise: "الخبرات التخصصية",
  database_size: "حجم قاعدة البيانات",
  has_investment_unit: "وحدة استثمار",
  startup_reasons: "أسباب التأسيس",
  main_goal: "الهدف الرئيسي",
  market_gaps: "فجوات السوق",
  contact_person: "ضابط الاتصال",
  board_approval: "موافقة المجلس",
  dedicated_team: "فريق مفرغ",
  final_aspirations: "التطلعات",
  file_urls: "روابط الملفات",
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
          if (key === "file_urls" && Array.isArray(value)) {
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
              text: `طلب رقم: ${index + 1} - ${reg.form_data.association_name || reg.user_name}`,
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              bidirectional: true,
            }),
          );

          children.push(
            new Paragraph({
              text: `تاريخ التقديم: ${new Date(reg.created_at).toLocaleDateString("ar-SA")}`,
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
              {
                label: "تاريخ التأسيس (الفعلي أو المتوقع)",
                key: "founding_date",
              },
              { label: "الموقع الجغرافي للجمعية", key: "geographic_location" },
              { label: "النطاق الجغرافي لخدمات الجمعية", key: "service_scope" },
              {
                label: "عنوان المقر الرئيسي للجمعية",
                key: "headquarters_address",
              },
              {
                label: "حسابات التواصل الاجتماعي والموقع الإلكتروني",
                key: "social_media_links",
              },
            ],
            1,
          );

          // 2. Second Section
          createSection(
            "ثانياً: القدرات المؤسسية والحوكمة",
            [
              {
                label: "عدد الموظفين المتفرغين في الجمعية",
                key: "full_time_employees",
              },
              {
                label: "هل يوجد مدير تنفيذي متفرغ للجمعية؟",
                key: "has_executive_director",
              },
              {
                label: "هل تمتلك الجمعية خطة استراتيجية معتمدة؟",
                key: "has_strategic_plan",
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
                label:
                  "اذكر أهم الجوائز والشهادات التي حصلت عليها الجمعية سابقاً إن وجدت",
                key: "awards_and_certificates",
              },
              {
                label: "هل تتوفر تقارير الأداء السنوية والمالية لآخر عامين؟",
                key: "has_performance_reports",
              },
              {
                label:
                  "اذكر أهم ثلاث شراكات استراتيجية للجمعية مع القطاع الخاص أو الجهات الحكومية",
                key: "top_partnerships",
              },
            ],
            8,
          );

          // 3. Third Section
          createSection(
            "ثالثاً: الموارد والأصول المتاحة",
            [
              {
                label:
                  "ما هي الأصول المادية التي تمتلكها الجمعية وتسمح بالاستفادة منها في مشاريع استثمارية؟",
                key: "physical_assets",
              },
              {
                label:
                  "ما هي الخبرات التخصصية أو المعرفة الفنية التي تنفرد بها الجمعية في مجال عملها؟",
                key: "specialized_expertise",
              },
              {
                label:
                  "حجم قاعدة البيانات التي تمتلكها الجمعية وتصنيف الفئات المستفيدة منها",
                key: "database_size",
              },
              {
                label:
                  "هل تمتلك الجمعية وحدة استثمار أو إدارة تنمية موارد مالية مستقلة؟",
                key: "has_investment_unit",
              },
            ],
            16,
          );

          // 4. Fourth Section
          createSection(
            "رابعاً: الجاهزية والتوجه الريادي",
            [
              { label: "ما هي أسباب التأسيس؟", key: "startup_reasons" },
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
            20,
          );

          // 5. Fifth Section
          createSection(
            "خامساً: الالتزام والقرار الإداري",
            [
              {
                label: "اسم ضابط الاتصال المسؤول عن المتابعة في البرنامج",
                key: "contact_person",
              },
              {
                label:
                  'هل وافق مجلس الإدارة "مبدئياً" على فكرة تأسيس ذراع استثماري أو شركة مستقلة؟',
                key: "board_approval",
              },
              {
                label:
                  "هل يوجد موظف أو فريق عمل سيتم تفريغه (جزئياً أو كلياً) لمتابعة هذا البرنامج؟",
                key: "dedicated_team",
              },
            ],
            23,
          );

          // 6. Sixth Section - Attachments
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "سادساً: المرفقات",
                  bold: true,
                  color: "000000",
                  size: 32,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.RIGHT,
              bidirectional: true,
              spacing: { before: 400, after: 200 },
            }),
          );

          const fileUrls = reg.form_data.file_urls as string[] | undefined;
          if (Array.isArray(fileUrls) && fileUrls.length > 0) {
            fileUrls.forEach((url, i) => {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${i + 1}. `,
                      bold: true,
                      size: 24,
                      color: "000000",
                    }),
                    new ExternalHyperlink({
                      children: [
                        new TextRun({
                          text: "عرض الملف",
                          style: "Hyperlink",
                          color: "1E3A5F",
                          bold: true,
                          size: 24,
                        }),
                      ],
                      link: url,
                    }),
                    new TextRun({
                      text: "  ",
                      size: 24,
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
