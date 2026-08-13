interface NavHeaderProps {
  title: string;
  subtitle: string;
}

export default function NavHeader({ title, subtitle }: NavHeaderProps) {
  return (
    <header className="nav-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
