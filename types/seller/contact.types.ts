export type SellerProfile = {
  id: string;
  name: string | null;
  avatarUrl: string;
  role:string;
  listingStatus: number;
  rating: number;
  totalReviews: number;
  location: string;
  joinedDate: string;
  phoneNumber:string |null;
};

export type SellerCars = {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;

  publishedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
  soldAt: string | null;
  archivedAt: string | null;
  updatedAt: string;
  rejectedAt: string | null;

  rejectionReason: string | null;
  adminFeedback: string | null;

  accidentHistory: boolean;
  bodyType: string;
  currency: string;
  drivetrain: string;
  featured: boolean;
  negotiable: boolean;
  serviceHistory: boolean;

  slug: string;
  thumbnail: string | null;
  views: number;
  color: string;
  fuelType: string;
  trim: string;
  doors: number | null;
  engineSize: string;
  engineCode: string | null;
  cylinders: number | null;
  horsePower: number;
  fuelCapacity: number;
  seatingCapacity: number | null;
  transmission: string;
  condition: string;
  status: string;

  city: string;
  country: string;
  state: string | null;
  description: string | null;

  userId: string;
  listingStatus: string;
};

export type MessageItem = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
};

export type MiniListingCard = {
  slug: string;
  thumbnail: string | null;
  title: string;
  price: number;
  year: number;
};