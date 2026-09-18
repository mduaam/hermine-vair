import React from 'react';

export const metadata = {
  title: "L'Hermine et le Vair Studio",
  description: "Sanity Studio content management",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
