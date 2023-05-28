import Providers from "@/components/Providers";
import "./globals.css";

export const metadata = {
  title: "Simple Chat App",
  description: "This is a simple chat app",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
