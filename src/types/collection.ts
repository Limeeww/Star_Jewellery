import { Timestamp } from "firebase/firestore";

export interface Collection {
    id: number;
    name: string;
    description: string;
    images: string[];
    parentCategory: number;
    isActive: boolean;
    createdAt: Timestamp;
  }