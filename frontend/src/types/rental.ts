export type RentalStatus = "Active" | "Completed" | "Terminated" | "Disputed";

export type Rental = {
  rentalId: number;
  propertyId: number;
  tenant: string;
  landlord: string;
  monthlyRent: string;
  deposit: string;
  startDate: number;
  endDate: number;
  status: RentalStatus;
};
