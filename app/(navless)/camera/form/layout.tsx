import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Camera Form",
  description: "Camera form interface",
};

export default function CameraFormLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="px-8 pt-9">
      {children}
    </div>
  );
}
