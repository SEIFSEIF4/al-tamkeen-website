"use client";

import { useState, useRef } from "react";
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
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { supabase } from "@/lib/supabase";
import {
  Loader2,
  Upload,
  X,
  MapPin,
  Mail,
  Phone,
  Globe,
  Instagram,
  Send,
  Clipboard,
} from "lucide-react";

// Convert Arabic/Persian numerals to Latin
function toLatinNumbers(str: string): string {
  return str
    .replace(/[٠-٩]/g, (d) => String("0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]))
    .replace(/[۰-۹]/g, (d) => String("0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]));
}

const contactFormSchema = z.object({
  userName: z.string().min(2, {
    message: "يرجى إدخال اسمك الكريم (حرفين على الأقل)",
  }),
  phoneNumber: z.string().min(10, {
    message: "يرجى إدخال رقم هاتف صحيح",
  }),
  associationName: z.string().min(2, {
    message: "يرجى إدخال اسم الجمعية",
  }),
  city: z.string().min(2, {
    message: "يرجى إدخال المدينة",
  }),
  motivation: z.string().min(10, {
    message: "يرجى كتابة نبذة عن دافعك للانضمام (10 حروف على الأقل)",
  }),
  files: z.any().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

type ToastState = {
  type: "success" | "error" | "loading";
  message: string;
} | null;

export function ContactForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastState, setToastState] = useState<ToastState>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      userName: "",
      phoneNumber: "",
      associationName: "",
      city: "",
      motivation: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof ContactFormValues)[] = [];
    if (currentStep === 1) fieldsToValidate = ["userName", "phoneNumber"];
    if (currentStep === 2) fieldsToValidate = ["associationName", "city"];
    if (currentStep === 3) fieldsToValidate = ["motivation"];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    setToastState({ type: "loading", message: "جاري إرسال طلبك..." });

    try {
      const { error } = await supabase.from("registrations").insert([
        {
          user_name: data.userName,
          phone_number: data.phoneNumber,
          // metadata could include other fields if updated in DB
        },
      ]);

      if (error) throw error;

      setToastState({
        type: "success",
        message: `شكراً لك يا ${data.userName}، تم استلام طلبك بنجاح!`,
      });
      form.reset();
      setSelectedFiles([]);
      setCurrentStep(1);
    } catch {
      setToastState({
        type: "error",
        message: "عذراً، حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToastState(null), 4000);
    }
  }

  const steps = [
    { id: 1, title: "المعلومات والملفات" },
    { id: 2, title: "تفاصيل الجمعية" },
    { id: 3, title: "الدافع للمشاركة" },
  ];

  return (
    <section
      id="contact"
      className="flex-1 flex items-center py-12 bg-[#4B3D90] relative overflow-hidden"
    >
      <div className="container max-w-4xl mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="bg-white rounded-[1.5rem] shadow-2xl overflow-hidden max-w-5xl mx-auto min-h-[600px] flex flex-col">
          <div className="p-8 md:p-12 flex flex-col flex-1">
            {/* Steps Progress Indicator */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#1E3A5F]">
                    نموذج التقديم
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {steps[currentStep - 1].title}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#5D9FDD] bg-[#5D9FDD]/5 px-4 py-1.5 rounded-full border border-[#5D9FDD]/10">
                  خطوة {currentStep} من 3
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ width: `${(currentStep / 3) * 100}%` }}
                  className="h-full bg-linear-to-l from-[#4B3D90] to-[#5D9FDD]"
                />
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex-1 flex flex-col justify-between"
              >
                <div className="relative min-h-[300px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="space-y-6"
                    >
                      {currentStep === 1 && (
                        <div className="grid gap-6">
                          <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#1E3A5F] font-bold">
                                  الاسم الرباعي{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="أدخل الاسم الرباعي"
                                    className="h-14 rounded-2xl border-gray-200 focus:border-[#4B3D90] focus:ring-[#4B3D90] text-lg"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#1E3A5F] font-bold">
                                  رقم الجوال{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <div
                                      className="absolute left-0 top-0 h-full px-5 flex items-center bg-gray-50 border-r border-gray-200 rounded-l-2xl text-gray-500 font-sans font-medium"
                                      dir="ltr"
                                    >
                                      +966
                                    </div>
                                    <Input
                                      type="tel"
                                      inputMode="numeric"
                                      placeholder="5X XXX XXXX"
                                      className="h-14 pl-24 rounded-2xl border-gray-200 focus:border-[#4B3D90] focus:ring-[#4B3D90] font-sans text-xl"
                                      dir="ltr"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          toLatinNumbers(e.target.value),
                                        )
                                      }
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* File Upload Section - NOW IN STEP 1 */}
                          <div className="space-y-4 pt-2">
                            <FormLabel className="text-[#1E3A5F] font-bold">
                              المرفقات والوثائق
                            </FormLabel>
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#5D9FDD] hover:bg-[#5D9FDD]/5 transition-all group"
                            >
                              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-[#5D9FDD]/20 transition-colors">
                                <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#5D9FDD]" />
                              </div>
                              <div className="text-center">
                                <p className="font-bold text-[#1E3A5F] text-sm">
                                  اضغط لرفع الملفات الوثائق
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
                                  className="flex flex-wrap gap-2 pt-1"
                                >
                                  {selectedFiles.map((file, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      className="bg-gray-50 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs text-[#1E3A5F] border border-gray-100 shadow-sm"
                                    >
                                      <span className="truncate max-w-[120px] font-medium">
                                        {file.name}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="grid gap-6">
                          <FormField
                            control={form.control}
                            name="associationName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#1E3A5F] font-bold">
                                  اسم الجمعية{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="أدخل اسم الجمعية الخيرية"
                                    className="h-14 rounded-2xl border-gray-200 focus:border-[#4B3D90] focus:ring-[#4B3D90] text-lg"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#1E3A5F] font-bold">
                                  المدينة{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="أدخل المدينة / المنطقة"
                                    className="h-14 rounded-2xl border-gray-200 focus:border-[#4B3D90] focus:ring-[#4B3D90] text-lg"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {currentStep === 3 && (
                        <FormField
                          control={form.control}
                          name="motivation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#1E3A5F] font-bold">
                                لماذا ترغب في الانضمام للبرنامج؟{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="اكتب نبذة مختصرة عن دافعك للمشاركة وكيف سيساهم البرنامج في تطوير جمعيتكم..."
                                  className="min-h-[180px] rounded-2xl border-gray-200 focus:border-[#4B3D90] focus:ring-[#4B3D90] resize-none text-lg p-5 leading-relaxed"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Form Navigation Controls */}
                <div className="flex items-center justify-between pt-12 mt-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="rounded-xl px-8 h-14 text-gray-500 font-bold hover:text-[#4B3D90] hover:bg-gray-50 disabled:opacity-20 transition-all text-lg"
                  >
                    السابق
                  </Button>

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-[#4B3D90] hover:bg-[#3D3175] text-white rounded-xl px-12 h-14 shadow-xl shadow-[#4B3D90]/20 transition-all font-bold text-lg"
                    >
                      التالي
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#5D9FDD] hover:bg-[#4D8FCB] text-white rounded-xl px-14 h-14 shadow-xl shadow-[#5D9FDD]/20 transition-all font-bold text-lg flex items-center gap-3"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-6 h-6 ml-1" /> إرسال طلب الانضمام
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
              className={`rounded-2xl px-8 py-5 shadow-2xl text-center text-xl font-bold ${toastState.type === "success" ? "bg-green-600 text-white" : toastState.type === "error" ? "bg-red-600 text-white" : "bg-white text-[#4B3D90] border-2 border-[#4B3D90]/10"}`}
            >
              {toastState.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
