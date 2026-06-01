export type CoatType = 'short' | 'medium' | 'long' | 'curly';
export type ServiceLevel = 'basic' | 'intermediate' | 'premium';
export type Tool = 'scissors' | 'machine' | 'both';

export interface PriceBySize {
  small: number;
  medium: number;
  large: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  coatTypes: CoatType[];
  prices: PriceBySize;
  includes: string[];
  duration: number;
  image: string;
  level: ServiceLevel;
  active: boolean;
}

export interface Cut {
  id: string;
  name: string;
  description: string;
  prices: PriceBySize;
  image: string;
  tools: Tool;
  duration: number;
  level: ServiceLevel;
}

export interface Extra {
  id: string;
  name: string;
  description: string;
  prices: PriceBySize;
}

export interface Breed {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  coatType: CoatType;
  cuts: Cut[];
  extras: Extra[];
}

export interface CatalogData {
  services: Service[];
  breeds: Breed[];
}
