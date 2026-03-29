import type { Metadata } from "next";
import Header from "@/components/header";
import Main from "@/components/main";
import Footer from "@/components/footer";
import '@/styles/global.scss';

export const metadata: Metadata = {
  title: 'Lenny Peters — Web Engineer',
  description: 'Web Engineer crafting fast, accessible, and beautiful web experiences.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Main>
          {children}
        </Main>
        <Footer/>
      </body>
    </html>
  );
}
