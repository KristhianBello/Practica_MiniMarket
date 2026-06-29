import { Product } from '@/types';

export type ApiProduct = {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
  descripcion: string;
  detalle?: string;
  integrante?: string;
  imageKey?: string;
};

export type CreateProductInput = {
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
  integrante: string;
};

const DEFAULT_BASE_URL = 'http://192.168.10.110:3001';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? DEFAULT_BASE_URL;

export const PRODUCTS_ENDPOINT = `${API_BASE_URL}/productos`;

const productImages = {
  audifonos: require('@/image/audifonos_BT_JBL.jpg'),
  mouse: require('@/image/Tenz_Red_mouse_inalambric_G.jpg'),
  teclado: require('@/image/teclado_inalambrico.jpeg'),
  cargador: require('@/image/cable_usb_c.jpg'),
  soporte: require('@/image/soporte_celular.jpg'),
};

export function getProductImage(imageKey?: string) {
  if (imageKey && imageKey in productImages) {
    return productImages[imageKey as keyof typeof productImages];
  }

  return productImages.soporte;
}

function toProduct(apiProduct: ApiProduct): Product {
  return {
    id: Number(apiProduct.id),
    name: apiProduct.nombre,
    price: Number(apiProduct.precio),
    description: apiProduct.descripcion,
    image: getProductImage(apiProduct.imageKey),
    imageKey: apiProduct.imageKey,
    stock: Number(apiProduct.stock),
    category: apiProduct.categoria,
    integrante: apiProduct.integrante,
    longDescription: apiProduct.detalle,
    specifications: [
      { label: 'Categoria', value: apiProduct.categoria },
      { label: 'Stock', value: `${apiProduct.stock} unidades` },
      { label: 'Integrante', value: apiProduct.integrante ?? 'Equipo MiniMarket' },
    ],
  };
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_ENDPOINT);
  const data = await parseJsonResponse<ApiProduct[]>(response);
  return data.map(toProduct);
}

export async function fetchProductById(id: number): Promise<Product> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`);
  const data = await parseJsonResponse<ApiProduct>(response);
  return toProduct(data);
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const newProduct: ApiProduct = {
    id: Date.now(),
    nombre: input.nombre.trim(),
    precio: input.precio,
    categoria: input.categoria.trim() || 'Nuevo',
    stock: input.stock,
    descripcion: `Producto agregado desde la app por ${input.integrante}.`,
    detalle: 'Registro creado con una solicitud POST hacia la API propia JSON Server.',
    integrante: input.integrante,
    imageKey: 'soporte',
  };

  const response = await fetch(PRODUCTS_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct),
  });

  const data = await parseJsonResponse<ApiProduct>(response);
  return toProduct(data);
}

export function getCategories(products: Product[]) {
  return ['Todas', ...Array.from(new Set(products.map((p) => p.category)))];
}
