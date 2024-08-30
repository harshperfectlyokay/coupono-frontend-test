import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import "./style.css";
import "../globals.css";
import { AuthProvider } from "../Providers";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="overflow-hidden">
          <AuthProvider>
            <Header />
            <div className="relative flex">
              <Sidebar />
              <main className="w-full min-h-screen py-5 px-4 overflow-auto">
              <Toaster />
                {children}
                </main>
            </div>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
