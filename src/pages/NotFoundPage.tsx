import { Button } from "@/components/ui/Button";

type PageProps = {
  navigate: (path: string) => void;
};

export function NotFoundPage({ navigate }: PageProps) {
  return (
    <div className="mx-auto max-w-2xl pb-12 text-center">
      <h1>Page Not Found</h1>
      <p className="mt-4">The page you opened is not part of this React app.</p>
      <Button className="mt-6" onClick={() => navigate("/")}>
        Go Home
      </Button>
    </div>
  );
}
