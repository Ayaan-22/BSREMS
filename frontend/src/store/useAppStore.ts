import { create } from "zustand";

type Filters = {
  search: string;
  status: string;
  listing: string;
  verifiedOnly: boolean;
  sort: string;
};

type AppState = {
  userRole: "user" | "verifier" | "arbiter" | "admin";
  filters: Filters;
  mapView: boolean;
  setRole: (role: AppState["userRole"]) => void;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setMapView: (mapView: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  userRole: "user",
  filters: { search: "", status: "Active", listing: "sale", verifiedOnly: false, sort: "newest" },
  mapView: false,
  setRole: (userRole) => set({ userRole }),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  setMapView: (mapView) => set({ mapView })
}));
