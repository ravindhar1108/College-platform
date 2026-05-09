export type College = {
  id: number;
  name: string;
  location: string;
  ugFee: number;
  pgFee: number | null;
  rating: number;
  academicRating: number | null;
  accommodationRating: number | null;
  facultyRating: number | null;
  infrastructureRating: number | null;
  placementRating: number | null;
  socialLifeRating: number | null;
  description: string;
  image: string;
  courses: { name: string; duration: string; fees: number }[];
  reviews: { userName: string; avatar: string | null; rating: number; comment: string; date: string | null }[];
};

export const formatINR = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
};

export const colleges: College[] = []; // Empty now as we fetch from API
