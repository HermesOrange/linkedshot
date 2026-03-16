export type OrderStatus = 'pending' | 'processing' | 'completed' | 'refunded';

export interface Order {
  id: string;
  email: string;
  package: 'basic' | 'pro';
  addons: {
    linkedinBanner: boolean;
    rushDelivery: boolean;
  };
  total: number;
  status: OrderStatus;
  createdAt: string;
  photoCount: number;
  photos: string[]; // base64 or file paths
  resultPhotos: string[];
  stripePaymentId?: string;
  notes?: string;
}

export interface PackageOption {
  id: 'basic' | 'pro';
  name: string;
  price: number;
  photoCount: number;
  turnaround: string;
  features: string[];
  popular?: boolean;
}

export interface Addon {
  id: 'linkedinBanner' | 'rushDelivery';
  name: string;
  description: string;
  price: number;
}

export interface UploadSession {
  photos: string[];
  package?: 'basic' | 'pro';
  addons?: {
    linkedinBanner: boolean;
    rushDelivery: boolean;
  };
  email?: string;
}
