import { ImageSource } from 'expo-image';

export type ProductSpecification = {
  label: string;
  value: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: ImageSource;
  stock: number;
  category: string;
  /** Descripción extendida para la sección "Detalles del producto" */
  longDescription?: string;
  /** Especificaciones técnicas (label / value) */
  specifications?: ProductSpecification[];
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};
