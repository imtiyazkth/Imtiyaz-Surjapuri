export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;      // hex — used in badges
  icon?: string;      // emoji or icon name
  order: number;
  visible: boolean;
  count?: number;     // denormalised article count
}
