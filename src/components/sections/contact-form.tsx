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
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}

const contactFormSchema = z.object({
  userName: z.string().min(2, {
    message: "يرجى إدخال اسمك الكريم (حرفين على الأقل)",
  }),
  phoneNumber: z.string().min(10, {
    message: "يرجى إدخال رقم هاتف صحيح",
  }),
  files: z.any().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

type ToastState = {
  type: "success" | "error" | "loading";
  message: string;
} | null;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastState, setToastState] = useState<ToastState>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      userName: "",
      phoneNumber: "",
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

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    setToastState({ type: "loading", message: "جاري إرسال طلبك..." });

    try {
      // Create record in database
      const { error } = await supabase.from("registrations").insert([
        {
          user_name: data.userName,
          phone_number: data.phoneNumber,
        },
      ]);

      if (error) throw error;

      setToastState({
        type: "success",
        message: `شكراً لك يا ${data.userName}، تم استلام طلبك بنجاح!`,
      });
      form.reset();
      setSelectedFiles([]);
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

  return (
    <section
      id="contact"
      className="flex-1 flex items-center py-8 bg-[#95a4b3] relative overflow-hidden"
    >
      <div className="container max-w-4xl mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-5xl mx-auto">
          {/* Left Column: Contact Info (Brand Blue Sidebar) */}

          {/* Right Column: Form */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-[#5D9FDD] mb-6">
              نموذج التقديم
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#5D9FDD] font-medium">
                        الاسم الرباعي <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل الاسم الرباعي"
                          className="h-12 rounded-xl border-gray-200 focus:border-[#4B3D90] focus:ring-[#4B3D90]"
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
                      <FormLabel className="text-[#5D9FDD] font-medium">
                        رقم الجوال <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div
                            className="absolute left-0 top-0 h-full px-4 flex items-center bg-gray-50 border-r border-gray-200 rounded-l-xl text-gray-500 font-sans"
                            dir="ltr"
                          >
                            +966
                          </div>
                          <Input
                            type="tel"
                            inputMode="numeric"
                            placeholder="5X XXX XXXX"
                            className="h-12 pl-20 rounded-xl border-gray-200 focus:border-[#4B3D90] focus:ring-[#4B3D90] font-sans"
                            dir="ltr"
                            {...field}
                            onChange={(e) => {
                              const latin = toLatinNumbers(e.target.value);
                              field.onChange(latin);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload Section */}
                <div className="space-y-3">
                  <FormLabel className="text-[#5D9FDD] font-medium">
                    المرفقات
                  </FormLabel>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#4B3D90] hover:bg-gray-50/50 transition-all"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-500">رفع الملفات</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* Selected Files List */}
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
                            className="bg-gray-100 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-sm text-[#5D9FDD]"
                          >
                            <span className="truncate max-w-[120px]">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[140px] h-12 bg-[#4B3D90] hover:bg-[#3D3175] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5 ml-1" />
                        إرسال
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Toast overlay */}
      <AnimatePresence>
        {toastState && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-100 w-[90%] max-w-md"
          >
            <div
              className={`rounded-2xl px-6 py-4 shadow-2xl text-center text-lg font-medium ${
                toastState.type === "success"
                  ? "bg-green-500 text-white"
                  : toastState.type === "error"
                    ? "bg-red-500 text-white"
                    : "bg-white text-[#4B3D90] border border-gray-200"
              }`}
            >
              {toastState.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
