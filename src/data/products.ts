import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Audífonos Bluetooth',
    price: 25,
    description:
      'Audífonos inalámbricos con cancelación de ruido, batería de 20 horas y sonido estéreo de alta calidad.',
    image: 'https://picsum.photos/seed/headphones/400/400',
    stock: 10,
    category: 'Audio',
  },
  {
    id: 2,
    name: 'Mouse inalámbrico',
    price: 15,
    description:
      'Mouse ergonómico con conexión Bluetooth, sensor óptico de precisión y batería recargable.',
    image: 'https://picsum.photos/seed/mouse/400/400',
    stock: 15,
    category: 'Periféricos',
  },
  {
    id: 3,
    name: 'Teclado mecánico',
    price: 45,
    description:
      'Teclado mecánico RGB con switches táctiles, diseño compacto y retroiluminación personalizable.',
    image: 'https://picsum.photos/seed/keyboard/400/400',
    stock: 8,
    category: 'Periféricos',
  },
  {
    id: 4,
    name: 'Cargador USB-C',
    price: 12,
    description:
      'Cargador rápido de 65W con puerto USB-C, compatible con smartphones, tablets y laptops.',
    image: 'https://picsum.photos/seed/charger/400/400',
    stock: 20,
    category: 'Accesorios',
  },
  {
    id: 5,
    name: 'Soporte para celular',
    price: 18,
    description:
      'Soporte ajustable de escritorio para smartphone, base antideslizante y ángulo regulable.',
    image: 'https://picsum.photos/seed/stand/400/400',
    stock: 12,
    category: 'Accesorios',
  },
];

export const categories = ['Todas', ...Array.from(new Set(products.map((p) => p.category)))];

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}
