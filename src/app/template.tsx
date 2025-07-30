
"use client";

// The template file is re-rendered on every navigation.
// It's a good place for animations or effects that should run on page changes.
// We keep it simple here.
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
