"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload, X, Send, Check } from "lucide-react";

// Convert Arabic/Persian numerals to Latin
function toLatinNumbers(str: string): string {
  return str
    .replace(/[٠-٩]/g, (d) => String("0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]))
    .replace(/[۰-۹]/g, (d) => String("0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]));
}

// ─── Zod Schema ───────────────────────────────────────────────
const contactFormSchema = z.object({
  // Section 1 - البيانات التعريفية
  associationName: z
    .string()
    .min(2, "يرجى إدخال اسم الجمعية (حرفين على الأقل)"),
  licenseNumber: z
    .string()
    .min(1, "يرجى إدخال رقم ترخيص الجمعية")
    .regex(/^[0-9٠-٩۰-۹]+$/, "يرجى إدخال أرقام فقط"),
  foundingDate: z.string().min(1, "يرجى إدخال تاريخ التأسيس"),
  supervisoryAuthority: z.string().min(1, "يرجى إدخال جهة الاشراف الفني"),
  geographicLocation: z.string().min(2, "يرجى إدخال الموقع الجغرافي للجمعية"),
  serviceScope: z.string().min(1, "يرجى إدخال النطاق الجغرافي لخدمات الجمعية"),
  headquartersAddress: z.string().min(1, "يرجى إدخال عنوان المقر الرئيس"),
  socialMediaLinks: z
    .string()
    .min(1, "يرجى إدخال الموقع الإلكتروني أو حسابات التواصل"),

  // Section 2 - القدرات المؤسسية والحوكمة
  boardStartDate: z.string().min(1, "يرجى إدخال تاريخ بداية مجلس الإدارة"),
  boardEndDate: z.string().min(1, "يرجى إدخال تاريخ نهاية مجلس الإدارة"),
  boardPeriod: z.string().min(1, "يرجى إدخال فترة مجلس الإدارة"),
  fullTimeEmployees: z.string().min(1, "يرجى إدخال عدد الموظفين"),
  hasExecutiveDirector: z.string().min(1, "يرجى اختيار إجابة"),
  executiveDirectorName: z.string().min(1, "يرجى إدخال اسم المدير التنفيذي"),
  executiveDirectorPhone: z.string().min(1, "يرجى إدخال رقم الجوال"),
  hasStrategicPlan: z.string().min(1, "يرجى اختيار إجابة"),
  strategicPlanEndDate: z
    .string()
    .min(1, "يرجى إدخال تاريخ انتهاء الخطة الاستراتيجية"),
  hasOperationalPlan: z.string().min(1, "يرجى اختيار إجابة"),
  governanceScore: z.string().min(1, "يرجى إدخال درجة الحوكمة"),
  averageBudget: z.string().min(1, "يرجى إدخال متوسط الميزانية السنوية"),
  awardsAndCertificates: z
    .string()
    .min(1, "يرجى ذكر الجوائز والشهادات أو كتابة 'لا يوجد'"),
  hasPerformanceReports: z.string().min(1, "يرجى اختيار إجابة"),
  hasExternalAuditorNotes: z.string().min(1, "يرجى اختيار إجابة"),
  externalAuditorNotes: z
    .string()
    .min(1, "يرجى ذكر الملاحظات أو كتابة 'لا يوجد'"),
  topPartnerships: z.string().min(1, "يرجى ذكر الشراكات أو كتابة 'لا يوجد'"),

  // Section 3 - الموارد والأصول المتاحة والمشاريع
  physicalAssets: z
    .string()
    .min(5, "يرجى وصف الأصول المادية (5 حروف على الأقل)"),
  hasDebts: z.string().min(1, "يرجى اختيار إجابة"),
  hasEndowments: z.string().min(1, "يرجى اختيار إجابة"),
  endowmentRevenue: z
    .string()
    .min(1, "يرجى إدخال الإيرادات أو كتابة 'لا يوجد'"),
  specializedExpertise: z
    .string()
    .min(5, "يرجى وصف الخبرات التخصصية (5 حروف على الأقل)"),
  databaseSize: z.string().min(1, "يرجى إدخال حجم قاعدة البيانات"),
  hasInvestmentUnit: z.string().min(1, "يرجى اختيار إجابة"),
  programsCount: z.string().min(1, "يرجى إدخال عدد البرامج والمشاريع"),
  developmentProjectsCount: z
    .string()
    .min(1, "يرجى إدخال عدد المشاريع التنموية"),

  // Section 4 - الجاهزية والتوجه الريادي
  startupReasons: z.string().min(10, "يرجى ذكر الأسباب (10 حروف على الأقل)"),
  mainGoal: z.string().min(1, "يرجى اختيار الهدف الرئيسي"),
  marketGaps: z.string().min(10, "يرجى وصف الفجوات (10 حروف على الأقل)"),

  // Section 5 - الالتزام والقرار الإداري
  contactPerson: z.string().min(2, "يرجى إدخال اسم ضابط الاتصال"),
  contactPersonPosition: z.string().min(1, "يرجى إدخال المنصب"),
  contactPersonPhone: z.string().min(1, "يرجى إدخال رقم الجوال"),
  boardApproval: z.string().min(1, "يرجى اختيار إجابة"),
  dedicatedTeam: z.string().min(1, "يرجى اختيار إجابة"),
  finalAspirations: z.string().min(10, "يرجى وصف تطلعاتكم (10 حروف على الأقل)"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

// Fields to validate per step
const stepFields: Record<number, (keyof ContactFormValues)[]> = {
  1: [
    "associationName",
    "licenseNumber",
    "foundingDate",
    "supervisoryAuthority",
    "geographicLocation",
    "serviceScope",
    "headquartersAddress",
    "socialMediaLinks",
  ],
  2: [
    "boardStartDate",
    "boardEndDate",
    "boardPeriod",
    "fullTimeEmployees",
    "hasExecutiveDirector",
    "executiveDirectorName",
    "executiveDirectorPhone",
    "hasStrategicPlan",
    "strategicPlanEndDate",
    "hasOperationalPlan",
    "governanceScore",
    "averageBudget",
    "awardsAndCertificates",
    "hasPerformanceReports",
    "hasExternalAuditorNotes",
    "externalAuditorNotes",
    "topPartnerships",
  ],
  3: [
    "physicalAssets",
    "hasDebts",
    "hasEndowments",
    "endowmentRevenue",
    "specializedExpertise",
    "databaseSize",
    "hasInvestmentUnit",
    "programsCount",
    "developmentProjectsCount",
  ],
  4: ["startupReasons", "mainGoal", "marketGaps"],
  5: [
    "contactPerson",
    "contactPersonPosition",
    "contactPersonPhone",
    "boardApproval",
    "dedicatedTeam",
    "finalAspirations",
  ],
};

const TOTAL_STEPS = 5;

const stepLabels = [
  "البيانات التعريفية",
  "القدرات المؤسسية",
  "الموارد والأصول",
  "الجاهزية الريادية",
  "الالتزام الإداري",
];

const stepTitles = [
  "أولاً: البيانات التعريفية",
  "ثانياً: القدرات المؤسسية والحوكمة",
  "ثالثاً: الموارد والأصول المتاحة والمشاريع",
  "رابعاً: الجاهزية والتوجه الريادي",
  "خامساً: الالتزام والقرار الإداري",
];

type ToastState = {
  type: "success" | "error" | "loading";
  message: string;
} | null;

// Step status: "untouched" | "valid" | "invalid"
type StepStatus = "untouched" | "valid" | "invalid";

// File categories for inline uploads
type FileCategory = "strategicPlan" | "operationalPlan" | "performanceReports";

const inputClass =
  "h-12 rounded-xl border-gray-200 focus:border-[#4B3D90] focus:ring-[#4B3D90] text-base w-full px-4";
const textareaClass =
  "min-h-[120px] rounded-xl border-gray-200 focus:border-[#4B3D90] focus:ring-[#4B3D90] resize-none text-base p-4 leading-relaxed w-full";

export function SubmitForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastState, setToastState] = useState<ToastState>(null);
  const [categoryFiles, setCategoryFiles] = useState<
    Record<FileCategory, File[]>
  >({
    strategicPlan: [],
    operationalPlan: [],
    performanceReports: [],
  });
  const fileInputRefs = {
    strategicPlan: useRef<HTMLInputElement>(null),
    operationalPlan: useRef<HTMLInputElement>(null),
    performanceReports: useRef<HTMLInputElement>(null),
  };
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    fileName: string;
  } | null>(null);
  const [stepStatuses, setStepStatuses] = useState<Record<number, StepStatus>>({
    1: "untouched",
    2: "untouched",
    3: "untouched",
    4: "untouched",
    5: "untouched",
  });

  // ... (defaultValues and persistence logic remain same) ...

  const defaultValues: Partial<ContactFormValues> = {
    associationName: "",
    licenseNumber: "",
    foundingDate: "",
    supervisoryAuthority: "",
    geographicLocation: "",
    serviceScope: "",
    headquartersAddress: "",
    socialMediaLinks: "",
    boardStartDate: "",
    boardEndDate: "",
    boardPeriod: "",
    fullTimeEmployees: "",
    hasExecutiveDirector: "",
    executiveDirectorName: "",
    executiveDirectorPhone: "",
    hasStrategicPlan: "",
    strategicPlanEndDate: "",
    hasOperationalPlan: "",
    governanceScore: "",
    averageBudget: "",
    awardsAndCertificates: "",
    hasPerformanceReports: "",
    hasExternalAuditorNotes: "",
    externalAuditorNotes: "",
    topPartnerships: "",
    physicalAssets: "",
    hasDebts: "",
    hasEndowments: "",
    endowmentRevenue: "",
    specializedExpertise: "",
    databaseSize: "",
    hasInvestmentUnit: "",
    programsCount: "",
    developmentProjectsCount: "",
    startupReasons: "",
    mainGoal: "",
    marketGaps: "",
    contactPerson: "",
    contactPersonPosition: "",
    contactPersonPhone: "",
    boardApproval: "",
    dedicatedTeam: "",
    finalAspirations: "",
  };

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
    mode: "onTouched",
  });

  // ─── Persistence Logic ─────────────────────────────────────
  // 1. Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("tamkeen-form-data");
      const savedStep = localStorage.getItem("tamkeen-form-step");

      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          // Set each field value
          Object.keys(parsedData).forEach((key) => {
            form.setValue(key as any, parsedData[key]);
          });
        } catch (e) {
          console.error("Failed to parse saved form data", e);
        }
      }

      if (savedStep) {
        setCurrentStep(Number(savedStep));
      }
    }
  }, [form]);

  // 2. Save data to localStorage on change
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem("tamkeen-form-data", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // 3. Save step to localStorage
  useEffect(() => {
    localStorage.setItem("tamkeen-form-step", String(currentStep));
  }, [currentStep]);

  const MAX_FILE_SIZE_MB = 50;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleCategoryFileChange =
    (category: FileCategory) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        const tooLarge = newFiles.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
        const accepted = newFiles.filter((f) => f.size <= MAX_FILE_SIZE_BYTES);

        if (tooLarge.length > 0) {
          const names = tooLarge.map((f) => f.name).join("، ");
          setToastState({
            type: "error",
            message: `الملف كبير جداً (الحد الأقصى ${MAX_FILE_SIZE_MB} ميجابايت): ${names}`,
          });
          setTimeout(() => setToastState(null), 5000);
        }

        if (accepted.length > 0) {
          setCategoryFiles((prev) => ({
            ...prev,
            [category]: [...prev[category], ...accepted],
          }));
        }
      }
    };

  const removeCategoryFile = (category: FileCategory, index: number) => {
    setCategoryFiles((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  // Validate a specific step and update its status
  const validateStepStatus = async (step: number): Promise<boolean> => {
    const fields = stepFields[step];
    const isValid = await form.trigger(fields);
    setStepStatuses((prev) => ({
      ...prev,
      [step]: isValid ? "valid" : "invalid",
    }));
    return isValid;
  };

  // Navigate to any step — validate current step first to update indicator
  const goToStep = async (targetStep: number) => {
    if (targetStep === currentStep) return;
    // Validate and update status of the step we're leaving
    await validateStepStatus(currentStep);
    setCurrentStep(targetStep);
  };

  const nextStep = async () => {
    const isValid = await validateStepStatus(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const prevStep = async () => {
    await validateStepStatus(currentStep);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // ─── Upload files to Supabase Storage ──────────────────────
  const uploadCategoryFiles = async (
    registrationId: string,
    category: FileCategory,
    files: File[],
  ): Promise<string[]> => {
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const safeName = file.name.replace(/[^a-zA-Z0-9.\u0600-\u06FF_-]/g, "_");
      const filePath = `submissions/${registrationId}/${category}/${safeName}`;

      setUploadProgress({
        current: i + 1,
        total: files.length,
        fileName: file.name,
      });

      const { error } = await supabase.storage
        .from("registrations")
        .upload(filePath, file);

      if (error) {
        console.error(`File upload error (${category}):`, error);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("registrations").getPublicUrl(filePath);

      urls.push(publicUrl);
    }

    return urls;
  };

  // ─── Submit Handler ─────────────────────────────────────────
  async function onSubmit(data: ContactFormValues) {
    // Prevent submission before the last step
    if (currentStep < TOTAL_STEPS) {
      nextStep();
      return;
    }

    setIsSubmitting(true);

    try {
      setToastState({ type: "loading", message: "جاري حفظ بياناتكم..." });

      // 1. Insert form data first to get the registration ID
      const { data: insertedRow, error } = await supabase
        .from("registrations")
        .insert([
          {
            user_name: data.contactPerson,
            phone_number: data.licenseNumber,
            form_data: {
              // Section 1
              association_name: data.associationName,
              license_number: data.licenseNumber,
              founding_date: data.foundingDate,
              supervisory_authority: data.supervisoryAuthority,
              geographic_location: data.geographicLocation,
              service_scope: data.serviceScope,
              headquarters_address: data.headquartersAddress,
              social_media_links: data.socialMediaLinks,
              // Section 2
              board_start_date: data.boardStartDate,
              board_end_date: data.boardEndDate,
              board_period: data.boardPeriod,
              full_time_employees: data.fullTimeEmployees,
              has_executive_director: data.hasExecutiveDirector,
              executive_director_name: data.executiveDirectorName,
              executive_director_phone: data.executiveDirectorPhone,
              has_strategic_plan: data.hasStrategicPlan,
              strategic_plan_end_date: data.strategicPlanEndDate,
              has_operational_plan: data.hasOperationalPlan,
              governance_score: data.governanceScore,
              average_budget: data.averageBudget,
              awards_and_certificates: data.awardsAndCertificates,
              has_performance_reports: data.hasPerformanceReports,
              has_external_auditor_notes: data.hasExternalAuditorNotes,
              external_auditor_notes: data.externalAuditorNotes,
              top_partnerships: data.topPartnerships,
              // Section 3
              physical_assets: data.physicalAssets,
              has_debts: data.hasDebts,
              has_endowments: data.hasEndowments,
              endowment_revenue: data.endowmentRevenue,
              specialized_expertise: data.specializedExpertise,
              database_size: data.databaseSize,
              has_investment_unit: data.hasInvestmentUnit,
              programs_count: data.programsCount,
              development_projects_count: data.developmentProjectsCount,
              // Section 4
              startup_reasons: data.startupReasons,
              main_goal: data.mainGoal,
              market_gaps: data.marketGaps,
              // Section 5
              contact_person: data.contactPerson,
              contact_person_position: data.contactPersonPosition,
              contact_person_phone: data.contactPersonPhone,
              board_approval: data.boardApproval,
              dedicated_team: data.dedicatedTeam,
              final_aspirations: data.finalAspirations,
            },
          },
        ])
        .select("id")
        .single();

      if (error) throw error;

      const registrationId = insertedRow?.id;

      // 2. Upload files into the registration's folder
      const allFileUrls: Record<string, string[]> = {};
      const totalFiles = Object.values(categoryFiles).reduce(
        (sum, files) => sum + files.length,
        0,
      );

      if (totalFiles > 0 && registrationId) {
        setToastState({
          type: "loading",
          message: `جاري رفع ${totalFiles} ملف(ات)...`,
        });

        for (const [category, files] of Object.entries(categoryFiles)) {
          if (files.length > 0) {
            const urls = await uploadCategoryFiles(
              String(registrationId),
              category as FileCategory,
              files,
            );
            if (urls.length > 0) {
              allFileUrls[category] = urls;
            }
          }
        }

        // 3. Update the record with file URLs
        await supabase
          .from("registrations")
          .update({
            form_data: {
              ...insertedRow,
              file_urls: allFileUrls,
            },
          })
          .eq("id", registrationId);
      }

      setToastState({
        type: "success",
        message: "شكراً لكم، تم استلام طلبكم بنجاح!",
      });
      form.reset();
      setCategoryFiles({
        strategicPlan: [],
        operationalPlan: [],
        performanceReports: [],
      });
      setCurrentStep(1);
      setStepStatuses({
        1: "untouched",
        2: "untouched",
        3: "untouched",
        4: "untouched",
        5: "untouched",
      });
      // Clear saved data from localStorage on success
      localStorage.removeItem("tamkeen-form-data");
      localStorage.removeItem("tamkeen-form-step");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "عذراً، حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.";
      setToastState({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
      setTimeout(() => setToastState(null), 5000);
    }
  }

  // ─── Reusable Field Renderers ──────────────────────────────────

  const renderInput = (
    name: keyof ContactFormValues,
    label: string,
    placeholder: string,
    options?: { type?: string; dir?: string; numeric?: boolean },
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[#1E3A5F] font-bold text-xs md:text-sm leading-relaxed">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type={options?.type || "text"}
              inputMode={options?.numeric ? "numeric" : undefined}
              placeholder={placeholder}
              className={inputClass}
              dir={options?.dir || (options?.numeric ? "ltr" : undefined)}
              {...field}
              onChange={(e) => {
                let val = e.target.value;
                if (options?.numeric) {
                  val = val.replace(/[^0-9٠-٩۰-۹]/g, "");
                }
                if (options?.type === "tel") {
                  val = toLatinNumbers(val);
                }
                field.onChange(val);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderTextarea = (
    name: keyof ContactFormValues,
    label: string,
    placeholder: string,
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[#1E3A5F] font-bold text-xs md:text-sm leading-relaxed">
            {label}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className={textareaClass}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderRadio = (
    name: keyof ContactFormValues,
    label: string,
    options: { label: string; value: string }[],
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[#1E3A5F] font-bold text-xs md:text-sm leading-relaxed">
            {label}
          </FormLabel>
          <FormControl>
            <div className="space-y-2 mt-1">
              {options.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    field.value === opt.value
                      ? "border-[#4B3D90] bg-[#4B3D90]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={name}
                    value={opt.value}
                    checked={field.value === opt.value}
                    onChange={() => field.onChange(opt.value)}
                    className="accent-[#4B3D90] w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  // ─── Inline File Upload Component ─────────────────────────
  const renderInlineFileUpload = (category: FileCategory) => (
    <div className="mt-3 space-y-2">
      <div
        onClick={() => fileInputRefs[category].current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer hover:border-[#5D9FDD] hover:bg-[#5D9FDD]/5 transition-all group bg-gray-50/30"
      >
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
          <Upload className="w-5 h-5 text-[#5D9FDD]" />
        </div>
        <div className="text-center">
          <p className="font-bold text-[#1E3A5F] text-sm">اضغط لرفع الملفات</p>
          <p className="text-gray-400 text-[10px]">PDF, Word, Excel, Images</p>
        </div>
        <input
          type="file"
          ref={fileInputRefs[category]}
          multiple
          className="hidden"
          onChange={handleCategoryFileChange(category)}
        />
      </div>
      <AnimatePresence>
        {categoryFiles[category].length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1.5"
          >
            {categoryFiles[category].map((file: File, index: number) => (
              <motion.div
                key={index}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="bg-white rounded-lg px-3 py-2 flex items-center justify-between gap-2 text-xs text-[#1E3A5F] border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center shrink-0 text-[10px] font-bold text-gray-500 uppercase">
                    {file.name.split(".").pop()?.slice(0, 3) || "FILE"}
                  </div>
                  <span className="truncate font-medium">{file.name}</span>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCategoryFile(category, index)}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ─── Step Indicator Component ──────────────────────────────
  const getStepIndicatorColor = (step: number) => {
    if (step === currentStep) return "bg-[#4B3D90] text-white border-[#4B3D90]";
    if (stepStatuses[step] === "valid")
      return "bg-emerald-500 text-white border-emerald-500";
    if (stepStatuses[step] === "invalid")
      return "bg-red-500 text-white border-red-500";
    return "bg-gray-100 text-gray-400 border-gray-200";
  };

  const getConnectorColor = (step: number) => {
    if (stepStatuses[step] === "valid") return "bg-emerald-400";
    if (stepStatuses[step] === "invalid") return "bg-red-300";
    return "bg-gray-200";
  };

  return (
    <section
      id="submit"
      className="flex-1 flex items-center py-6 md:py-12 bg-[#4B3D90] relative overflow-hidden"
    >
      <div className="container max-w-4xl mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="bg-white rounded-[1.5rem] overflow-hidden max-w-5xl mx-auto flex flex-col">
          <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-1">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#1E3A5F]">
                نموذج التقديم
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {stepTitles[currentStep - 1]}
              </p>
            </div>

            {/* ─── Clickable Step Indicators ─── */}
            <div className="mb-8">
              <div className="flex items-center justify-between" dir="rtl">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(
                  (step) => (
                    <div
                      key={step}
                      className="flex items-center flex-1 last:flex-none"
                    >
                      {/* Step Circle */}
                      <button
                        type="button"
                        onClick={() => goToStep(step)}
                        className={`relative shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer hover:scale-110 ${getStepIndicatorColor(step)}`}
                      >
                        {stepStatuses[step] === "valid" &&
                        step !== currentStep &&
                        step !== TOTAL_STEPS ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          step
                        )}
                        {/* Label below - hidden on mobile */}
                        <span
                          className={`absolute -bottom-6 whitespace-nowrap text-[10px] font-bold hidden sm:block ${
                            step === currentStep
                              ? "text-[#4B3D90]"
                              : stepStatuses[step] === "valid"
                                ? "text-emerald-600"
                                : stepStatuses[step] === "invalid"
                                  ? "text-red-500"
                                  : "text-gray-400"
                          }`}
                        >
                          {stepLabels[step - 1]}
                        </span>
                      </button>

                      {/* Connector Line */}
                      {step < TOTAL_STEPS && (
                        <div
                          className={`flex-1 h-0.5 mx-1 rounded-full transition-colors duration-300 ${getConnectorColor(step)}`}
                        />
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
            <Form {...form}>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex-1 flex flex-col justify-between mt-6"
              >
                <div className="relative min-h-[300px] md:min-h-[400px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="space-y-5"
                    >
                      {/* ─── Step 1: البيانات التعريفية ─── */}
                      {currentStep === 1 && (
                        <div className="grid gap-5">
                          {renderInput("associationName", "1. اسم الجمعية", "")}
                          {renderInput(
                            "licenseNumber",
                            "2. رقم ترخيص الجمعية",
                            "",
                            { numeric: true },
                          )}
                          {renderInput("foundingDate", "3. تاريخ التأسيس", "", {
                            type: "date",
                          })}
                          {renderInput(
                            "supervisoryAuthority",
                            "4. جهة الاشراف الفني",
                            "",
                          )}
                          {renderInput(
                            "geographicLocation",
                            "5. الموقع الجغرافي للجمعية (المنطقة والمدينة)",
                            "",
                          )}
                          {renderInput(
                            "serviceScope",
                            "6. النطاق الجغرافي لخدمات الجمعية",
                            "",
                          )}
                          {renderInput(
                            "headquartersAddress",
                            "7. عنوان المقر الرئيس للجمعية",
                            "",
                          )}
                          {renderTextarea(
                            "socialMediaLinks",
                            "8. الموقع الإلكتروني للجمعية وحسابات التواصل الاجتماعي",
                            "",
                          )}
                        </div>
                      )}

                      {/* ─── Step 2: القدرات المؤسسية والحوكمة ─── */}
                      {currentStep === 2 && (
                        <div className="grid gap-5">
                          {renderInput(
                            "boardStartDate",
                            "8. تاريخ بداية مجلس الإدارة",
                            "",
                            {
                              type: "date",
                            },
                          )}
                          {renderInput(
                            "boardEndDate",
                            "9. تاريخ نهاية مجلس الإدارة",
                            "",
                            {
                              type: "date",
                            },
                          )}
                          {renderInput(
                            "boardPeriod",
                            "10. فترة مجلس الإدارة",
                            "",
                          )}
                          {renderInput(
                            "fullTimeEmployees",
                            "11. عدد الموظفين المتفرغين في الجمعية",
                            "",
                          )}
                          {renderRadio(
                            "hasExecutiveDirector",
                            "12. هل يوجد مدير تنفيذي متفرغ للجمعية؟",
                            [
                              { label: "نعم", value: "نعم" },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                          {renderInput(
                            "executiveDirectorName",
                            "13. اسم المدير التنفيذي",
                            "",
                          )}
                          {renderInput(
                            "executiveDirectorPhone",
                            "14. رقم الجوال",
                            "",
                            { type: "tel", dir: "ltr" },
                          )}
                          {renderRadio(
                            "hasStrategicPlan",
                            "15. هل تمتلك الجمعية خطة استراتيجية معتمدة؟ (يرجى إرفاقها إن وجدت)",
                            [
                              { label: "نعم", value: "نعم" },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                          {form.watch("hasStrategicPlan") === "نعم" &&
                            renderInlineFileUpload("strategicPlan")}
                          {renderInput(
                            "strategicPlanEndDate",
                            "16. تاريخ انتهاء الخطة الاستراتيجية الحالية",
                            "",
                            {
                              type: "date",
                            },
                          )}
                          {renderRadio(
                            "hasOperationalPlan",
                            "17. هل تمتلك الجمعية خطة تشغيلية؟ (يرجى إرفاقها إن وجدت)",
                            [
                              { label: "نعم", value: "نعم" },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                          {form.watch("hasOperationalPlan") === "نعم" &&
                            renderInlineFileUpload("operationalPlan")}
                          {renderInput(
                            "governanceScore",
                            "18. درجة الجمعية في آخر تقييم للحوكمة",
                            "",
                            { numeric: true },
                          )}
                          {renderInput(
                            "averageBudget",
                            "19. متوسط الميزانية السنوية للجمعية في آخر ثلاث سنوات",
                            "",
                            { numeric: true },
                          )}
                          {renderTextarea(
                            "awardsAndCertificates",
                            "20. اذكر أهم الجوائز والشهادات التي حصلت عليها الجمعية سابقاً إن وجدت",
                            "",
                          )}
                          {renderRadio(
                            "hasPerformanceReports",
                            "21. هل تتوفر تقارير الأداء السنوية والمالية لآخر عامين؟ (يرجى إرفاقها إن وجدت)",
                            [
                              { label: "نعم", value: "نعم" },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                          {form.watch("hasPerformanceReports") === "نعم" &&
                            renderInlineFileUpload("performanceReports")}
                          {renderRadio(
                            "hasExternalAuditorNotes",
                            "22. هل توجد أي ملاحظات على الجمعية من المراجع الخارجي؟",
                            [
                              { label: "نعم", value: "نعم" },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                          {renderTextarea(
                            "externalAuditorNotes",
                            "23. في حال وجود ملاحظات يرجى ذكرها",
                            "",
                          )}
                          {renderTextarea(
                            "topPartnerships",
                            "24. اذكر أهم ثلاث شراكات استراتيجية للجمعية مع القطاع الخاص أو القطاع الحكومي",
                            "",
                          )}
                        </div>
                      )}

                      {/* ─── Step 3: الموارد والأصول المتاحة ─── */}
                      {currentStep === 3 && (
                        <div className="grid gap-5">
                          {renderTextarea(
                            "physicalAssets",
                            "16. ما هي الأصول المادية التي تمتلكها الجمعية وتسمح بالاستفادة منها في مشاريع استثمارية؟",
                            "",
                          )}
                          {renderRadio(
                            "hasDebts",
                            "17. هل يوجد ديون على الجمعية؟",
                            [
                              { label: "نعم", value: "نعم" },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                          {renderRadio(
                            "hasEndowments",
                            "18. هل لدى الجمعية أصول أو اوقاف؟",
                            [
                              { label: "نعم", value: "نعم" },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                          {renderInput(
                            "endowmentRevenue",
                            "19. اذا نعم، كم تبلغ الإيرادات من الأصول / الأوقاف؟",
                            "",
                          )}
                          {renderTextarea(
                            "specializedExpertise",
                            "20. ما هي الخبرات التخصصية أو المعرفة الفنية التي تنفرد بها الجمعية في مجال عملها؟",
                            "",
                          )}
                          {renderTextarea(
                            "databaseSize",
                            "21. حجم قاعدة البيانات التي تمتلكها الجمعية وتصنيف الفئات المستفيدة منها",
                            "",
                          )}
                          {renderRadio(
                            "hasInvestmentUnit",
                            "22. هل تمتلك الجمعية وحدة استثمار أو إدارة تنمية موارد مالية مستقلة؟",
                            [
                              { label: "نعم", value: "نعم" },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                          {renderInput(
                            "programsCount",
                            "23. كم عدد برامج ومشاريع الجمعية لعام 2024م -2025م",
                            "",
                            { numeric: true },
                          )}
                          {renderInput(
                            "developmentProjectsCount",
                            "24. كم عدد المشاريع التنموية منها؟",
                            "",
                            { numeric: true },
                          )}
                        </div>
                      )}

                      {/* ─── Step 4: الجاهزية والتوجه الريادي ─── */}
                      {currentStep === 4 && (
                        <div className="grid gap-5">
                          {renderTextarea(
                            "startupReasons",
                            "20. ما هي الأسباب التي تدفع الجمعية للرغبة في تأسيس شركة ناشئة؟",
                            "",
                          )}
                          {renderRadio(
                            "mainGoal",
                            "21. ما هو الهدف الرئيس للجمعية من إنشاء هذه الشركة؟",
                            [
                              {
                                label: "الاستدامة المالية للجمعية فقط.",
                                value: "الاستدامة المالية للجمعية فقط.",
                              },
                              {
                                label: "خلق فرص عمل للمستفيدين.",
                                value: "خلق فرص عمل للمستفيدين.",
                              },
                              {
                                label: "ابتكار حل تقني للمشكلة الاجتماعية.",
                                value: "ابتكار حل تقني للمشكلة الاجتماعية.",
                              },
                              {
                                label: "جميع ما سبق.",
                                value: "جميع ما سبق.",
                              },
                            ],
                          )}
                          {renderTextarea(
                            "marketGaps",
                            "22. ما هي الفجوات التي تراها الجمعية في سوق العمل وترتبط بمجال تخصصها؟",
                            "",
                          )}
                        </div>
                      )}

                      {/* ─── Step 5: الالتزام والقرار الإداري ─── */}
                      {currentStep === 5 && (
                        <div className="grid gap-5">
                          {renderInput(
                            "contactPerson",
                            "23. اسم ضابط الاتصال المسؤول عن المتابعة في المشروع",
                            "",
                          )}
                          {renderInput(
                            "contactPersonPosition",
                            "24. المنصب",
                            "",
                          )}
                          {renderInput("contactPersonPhone", "25. الجوال", "", {
                            type: "tel",
                            dir: "ltr",
                          })}
                          {renderRadio(
                            "boardApproval",
                            "26. هل وافق مجلس الإدارة على فكرة تأسيس ذراع استثماري أو شركة مستقلة؟",
                            [
                              { label: "نعم", value: "نعم" },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                          {renderRadio(
                            "dedicatedTeam",
                            "27. هل يوجد موظف أو فريق عمل سيتم تفريغه (جزئياً أو كلياً) لمتابعة هذا المشروع؟",
                            [
                              { label: "نعم", value: "نعم" },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                          {renderTextarea(
                            "finalAspirations",
                            "28. ما هي تطلعاتكم النهائية من المشاركة في برنامج التمكين الريادي؟",
                            "",
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Form Navigation Controls */}
                <div className="pt-8 mt-auto space-y-3">
                  {/* Previous & Next/Submit side by side */}
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="rounded-xl px-4 md:px-8 h-12 text-gray-500 font-bold hover:text-[#4B3D90] hover:bg-gray-50 disabled:opacity-20 transition-all text-base flex-1"
                    >
                      السابق
                    </Button>

                    {currentStep < TOTAL_STEPS ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-[#4B3D90] hover:bg-[#3D3175] text-white rounded-xl px-8 md:px-12 h-12 shadow-xl shadow-[#4B3D90]/20 transition-all font-bold text-base flex-1"
                      >
                        التالي
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => form.handleSubmit(onSubmit)()}
                        className="bg-[#5D9FDD] hover:bg-[#4D8FCB] text-white rounded-xl px-6 md:px-12 h-12 shadow-xl shadow-[#5D9FDD]/20 transition-all font-bold text-base flex-1"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">
                              {uploadProgress
                                ? `رفع ${uploadProgress.current}/${uploadProgress.total}`
                                : "جاري الإرسال..."}
                            </span>
                          </>
                        ) : (
                          "إرسال الطلب"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <AnimatePresence>
        {toastState && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-100 w-[90%] max-w-md"
          >
            <div
              className={`rounded-2xl px-8 py-5 shadow-2xl text-center font-bold ${
                toastState.type === "success"
                  ? "bg-green-600 text-white"
                  : toastState.type === "error"
                    ? "bg-red-600 text-white"
                    : "bg-white text-[#4B3D90] border-2 border-[#4B3D90]/10"
              }`}
            >
              <div className="text-lg">{toastState.message}</div>
              {/* Upload progress bar */}
              {toastState.type === "loading" && uploadProgress && (
                <div className="mt-3 w-full">
                  <div className="h-2 bg-[#4B3D90]/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#4B3D90] rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-xs text-[#4B3D90]/60 mt-1">
                    {uploadProgress.current} / {uploadProgress.total} ملفات
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
