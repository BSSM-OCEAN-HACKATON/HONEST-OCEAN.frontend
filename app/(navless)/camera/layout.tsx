import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Camera",
  description: "Camera interface",
};

export default function CameraLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto min-h-screen flex flex-col bg-white" style={{ maxWidth: 'var(--max-width-mobile)' }}>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
