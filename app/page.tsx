"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell,
  Clock,
  Users,
  Trophy,
  ArrowLeft,
  Phone,
  MapPin,
  Instagram,
  Calendar as CalendarIcon,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import Image from 'next/image';

// Navigation Component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass border-b border-white/10' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-20 h-20 relative">
                <Image
                  src="/TVM_Logo.png"
                  alt="Venue Men Logo"
                  fill
                  sizes="(max-width: 768px) 80px, 80px"
                  className="object-contain"
                />
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'الرئيسية', id: 'hero' },
                { label: 'خدماتنا', id: 'features' },
                { label: 'المرافق', id: 'facilities' },
                { label: 'من نحن', id: 'about' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-beige/70 hover:text-beige transition-colors text-sm font-light tracking-wide"
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection('booking')}
                variant="luxury"
                className="px-6"
              >
                احجز الآن
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-beige"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-neutral-black/95 backdrop-blur-lg pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {[
                { label: 'الرئيسية', id: 'hero' },
                { label: 'خدماتنا', id: 'features' },
                { label: 'المرافق', id: 'facilities' },
                { label: 'من نحن', id: 'about' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-beige text-2xl font-light text-right py-3 border-b border-white/10"
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection('booking')}
                variant="luxury"
                className="w-full mt-4 py-6"
              >
                احجز الآن
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Sticky Contact Button Component
function StickyContactButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <Button
            onClick={scrollToBooking}
            variant="luxury"
            className="shadow-2xl shadow-beige/20 h-14 px-8 flex items-center gap-3 font-medium group hover:-translate-y-1"
          >
            <span className="text-lg">احجز جلستك</span>
            <div className="w-8 h-8 rounded-none bg-neutral-black/10 flex items-center justify-center group-hover:bg-neutral-black/20 transition-colors">
              <ArrowLeft size={18} />
            </div>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hero Section with Booking Form
