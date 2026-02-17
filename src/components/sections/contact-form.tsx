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
  foundingDate: z.string().optional(),
  geographicLocation: z.string().min(2, "يرجى إدخال الموقع الجغرافي للجمعية"),
  serviceScope: z.string().optional(),
  headquartersAddress: z.string().optional(),
  socialMediaLinks: z.string().optional(),

  // Section 2 - القدرات المؤسسية والحوكمة
  fullTimeEmployees: z.string().min(1, "يرجى إدخال عدد الموظفين"),
  hasExecutiveDirector: z.string().min(1, "يرجى اختيار إجابة"),
  hasStrategicPlan: z.string().min(1, "يرجى اختيار إجابة"),
  governanceScore: z.string().optional(),
  averageBudget: z.string().optional(),
  awardsAndCertificates: z.string().optional(),
  hasPerformanceReports: z.string().min(1, "يرجى اختيار إجابة"),
  topPartnerships: z.string().optional(),

  // Section 3 - الموارد والأصول المتاحة
  physicalAssets: z
    .string()
    .min(5, "يرجى وصف الأصول المادية (5 حروف على الأقل)"),
  specializedExpertise: z
    .string()
    .min(5, "يرجى وصف الخبرات التخصصية (5 حروف على الأقل)"),
  databaseSize: z.string().optional(),
  hasInvestmentUnit: z.string().min(1, "يرجى اختيار إجابة"),

  // Section 4 - الجاهزية والتوجه الريادي
  startupReasons: z.string().min(10, "يرجى ذكر الأسباب (10 حروف على الأقل)"),
  mainGoal: z.string().min(1, "يرجى اختيار الهدف الرئيسي"),
  marketGaps: z.string().min(10, "يرجى وصف الفجوات (10 حروف على الأقل)"),

  // Section 5 - الالتزام والقرار الإداري
  contactPerson: z.string().min(2, "يرجى إدخال اسم ضابط الاتصال"),
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
    "geographicLocation",
    "serviceScope",
    "headquartersAddress",
    "socialMediaLinks",
  ],
  2: [
    "fullTimeEmployees",
    "hasExecutiveDirector",
    "hasStrategicPlan",
    "governanceScore",
    "averageBudget",
    "awardsAndCertificates",
    "hasPerformanceReports",
    "topPartnerships",
  ],
  3: [
    "physicalAssets",
    "specializedExpertise",
    "databaseSize",
    "hasInvestmentUnit",
  ],
  4: ["startupReasons", "mainGoal", "marketGaps"],
  5: ["contactPerson", "boardApproval", "dedicatedTeam", "finalAspirations"],
  6: [], // No text fields to validate in step 6
};

const TOTAL_STEPS = 6;

const stepLabels = [
  "البيانات التعريفية",
  "القدرات المؤسسية",
  "الموارد والأصول",
  "الجاهزية الريادية",
  "الالتزام الإداري",
  "المرفقات",
];

const stepTitles = [
  "أولاً: البيانات التعريفية",
  "ثانياً: القدرات المؤسسية والحوكمة",
  "ثالثاً: الموارد والأصول المتاحة",
  "رابعاً: الجاهزية والتوجه الريادي",
  "خامساً: الالتزام والقرار الإداري",
  "سادساً: المرفقات والوثائق",
];

type ToastState = {
  type: "success" | "error" | "loading";
  message: string;
} | null;

// Step status: "untouched" | "valid" | "invalid"
type StepStatus = "untouched" | "valid" | "invalid";

const inputClass =
  "h-12 rounded-xl border-gray-200 focus:border-[#4B3D90] focus:ring-[#4B3D90] text-base w-full px-4";
const textareaClass =
  "min-h-[120px] rounded-xl border-gray-200 focus:border-[#4B3D90] focus:ring-[#4B3D90] resize-none text-base p-4 leading-relaxed w-full";

