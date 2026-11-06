export type EscrowStatus = "Pending" | "Active" | "Completed" | "Disputed" | "Refunded" | "Cancelled";

export type Escrow = {
  escrowId: number;
  propertyId: number;
  buyer: string;
  seller: string;
  amount: string;
  status: EscrowStatus;
  deadline: number;
  buyerApproved: boolean;
  sellerApproved: boolean;
};