function HeroSection() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    bookingDate: undefined as Date | undefined,
    bookingTime: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.phone) {
      setIsSubmitting(true);
      console.log('Pushing lead step 1...', formData);
      try {
        const brandId = process.env.NEXT_PUBLIC_BRAND_ID;

        if (!brandId) {
          console.error('CRITICAL: NEXT_PUBLIC_BRAND_ID is not defined in environment variables');
        }

        const { data, error } = await supabase
          .from('leads')
          .insert([
            {
              full_name: formData.fullName,
              phone_number: formData.phone,
              brand_id: brandId,
              website_source: 'thevenuemen.com',
              form_code: 'TVM_HERO_V1_STEP1',
              status: 'New',
              metadata: {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              }
            }
          ])
          .select()
          .single();

        if (error) {
          console.error('Supabase error step 1:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          // If it fails (e.g. no select policy), we still proceed to step 2- 
          // we'll just do a fresh insert in step 2 instead of an update.
        }

        if (data) {
          console.log('Lead created with ID:', data.id);
          setLeadId(data.id);
        }

        // --- Meta Pixel: Double-Layer Lead Tracking ---
        const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
        if (pixelId) {
          // 1. Standard JS Trigger
          if (typeof window !== 'undefined' && window.fbq) {
            console.log('Meta Pixel: Triggering Lead event (JS)');
            window.fbq('track', 'Lead', {
              content_name: 'Hero Form Step 1',
              status: 'Submitted'
            });
          }

          // 2. Dynamic Image Pixel Fallback (Bulletproof for SPAs)
          if (typeof document !== 'undefined') {
            const img = document.createElement('img');
            img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=Lead&noscript=1&ts=${Date.now()}`;
            img.width = 1;
            img.height = 1;
            img.style.display = 'none';
            document.body.appendChild(img);
            console.log('Meta Pixel: Triggering Lead event (Image Fallback)');

            // Cleanup after a delay
            setTimeout(() => {
              if (img.parentNode) document.body.removeChild(img);
            }, 2000);
          }
        }

        setStep(2);
      } catch (err) {
        console.error('Unexpected error step 1:', err);
        setStep(2);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.phone && formData.bookingDate && formData.bookingTime) {
      setIsSubmitting(true);
      console.log('Submitting booking...', { ...formData, leadId });
      try {
        const brandId = process.env.NEXT_PUBLIC_BRAND_ID;

        if (leadId) {
          // Update existing lead
          const { error } = await supabase
            .from('leads')
            .update({
              full_name: formData.fullName,
              phone_number: formData.phone,
              form_code: 'booking',
              metadata: {
                booking_date: format(formData.bookingDate, 'yyyy-MM-dd'),
                booking_time: formData.bookingTime,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              }
            })
            .eq('id', leadId);

          if (error) {
            console.error('Supabase update error:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            throw error;
          }
        } else {
          // Fallback: Create new lead if step 1 failed or didn't return an ID
          const { error } = await supabase
            .from('leads')
            .insert([
              {
                full_name: formData.fullName,
                phone_number: formData.phone,
                brand_id: brandId,
                website_source: 'thevenuemen.com',
                form_code: 'booking',
                status: 'New',
                metadata: {
                  booking_date: format(formData.bookingDate, 'yyyy-MM-dd'),
                  booking_time: formData.bookingTime,
                  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                }
              }
            ]);

          if (error) {
            console.error('Supabase fallback insert error:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            throw error;
          }
        }

        setShowSuccess(true);
      } catch (err) {
        console.error('Unexpected error during booking:', err);
        alert('حدث خطأ أثناء تأكيد حجزك. يرجى التحاولة مرة أخرى.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/gallery/gym inside.JPG"
          alt="Luxury Gym"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-neutral-black via-neutral-black/80 to-neutral-black/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-right order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-none border border-beige/30 mb-6"
            >
              <span className="w-2 h-2 rounded-none bg-beige animate-pulse" />
              <span className="text-beige/80 text-sm">نادي الرجال الصحي الأكثر تميزاً في قطر</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extralight text-beige leading-tight mb-6"
            >
              اكتشف <span className="text-gradient-copper">طريقة حياتك</span>
              <br />
              مع فينيو
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-beige/70 text-lg md:text-xl font-light leading-relaxed mb-8 max-w-xl mr-auto"
            >
              نقدم تجربة لياقة عالمية المستوى مع أحدث المرافق والمدربين الشخصيين
              لمساعدتك في تحقيق أهدافك الصحية والرياضية
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-end"
            >
              <div className="flex items-center gap-3 text-beige/60">
                <span className="text-sm">مفتوح 24/7</span>
                <Clock size={18} />
              </div>
              <div className="flex items-center gap-3 text-beige/60">
                <span className="text-sm">مدربون معتمدون</span>
                <Trophy size={18} />
              </div>
              <div className="flex items-center gap-3 text-beige/60">
                <span className="text-sm">مجتمع رياضي</span>
                <Users size={18} />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-1 lg:order-2"
            id="booking"
          >
            <div className="bg-neutral-black/60 backdrop-blur-xl border border-beige/20 rounded-none p-8">
              <div className="text-right mb-8">
                <h2 className="text-2xl font-light text-beige mb-2">احجز جلستك الآن</h2>
                <p className="text-beige/60 text-sm">املأ بياناتك وسنتواصل معك لتأكيد الحجز</p>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.form
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleNextStep}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-beige/80 text-right block">
                        الاسم الكامل
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="أدخل اسمك الكامل"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="bg-white/5 border-beige/20 text-beige placeholder:text-beige/40 text-right h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-beige/80 text-right block">
                        رقم الهاتف
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="مثال: 55123456"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-white/5 border-beige/20 text-beige placeholder:text-beige/40 text-right h-12"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="luxury"
                      disabled={isSubmitting}
                      className="w-full h-14 text-lg font-medium hover:shadow-glow"
                    >
                      {isSubmitting ? 'جاري التحميل...' : 'التالي: اختيار الموعد'}
                      {!isSubmitting && <ArrowLeft className="mr-2" size={20} />}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label className="text-beige/80 text-right block">
                        تاريخ الحجز
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={`w-full bg-white/5 border-beige/20 text-beige h-12 text-right justify-between font-normal ${!formData.bookingDate && "text-beige/40"}`}
                          >
                            <CalendarIcon size={18} className="text-beige/40" />
                            {formData.bookingDate ? (
                              format(formData.bookingDate, "PPP", { locale: ar })
                            ) : (
                              <span>اختر التاريخ</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[100] shadow-glow border-beige/20" align="center">
                          <div className="bg-neutral-black p-1">
                            <Calendar
                              mode="single"
                              selected={formData.bookingDate}
                              onSelect={(date) => setFormData({ ...formData, bookingDate: date })}
                              initialFocus
                              locale={ar}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bookingTime" className="text-beige/80 text-right block">
                        وقت الحجز المفضل
                      </Label>
                      <Select
                        value={formData.bookingTime}
                        onValueChange={(value) => setFormData({ ...formData, bookingTime: value })}
                      >
                        <SelectTrigger className="bg-white/5 border-beige/20 text-beige h-12 text-right">
                          <SelectValue placeholder="اختر وقت الحجز" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-black border-beige/20">
                          <SelectItem value="morning">صباحاً (6:00 - 12:00)</SelectItem>
                          <SelectItem value="afternoon">ظهراً (12:00 - 16:00)</SelectItem>
                          <SelectItem value="evening">مساءً (16:00 - 22:00)</SelectItem>
                          <SelectItem value="night">ليلاً (22:00 - 24:00)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep(1)}
                        className="flex-1 text-beige hover:bg-white/5 h-14"
                      >
                        السابق
                      </Button>
                      <Button
                        type="submit"
                        variant="luxury"
                        disabled={!formData.bookingDate || !formData.bookingTime || isSubmitting}
                        className="flex-[2] h-14 text-lg font-medium hover:shadow-glow"
                      >
                        {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الحجز'}
                        {!isSubmitting && <ArrowLeft className="mr-2" size={20} />}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <p className="text-beige/40 text-xs text-center mt-6">
                بالحجز، أنت توافق على شروط الخدمة وسياسة الخصوصية
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-neutral-black border-beige/20 text-right">
          <DialogHeader>
            <DialogTitle className="text-beige text-center text-2xl font-light">
              تم استلام طلبك بنجاح
            </DialogTitle>
            <DialogDescription className="text-beige/50 text-center text-sm sr-only">
              تم استلام طلب الحجز الخاص بك وسنقوم بالتواصل معك قريباً.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 rounded-none bg-beige/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="text-beige" size={32} />
            </div>
            <p className="text-beige/70 text-center mb-2">
              شكراً {formData.fullName} على اختيارك فينيو
            </p>
            <p className="text-beige/50 text-center text-sm">
              سنتواصل معك على الرقم {formData.phone} لتأكيد موعدك
              {formData.bookingDate && (
                <> بتاريخ {format(formData.bookingDate, "PPP", { locale: ar })}</>
              )}
            </p>
          </div>
          <Button
            onClick={() => setShowSuccess(false)}
            className="w-full bg-beige text-neutral-black hover:bg-beige-light"
          >
            حسناً
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Dumbbell,
      title: 'أحدث المعدات',
      description: 'نوفر أحدث المعدات الرياضية العالمية لتدريب احترافي',
    },
    {
      icon: Users,
      title: 'مدربون معتمدون',
      description: 'فريق من المدربين المعتمدين دولياً لمساعدتك في رحلتك',
    },
    {
      icon: Clock,
      title: 'مفتوح 24/7',
      description: 'مرافقنا متاحة على مدار الساعة لتناسب جدولك',
    },
    {
      icon: Trophy,
      title: 'برامج متخصصة',
      description: 'برامج تدريبية مخصصة حسب أهدافك ومستواك',
    },
  ];

  return (
    <section id="features" className="py-24 bg-neutral-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-right mb-16"
        >
          <span className="text-copper text-sm tracking-widest mb-4 block">خدماتنا</span>
          <h2 className="text-3xl md:text-4xl font-light text-beige mb-4">
            لماذا تختار <span className="text-gradient-copper">فينيو</span>
          </h2>
          <p className="text-beige/60 max-w-2xl mr-auto">
            نقدم تجربة فريدة تجمع بين الفخامة والاحترافية لتحقيق أهدافك الصحية
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white/5 border border-beige/10 rounded-none p-6 h-full transition-all duration-300 group-hover:border-beige/30 group-hover:bg-white/10">
                <div className="w-12 h-12 rounded-none bg-beige/10 flex items-center justify-center mb-4 group-hover:bg-beige/20 transition-colors">
                  <feature.icon className="text-beige" size={24} />
                </div>
                <h3 className="text-beige text-xl font-light mb-3">{feature.title}</h3>
                <p className="text-beige/60 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Facilities Gallery Section
function FacilitiesSection() {
  const facilities = [
    {
      image: '/gallery/man doing squate.JPG',
      title: 'صالة الأوزان الحرة',
    },
    {
      image: '/gallery/man doing cardio.JPG',
      title: 'منطقة الكارديو',
    },
    {
      image: '/gallery/man swimming.JPG',
      title: 'مسبح شبه أولمبي',
    },
    {
      image: '/gallery/man in sauna.JPG',
      title: 'الساونا والبخار',
    },
  ];

  return (
    <section id="facilities" className="py-24 bg-neutral-black-light relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-right mb-16"
        >
          <span className="text-copper text-sm tracking-widest mb-4 block">مرافقنا</span>
          <h2 className="text-3xl md:text-4xl font-light text-beige mb-4">
            استكشف <span className="text-gradient-copper">مرافقنا</span>
          </h2>
          <p className="text-beige/60 max-w-2xl mr-auto">
            نقدم لك مرافق عالمية المستوى مصممة خصيصاً لراحتك وتحقيق أهدافك
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-none aspect-[4/3]"
            >
              <Image
                src={facility.image}
                alt={facility.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-black via-neutral-black/20 to-transparent" />
              <div className="absolute bottom-0 right-0 p-6">
                <h3 className="text-beige text-xl font-light">{facility.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  return (
    <section id="about" className="py-24 bg-neutral-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-beige rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-copper rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 text-right"
          >
            <span className="text-copper text-sm tracking-widest mb-4 block">من نحن</span>
            <h2 className="text-3xl md:text-4xl font-light text-beige mb-6">
              <span className="text-gradient-copper">بيت الرياضيين</span>
            </h2>
            <div className="space-y-4 text-beige/70 leading-relaxed">
              <p>
                فينيو هو نادي الرجال الصحي الأكثر تميزاً في قطر، ملتزمون بتقديم تجربة لياقة
                عالمية المستوى تركز على النتائج والابتكار والعافية.
              </p>
              <p>
                نؤمن بأن احتياجات وأهداف كل فرد تتغير باستمرار، ولذلك نسعى دائماً لإيجاد
                طرق جديدة لتحسين وتعزيز تجربة اللياقة البدنية لأعضائنا.
              </p>
              <p>
                المجتمع هو ما يميز أي منشأة رياضية. بناء مجتمع من الرجال ذوي التفكير المماثل
                الذين يدعمون ويشجعون بعضهم البعض في رحلاتهم الرياضية هو أحد الأهداف الرئيسية
                وقيمنا الأساسية.
              </p>
            </div>

            <div className="flex gap-8 mt-8 justify-end">
              <div className="text-center">
                <div className="text-3xl font-light text-gradient-copper">10+</div>
                <div className="text-beige/60 text-sm">سنوات خبرة</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-gradient-copper">5000+</div>
                <div className="text-beige/60 text-sm">عضو نشط</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-gradient-copper">50+</div>
                <div className="text-beige/60 text-sm">مدرب معتمد</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/gallery/qatari heading to the venue men from outside.JPG"
                alt="Personal Training"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover rounded-none"
              />
              <div className="absolute -bottom-6 -left-6 bg-neutral-black border border-beige/20 rounded-none p-6 max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-none bg-beige/20 flex items-center justify-center">
                    <Trophy className="text-beige" size={20} />
                  </div>
                  <div>
                    <div className="text-beige font-light">الأكثر تميزاً</div>
                    <div className="text-beige/60 text-sm">في قطر</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-neutral-black-dark border-t border-beige/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-32 h-32 relative">
                <Image
                  src="/TVM_Logo.png"
                  alt="Venue Men Logo"
                  fill
                  sizes="(max-width: 768px) 128px, 128px"
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-beige/60 text-sm leading-relaxed max-w-md">
              نادي الرجال الصحي الأكثر تميزاً في قطر، نقدم تجربة لياقة عالمية المستوى
              مع أحدث المرافق والمدربين الشخصيين.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-beige font-light mb-4">روابط سريعة</h4>
            <ul className="space-y-3">
              {['الرئيسية', 'خدماتنا', 'المرافق', 'من نحن', 'احجز الآن'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-beige/60 hover:text-beige transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-beige font-light mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-beige/60 text-sm">
                <Phone size={16} />
                <span>3339-9847</span>
              </li>
              <li className="flex items-center gap-3 text-beige/60 text-sm">
                <MapPin size={16} />
                <span>شارع جامعة الدول العربية، الدحيل، الدوحة، قطر</span>
              </li>
              <li className="flex items-center gap-3 text-beige/60 text-sm">
                <CalendarIcon size={16} />
                <span>مفتوح 24/7</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/thevenuemen/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-none bg-beige/10 flex items-center justify-center hover:bg-beige/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="text-beige" size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-beige/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-beige/40 text-sm">
            © 2024 فينيو. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-beige/40 hover:text-beige/60 transition-colors text-sm">
              شروط الخدمة
            </a>
            <a href="#" className="text-beige/40 hover:text-beige/60 transition-colors text-sm">
              سياسة الخصوصية
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main App component becomes Home page
export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-black">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <FacilitiesSection />
        <AboutSection />
      </main>
      <StickyContactButton />
      <Footer />
    </div>
  );
}
