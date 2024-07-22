import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User extends DefaultUser {
    id: string;
  }
}

export interface Location {
  street: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface Rates {
  nightly?: number;
  weekly: number;
  monthly: number;
}

export interface SellerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Property {
  _id: string;
  owner: string;
  name: string;
  type: string;
  description: string;
  location: Location;
  beds: number;
  baths: number;
  square_feet: number;
  amenities: string[];
  rates: Partial<Rates>;
  seller_info: SellerInfo;
  images: string[];
  is_featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessageProp {
  _id: string;
  body: string;
  createdAt: string;
  email: string;
  name: string;
  phone: string;
  property: {
    _id: string;
    name: string;
  };
  read: boolean;
  recipient: string;
  updatedAt: string;
  __v: number;
}

export interface PaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
}

export interface FieldsState {
  [key: string]: any;
  amenities: string[];
  type: string;
  description: string;
  name: string;
  location: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  beds: string;
  baths: string;
  square_feet: string;
  rates: {
    weekly: string;
    nightly: string;
    monthly: string;
  };
  seller_info: {
    name: string;
    email: string;
    phone: string;
  };
  images: File[];
}

export interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
  width: string;
  height: string;
}

export interface InfoBoxProps {
  heading: string;
  backgroundColor: string;
  textColor?: string;
  buttonInfo: {
    link: string;
    backgroundColor: string;
    text: string;
  };
  children: string;
}