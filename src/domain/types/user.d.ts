interface User {
  id: number;
  name: string;
  email: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripeSubscriptionStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
