import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Audífonos Bluetooth',
    price: 25,
    description:
      'Audífonos inalámbricos con cancelación de ruido, batería de 20 horas y sonido estéreo de alta calidad.',
    image: require('@/image/audifonos_BT_JBL.jpg'),
    stock: 10,
    category: 'Audio',
    longDescription:
      'Ideales para estudio, trabajo remoto o uso diario. Incluyen estuche de carga y cable USB-C.',
    specifications: [
      { label: 'Conectividad', value: 'Bluetooth 5.0' },
      { label: 'Autonomía', value: 'Hasta 20 horas' },
      { label: 'Cancelación de ruido', value: 'Activa (ANC)' },
      { label: 'Peso', value: '250 g' },
    ],
  },
  {
    id: 2,
    name: 'Mouse inalámbrico',
    price: 15,
    description:
      'Mouse ergonómico con conexión Bluetooth, sensor óptico de precisión y batería recargable.',
    image: require('@/image/Tenz_Red_mouse_inalambric_G.jpg'),
    stock: 15,
    category: 'Periféricos',
    longDescription:
      'Diseño ambidiestro y acabado mate. Compatible con Windows, macOS, Android e iOS.',
    specifications: [
      { label: 'Conexión', value: 'Bluetooth / Receptor USB' },
      { label: 'DPI', value: '1600 ajustable' },
      { label: 'Botones', value: '3 + rueda de desplazamiento' },
      { label: 'Batería', value: 'Recargable, ~30 días' },
    ],
  },
  {
    id: 3,
    name: 'Teclado mecánico',
    price: 45,
    description:
      'Teclado mecánico RGB con switches táctiles, diseño compacto y retroiluminación personalizable.',
    image: require('@/image/teclado_inalambrico.jpeg'),
    stock: 8,
    category: 'Periféricos',
    longDescription:
      'Layout compacto de 87 teclas. Retroiluminación RGB con múltiples modos y memoria interna de perfiles.',
    specifications: [
      { label: 'Tipo de switch', value: 'Mecánico táctil' },
      { label: 'Retroiluminación', value: 'RGB 16.8M colores' },
      { label: 'Conexión', value: 'USB-C / Inalámbrico 2.4 GHz' },
      { label: 'Layout', value: 'TKL (87 teclas)' },
    ],
  },
  {
    id: 4,
    name: 'Cargador USB-C',
    price: 12,
    description:
      'Cargador rápido de 65W con puerto USB-C, compatible con smartphones, tablets y laptops.',
    image: require('@/image/cable_usb_c.jpg'),
    stock: 20,
    category: 'Accesorios',
    longDescription:
      'Carga rápida con protección contra sobrecorriente, sobrecalentamiento y cortocircuito.',
    specifications: [
      { label: 'Potencia', value: '65W PD' },
      { label: 'Puerto', value: 'USB-C' },
      { label: 'Entrada', value: '100–240V' },
      { label: 'Compatibilidad', value: 'Smartphones, tablets, laptops' },
    ],
  },
  {
    id: 5,
    name: 'Soporte para celular',
    price: 18,
    description:
      'Soporte ajustable de escritorio para smartphone, base antideslizante y ángulo regulable.',
    image: require('@/image/soporte_celular.jpg'),
    stock: 12,
    category: 'Accesorios',
    longDescription:
      'Permite usar el teléfono en vertical u horizontal. Base estable con goma antideslizante.',
    specifications: [
      { label: 'Material', value: 'Aluminio + silicona' },
      { label: 'Ángulo', value: 'Ajustable 15°–85°' },
      { label: 'Compatibilidad', value: 'Smartphones 4"–7"' },
      { label: 'Peso máximo', value: '300 g' },
    ],
  },
];

export const categories = ['Todas', ...Array.from(new Set(products.map((p) => p.category)))];

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}
