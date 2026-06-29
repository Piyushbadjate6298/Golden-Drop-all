import { Button } from "@/components/ui/Button";
import { Seo } from "@/components/seo/Seo";

type PageProps = {
  navigate: (path: string) => void;
};

export function NotFoundPage({ navigate }: PageProps) {
  return (
    <div className="mx-auto max-w-2xl pb-12 text-center">
      <Seo
        description="The requested Golden Drop page was not found."
        path="/404"
        title="Page Not Found"
      />
      <h1>Page Not Found</h1>
      <p className="mt-4">The page you opened is not part of this React app.</p>
      <Button className="mt-6" onClick={() => navigate("/home")}>
        Go Home
      </Button>
    </div>
  );
}
