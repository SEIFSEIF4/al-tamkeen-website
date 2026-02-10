"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const contactFormSchema = z.object({
  userName: z.string().min(2, {
    message: "يرجى إدخال اسمك الكريم (حرفين على الأقل)",
  }),
  phoneNumber: z.string().min(10, {
    message: "يرجى إدخال رقم هاتف صحيح",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      userName: "",
      phoneNumber: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);

    const submission = async () => {
      const { error } = await supabase.from("registrations").insert([
        {
          user_name: data.userName,
          phone_number: data.phoneNumber,
        },
      ]);

      if (error) throw error;
      return { name: data.userName };
    };

    toast.promise(submission(), {
      loading: "جاري إرسال طلبك...",
      success: (data) => {
        form.reset();
        return `شكراً لك يا ${data.name}، تم استلام طلبك بنجاح!`;
      },
      error: "عذراً، حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
      finally: () => setIsSubmitting(false),
    });
  }

  return (
    <section
      id="contact"
      className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5BC5C4]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#5A4B9A]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <MotionWrapper direction="right">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E3A5F] mb-4">
                سجل الآن
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-[#5A4B9A] mb-6">
                في برنامج التمكين الريادي
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                انضم إلى البرنامج وابدأ رحلتك في تحويل جمعيتك إلى شركة ناشئة
                مستدامة. فريقنا سيتواصل معك لمناقشة التفاصيل.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <motion.div
                whileHover={{ x: -10 }}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <div className="w-12 h-12 bg-[#5BC5C4]/10 rounded-lg flex items-center justify-center text-[#5BC5C4]">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                  <p className="font-medium text-[#1E3A5F]">info@tamkeen.sa</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: -10 }}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <div className="w-12 h-12 bg-[#5A4B9A]/10 rounded-lg flex items-center justify-center text-[#5A4B9A]">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الهاتف</p>
                  <p className="font-medium text-[#1E3A5F]" dir="ltr">
                    +966 XX XXX XXXX
                  </p>
                </div>
              </motion.div>
            </div>
          </MotionWrapper>

          {/* Form */}
          <MotionWrapper direction="left" delay={0.2}>
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-10 border border-gray-100">
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
                        <FormLabel className="text-[#1E3A5F] font-medium text-lg">
                          الاسم الكريم
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل اسمك بالكامل"
                            className="h-14 rounded-2xl border-gray-200 focus:border-[#5BC5C4] focus:ring-[#5BC5C4] text-lg px-6"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#1E3A5F] font-medium text-lg">
                          رقم الهاتف
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+966 5X XXX XXXX"
                            className="h-14 rounded-2xl border-gray-200 focus:border-[#5BC5C4] focus:ring-[#5BC5C4] text-lg px-6"
                            dir="ltr"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 bg-[#5A4B9A] hover:bg-[#4A3D82] text-white text-xl font-bold rounded-2xl shadow-lg shadow-[#5A4B9A]/30 hover:shadow-xl hover:shadow-[#5A4B9A]/40 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      "إرسال الطلب"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
