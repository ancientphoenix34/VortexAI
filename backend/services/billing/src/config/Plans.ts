export interface Plan {
  id: string;
  name: string;
  amount: number;
  credits: number;
  validity: number;
}

export const PLANS: Record<string, Plan> = {
  free: {
    id: "free",
    name: "Free",
    amount: 0,
    credits: 100,
    validity: 30,
  },
  starter: {
    id: "starter",
    name: "Starter",
    amount: 199,
    credits: 500,
    validity: 30,
  },
  pro: {
    id: "pro",
    name: "Pro",
    amount: 499,
    credits: 1000,
    validity: 30,
  },
};
