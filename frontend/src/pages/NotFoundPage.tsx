import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-gradient font-display text-[9rem] italic leading-none md:text-[12rem]">404</p>
        <p className="mt-2 font-display text-3xl text-white">This address has no deed.</p>
        <p className="mt-3 text-muted">The page you’re looking for was never minted.</p>
        <Link to="/">
          <Button className="mt-8">
            <ArrowLeft className="h-4 w-4" /> Return home
          </Button>
        </Link>
      </div>
    </div>
  );
}
