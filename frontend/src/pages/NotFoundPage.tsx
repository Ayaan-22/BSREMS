import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return <div className="grid min-h-[50vh] place-items-center text-center"><div><h1 className="text-4xl font-bold">Not Found</h1><Link to="/"><Button className="mt-4">Return Home</Button></Link></div></div>;
}
