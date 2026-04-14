import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-muted-foreground text-sm mb-2">Page not found</p>
        <h1 className="text-2xl font-semibold text-foreground mb-4">404</h1>
        <Link href="/dashboard">
          <span className="text-primary text-sm hover:underline cursor-pointer">
            Go to dashboard →
          </span>
        </Link>
      </div>
    </div>
  );
}
