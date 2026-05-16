export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="landing-scroll landing-bg">{children}</div>;
}
