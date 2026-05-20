export type SellerProfile = {
  id: string;
  name: string;
  avatarUrl: string;
  listingStatus: string;
  rating: number;
  totalReviews: number;
  location: string;
  joinedDate: string;
  phoneNumber: string;
};

export type MessageItem = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
};

export type MiniListingCard = {
  slug: string;
  thumbnail: string;
  title: string;
  price: string;
  year: string;
};