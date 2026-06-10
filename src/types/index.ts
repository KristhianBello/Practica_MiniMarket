export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  category: string;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};
