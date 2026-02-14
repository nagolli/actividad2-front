export interface Review {
  productId: number;
  email: string | null;
  rating: number;
  review: string;
  user: { id?: number; name?: string } | null;
}
