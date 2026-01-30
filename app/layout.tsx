import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import FacebookPixel from "@/components/FacebookPixel";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "فينيو - نادي الرجال الصحي الأكثر تميزاً في قطر",
  description: "فينيو هو نادي الرجال الصحي الأكثر تميزاً في قطر، يقدم تجربة لياقة عالمية المستوى مع أحدث المرافق والمدربين الشخصيين",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${tajawal.variable} font-sans antialiased bg-background text-foreground`} suppressHydrationWarning>
        <FacebookPixel />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
