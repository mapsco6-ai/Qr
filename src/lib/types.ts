export interface CategoryDto {
  id: string;
  name: string;
  order: number;
}

export interface MenuItemDto {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  categoryId: string;
  category: CategoryDto;
  productCost: number;
  saladCost: number;
  oldPrice: number;
  newPrice: number;
  isOffer: boolean;
  offerNote: string | null;
  isNew: boolean;
  active: boolean;
  order: number;
}

export interface ReviewDto {
  id: string;
  customerName: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  menuItemId: string | null;
  menuItem?: { name: string } | null;
  createdAt: string;
}

export interface SettingsDto {
  siteName: string;
  tagline: string;
  logoUrl: string | null;
}

export interface ComplaintDto {
  id: string;
  customerName: string;
  phone: string | null;
  message: string;
  status: "new" | "in_progress" | "resolved";
  createdAt: string;
}
