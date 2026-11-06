import { Button } from "../ui/Button";

export function RentalForm() {
  return <div className="grid gap-3"><input className="rounded bg-background p-3" placeholder="Monthly rent ETH" /><input className="rounded bg-background p-3" placeholder="Deposit ETH" /><Button>Create Rental</Button></div>;
}