export function ContactForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastState, setToastState] = useState<ToastState>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    6: "untouched",
  });

  // ... (defaultValues and persistence logic remain same) ...

  const defaultValues: Partial<ContactFormValues> = {
    associationName: "",
    licenseNumber: "",
    foundingDate: "",
    geographicLocation: "",
    serviceScope: "",
    headquartersAddress: "",
    socialMediaLinks: "",
    fullTimeEmployees: "",
    hasExecutiveDirector: "",
    hasStrategicPlan: "",
    governanceScore: "",
    averageBudget: "",
    awardsAndCertificates: "",
    hasPerformanceReports: "",
    topPartnerships: "",
    physicalAssets: "",
    specializedExpertise: "",
    databaseSize: "",
    hasInvestmentUnit: "",
    startupReasons: "",
    mainGoal: "",
    marketGaps: "",
    contactPerson: "",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setSelectedFiles((prev) => [...prev, ...accepted]);
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
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
  const uploadFiles = async (): Promise<string[]> => {
    const urls: string[] = [];
    const failedFiles: string[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // Update progress state
      setUploadProgress({
        current: i + 1,
        total: selectedFiles.length,
        fileName: file.name,
      });
      setToastState({
        type: "loading",
        message: `جاري رفع الملف ${i + 1} من ${selectedFiles.length}... (${file.name})`,
      });

      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.\u0600-\u06FF_-]/g, "_");
      const filePath = `submissions/${timestamp}_${safeName}`;

      const { error } = await supabase.storage
        .from("registrations")
        .upload(filePath, file);

      if (error) {
        console.error("File upload error:", error);
        failedFiles.push(file.name);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("registrations").getPublicUrl(filePath);

      urls.push(publicUrl);
    }

    setUploadProgress(null);

    if (failedFiles.length > 0 && failedFiles.length < selectedFiles.length) {
      // Some files failed — warn the user but continue
      setToastState({
        type: "loading",
        message: `⚠️ تعذّر رفع ${failedFiles.length} ملف(ات): ${failedFiles.join("، ")}. جاري حفظ باقي البيانات...`,
      });
      // Brief pause so user can read the warning
      await new Promise((r) => setTimeout(r, 2000));
    } else if (failedFiles.length === selectedFiles.length) {
      // ALL files failed
      throw new Error(
        `فشل رفع جميع الملفات. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.`,
      );
    }

    return urls;
  };

  // ─── Submit Handler ─────────────────────────────────────────
  async function onSubmit(data: ContactFormValues) {
    // Prevent submission before the last step (Step 6)
    if (currentStep < TOTAL_STEPS) {
      nextStep();
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload files first
      let fileUrls: string[] = [];
      if (selectedFiles.length > 0) {
        setToastState({
          type: "loading",
          message: `جاري تحضير ${selectedFiles.length} ملف(ات) للرفع...`,
        });
        fileUrls = await uploadFiles();
      } else {
        setToastState({ type: "loading", message: "جاري حفظ بياناتكم..." });
      }

      // Update toast for data save step
      setToastState({ type: "loading", message: "جاري حفظ بياناتكم..." });

      // Insert all form data
      const { error } = await supabase.from("registrations").insert([
        {
          user_name: data.contactPerson,
          phone_number: data.licenseNumber,
          form_data: {
            // Section 1
            association_name: data.associationName,
            license_number: data.licenseNumber,
            founding_date: data.foundingDate,
            geographic_location: data.geographicLocation,
            service_scope: data.serviceScope,
            headquarters_address: data.headquartersAddress,
            social_media_links: data.socialMediaLinks,
            // Section 2
            full_time_employees: data.fullTimeEmployees,
            has_executive_director: data.hasExecutiveDirector,
            has_strategic_plan: data.hasStrategicPlan,
            governance_score: data.governanceScore,
            average_budget: data.averageBudget,
            awards_and_certificates: data.awardsAndCertificates,
            has_performance_reports: data.hasPerformanceReports,
            top_partnerships: data.topPartnerships,
            // Section 3
            physical_assets: data.physicalAssets,
            specialized_expertise: data.specializedExpertise,
            database_size: data.databaseSize,
            has_investment_unit: data.hasInvestmentUnit,
            // Section 4
            startup_reasons: data.startupReasons,
            main_goal: data.mainGoal,
            market_gaps: data.marketGaps,
            // Section 5
            contact_person: data.contactPerson,
            board_approval: data.boardApproval,
            dedicated_team: data.dedicatedTeam,
            final_aspirations: data.finalAspirations,
            // Files
            file_urls: fileUrls,
          },
        },
      ]);

      if (error) throw error;

      setToastState({
        type: "success",
        message: "شكراً لكم، تم استلام طلبكم بنجاح!",
      });
      form.reset();
      setSelectedFiles([]);
      setCurrentStep(1);
      setStepStatuses({
        1: "untouched",
        2: "untouched",
        3: "untouched",
        4: "untouched",
        5: "untouched",
        6: "untouched",
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
          <FormLabel className="text-[#1E3A5F] font-bold text-sm">
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
          <FormLabel className="text-[#1E3A5F] font-bold text-sm">
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
          <FormLabel className="text-[#1E3A5F] font-bold text-sm">
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
      id="contact"
      className="flex-1 flex items-center py-12 bg-[#4B3D90] relative overflow-hidden"
    >
      <div className="container max-w-4xl mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="bg-white rounded-[1.5rem] overflow-hidden max-w-5xl mx-auto flex flex-col">
          <div className="p-8 flex flex-col flex-1">
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
                        className={`relative hrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 cursor-pointer hover:scale-110 ${getStepIndicatorColor(step)}`}
                      >
                        {stepStatuses[step] === "valid" &&
                        step !== currentStep ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          step
                        )}
                        {/* Label below */}
                        <span
                          className={`absolute -bottom-7 whitespace-nowrap text-[10px] font-bold ${
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
                <div className="relative min-h-[400px]">
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
                          {renderInput(
                            "associationName",
                            "1. اسم الجمعية *",
                            "أدخل اسم الجمعية",
                          )}
                          {renderInput(
                            "licenseNumber",
                            "2. رقم ترخيص الجمعية *",
                            "أدخل رقم الترخيص",
                            { numeric: true },
                          )}
                          {renderInput("foundingDate", "3. تاريخ التأسيس", "", {
                            type: "date",
                          })}
                          {renderInput(
                            "geographicLocation",
                            "4. الموقع الجغرافي للجمعية (المنطقة والمدينة) *",
                            "مثال: منطقة الرياض - مدينة الرياض",
                          )}
                          {renderInput(
                            "serviceScope",
                            "5. النطاق الجغرافي لخدمات الجمعية",
                            "محلي / إقليمي / وطني",
                          )}
                          {renderInput(
                            "headquartersAddress",
                            "6. عنوان المقر الرئيسي للجمعية",
                            "أدخل العنوان التفصيلي",
                          )}
                          {renderTextarea(
                            "socialMediaLinks",
                            "7. حسابات التواصل الاجتماعي والموقع الإلكتروني",
                            "أدخل روابط حسابات التواصل الاجتماعي والموقع الإلكتروني",
                          )}
                        </div>
                      )}

                      {/* ─── Step 2: القدرات المؤسسية والحوكمة ─── */}
                      {currentStep === 2 && (
                        <div className="grid gap-5">
                          {renderInput(
                            "fullTimeEmployees",
                            "8. عدد الموظفين المتفرغين في الجمعية *",
                            "مثال: 50 أو 50-100",
                          )}
                          {renderRadio(
                            "hasExecutiveDirector",
                            "9. هل يوجد مدير تنفيذي متفرغ للجمعية؟ *",
                            [
                              { label: "نعم", value: "نعم" },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                          {renderRadio(
                            "hasStrategicPlan",
                            "10.  هل تمتلك الجمعية خطة استراتيجية معتمدة؟ (يرجى إرفاقها إن وجدت)*",
                            [
                              {
                                label: "نعم (يرجى إرفاقها في المرفقات)",
                                value: "نعم",
                              },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                          {renderInput(
                            "governanceScore",
                            "11. درجة الجمعية في آخر تقييم للحوكمة",
                            "أدخل الدرجة",
                            { numeric: true },
                          )}
                          {renderInput(
                            "averageBudget",
                            "12. متوسط الميزانية السنوية للجمعية في آخر ثلاث سنوات",
                            "أدخل المبلغ التقريبي بالريال",
                            { numeric: true },
                          )}
                          {renderTextarea(
                            "awardsAndCertificates",
                            "13. أهم الجوائز والشهادات التي حصلت عليها الجمعية",
                            "اذكر أهم الجوائز والشهادات إن وجدت",
                          )}
                          {renderRadio(
                            "hasPerformanceReports",
                            "14. هل تتوفر تقارير الأداء السنوية والمالية لآخر عامين؟ *",
                            [
                              {
                                label: "نعم",
                                value: "نعم",
                              },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                          {renderTextarea(
                            "topPartnerships",
                            "15. اذكر أهم ثلاث شراكات استراتيجية للجمعية مع القطاع الخاص أو الجهات الحكومية",
                            "اذكر أهم ثلاث شراكات مع القطاع الخاص أو الجهات الحكومية",
                          )}
                        </div>
                      )}

                      {/* ─── Step 3: الموارد والأصول المتاحة ─── */}
                      {currentStep === 3 && (
                        <div className="grid gap-5">
                          {renderTextarea(
                            "physicalAssets",
                            "16. ما هي الأصول المادية التي تمتلكها الجمعية وتسمح بالاستفادة منها في مشاريع استثمارية؟ *",
                            "صف الأصول المادية المتاحة",
                          )}
                          {renderTextarea(
                            "specializedExpertise",
                            "17. ما هي الخبرات التخصصية أو المعرفة الفنية التي تنفرد بها الجمعية في مجال عملها؟ *",
                            "صف الخبرات التخصصية والمعرفة الفنية",
                          )}
                          {renderTextarea(
                            "databaseSize",
                            "18. حجم قاعدة البيانات التي تمتلكها الجمعية وتصنيف الفئات المستفيدة منها",
                            "صف حجم قاعدة البيانات والفئات المستفيدة",
                          )}
                          {renderRadio(
                            "hasInvestmentUnit",
                            "19. هل تمتلك الجمعية وحدة استثمار أو إدارة تنمية موارد مالية مستقلة؟ *",
                            [
                              { label: "نعم", value: "نعم" },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                        </div>
                      )}

                      {/* ─── Step 4: الجاهزية والتوجه الريادي ─── */}
                      {currentStep === 4 && (
                        <div className="grid gap-5">
                          {renderTextarea(
                            "startupReasons",
                            "20. ما هي الأسباب التي تدفع الجمعية للرغبة في تأسيس شركة ناشئة؟ *",
                            "اذكر الأسباب والدوافع",
                          )}
                          {renderRadio(
                            "mainGoal",
                            "21. ما هو الهدف الرئيسي للجمعية من إنشاء هذه الشركة؟ *",
                            [
                              {
                                label: "الاستدامة المالية للجمعية فقط",
                                value: "الاستدامة المالية للجمعية فقط",
                              },
                              {
                                label: "خلق فرص عمل للمستفيدين",
                                value: "خلق فرص عمل للمستفيدين",
                              },
                              {
                                label: "ابتكار حل تقني للمشكلة الاجتماعية",
                                value: "ابتكار حل تقني للمشكلة الاجتماعية",
                              },
                              {
                                label: "جميع ما سبق",
                                value: "جميع ما سبق",
                              },
                            ],
                          )}
                          {renderTextarea(
                            "marketGaps",
                            "22. ما هي الفجوات التي تراها الجمعية في سوق العمل وترتبط بمجال تخصصها؟ *",
                            "صف الفجوات في سوق العمل المرتبطة بتخصص الجمعية",
                          )}
                        </div>
                      )}

                      {/* ─── Step 5: الالتزام والقرار الإداري ─── */}
                      {currentStep === 5 && (
                        <div className="grid gap-5">
                          {renderInput(
                            "contactPerson",
                            "23. اسم ضابط الاتصال المسؤول عن المتابعة في البرنامج *",
                            "أدخل الاسم الكامل",
                          )}
                          {renderRadio(
                            "boardApproval",
                            '24. هل وافق مجلس الإدارة "مبدئياً" على فكرة تأسيس ذراع استثماري أو شركة مستقلة؟ *',
                            [
                              { label: "نعم", value: "نعم" },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                          {renderRadio(
                            "dedicatedTeam",
                            "25. هل يوجد موظف أو فريق عمل سيتم تفريغه (جزئياً أو كلياً) لمتابعة هذا البرنامج؟ *",
                            [
                              { label: "نعم", value: "نعم" },
                              { label: "لا", value: "لا" },
                            ],
                          )}
                          {renderTextarea(
                            "finalAspirations",
                            "26. ما هي تطلعاتكم النهائية من المشاركة في برنامج التمكين الريادي؟ *",
                            "صف تطلعاتكم وأهدافكم من المشاركة في البرنامج",
                          )}
                        </div>
                      )}

                      {/* ─── Step 6: المرفقات ─── */}
                      {currentStep === 6 && (
                        <div className="grid gap-5">
                          <div className="space-y-3 pt-2">
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-4">
                              <p className="text-[#1E3A5F] text-sm leading-relaxed">
                                يرجى إرفاق المستندات الداعمة مثل:
                                <span className="font-bold">
                                  {" "}
                                  الخطة الاستراتيجية، تقارير الأداء المالي
                                  والفني، أو أي وثائق أخرى ذات صلة.
                                </span>
                              </p>
                            </div>

                            <label className="block text-[#1E3A5F] font-bold text-sm mb-1.5">
                              المرفقات والوثائق
                            </label>
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#5D9FDD] hover:bg-[#5D9FDD]/5 transition-all group bg-gray-50/30"
                            >
                              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <Upload className="w-7 h-7 text-[#5D9FDD]" />
                              </div>
                              <div className="text-center space-y-1">
                                <p className="font-bold text-[#1E3A5F] text-lg">
                                  اضغط لرفع الملفات
                                </p>
                                <p className="text-gray-400 text-xs">
                                  يمكنك رفع ملفات PDF, Word, Excel, Images
                                </p>
                              </div>
                              <input
                                type="file"
                                ref={fileInputRef}
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                              />
                            </div>

                            <AnimatePresence>
                              {selectedFiles.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="space-y-2 pt-2"
                                >
                                  {selectedFiles.map((file, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ x: 20, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      exit={{ x: -20, opacity: 0 }}
                                      className="bg-white rounded-xl px-4 py-3 flex items-center justify-between gap-3 text-sm text-[#1E3A5F] border border-gray-100 shadow-sm"
                                    >
                                      <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-500 uppercase">
                                          {file.name
                                            .split(".")
                                            .pop()
                                            ?.slice(0, 3) || "FILE"}
                                        </div>
                                        <span className="truncate font-medium">
                                          {file.name}
                                        </span>
                                        <span className="text-xs text-gray-400 flex-shrink-0">
                                          (
                                          {(file.size / 1024 / 1024).toFixed(2)}{" "}
                                          MB)
                                        </span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                      >
                                        <X className="w-5 h-5" />
                                      </button>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Form Navigation Controls */}
                <div className="flex items-center justify-between pt-10 mt-auto">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="rounded-xl px-4 md:px-8 h-12 text-gray-500 font-bold hover:text-[#4B3D90] hover:bg-gray-50 disabled:opacity-20 transition-all text-base"
                    >
                      السابق
                    </Button>

                    {/* Reset Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        if (
                          confirm(
                            "هل أنت متأكد من رغبتك في حذف جميع البيانات والبدء من جديد؟",
                          )
                        ) {
                          form.reset(defaultValues);
                          setCurrentStep(1);
                          setSelectedFiles([]);
                          localStorage.removeItem("tamkeen-form-data");
                          localStorage.removeItem("tamkeen-form-step");
                          window.location.reload(); // Force reload to clear any lingering state
                        }
                      }}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl px-4 h-12 font-bold transition-all text-sm"
                    >
                      إعادة تعيين
                    </Button>
                  </div>

                  {currentStep < TOTAL_STEPS ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-[#4B3D90] hover:bg-[#3D3175] text-white rounded-xl px-8 md:px-12 h-12 shadow-xl shadow-[#4B3D90]/20 transition-all font-bold text-base"
                    >
                      التالي
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => form.handleSubmit(onSubmit)()}
                      className="bg-[#5D9FDD] hover:bg-[#4D8FCB] text-white rounded-xl px-8 md:px-12 h-12 shadow-xl shadow-[#5D9FDD]/20 transition-all font-bold text-base flex items-center gap-3"
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
                        <>
                          <Send className="w-5 h-5 ml-1" /> إرسال طلب الانضمام
                        </>
                      )}
                    </Button>
                  )}
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
