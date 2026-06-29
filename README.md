# MiniMarket App

## Adaptacion Tema 3.2 - Consumo de servicios web propios

Este proyecto fue adaptado para cumplir el trabajo academico asincronico de la Unidad 3, Tema 3.2: Consumo de Servicios Web Propios.

**Integrantes**

- Cardenas Ávila Emilio Sleimen
- Anthony Axel Mejia Ordoñez
- Michael Agustin Intriago Benitez
- Kristhian Augusto Bello Soledispa

**API propia**

- Carpeta: `api-productos`
- Recurso principal: `productos`
- Archivo de datos: `api-productos/db.json`
- Endpoint base: `http://localhost:3001/productos`
- En celular fisico usar la IP de la computadora, por ejemplo: `http://192.168.1.10:3001/productos`

**Comandos**

```bash
npm run api:install
npm run api
npm start
```

Si se prueba en un celular fisico con Expo Go, iniciar la app indicando la URL real de la computadora:

```bash
EXPO_PUBLIC_API_URL=http://IP_DE_LA_COMPUTADORA:3001 npm start
```

**Cumplimiento del Tema 3.2**

- `GET /productos`: el catalogo carga los productos desde JSON Server.
- `GET /productos/:id`: el detalle consulta un producto especifico.
- `POST /productos`: el formulario del catalogo registra nuevos productos.
- Manejo de carga: `ActivityIndicator` mientras se consulta la API.
- Manejo de error: mensaje visible si JSON Server no esta activo o la URL es incorrecta.
- Actualizacion de datos: pull-to-refresh en el catalogo.
- Productos propios: `db.json` incluye productos aportados por los integrantes.

---

**Gestión de estado global en una aplicación móvil híbrida de carrito de compras**

Aplicación móvil híbrida desarrollada con React Native y Expo que simula una mini tienda. El objetivo principal no es replicar un e-commerce completo, sino demostrar cómo gestionar **estado compartido entre pantallas**, con persistencia local y sincronización en tiempo real del carrito de compras.

---

## Objetivos

### Objetivo general

Desarrollar una aplicación móvil híbrida que permita gestionar un carrito de compras mediante estado global, demostrando la actualización, persistencia y sincronización de datos entre diferentes pantallas.

### Objetivos específicos

- Crear un catálogo de productos.
- Implementar un estado global para el carrito.
- Permitir agregar, eliminar y modificar cantidades.
- Calcular subtotales y total de compra.
- Persistir el estado del carrito localmente.
- Demostrar la navegación entre pantallas manteniendo los datos.

---

## Stack tecnológico

| Tecnología | Uso |
|------------|-----|
| [Expo SDK 56](https://expo.dev) | Framework y tooling |
| [React Native](https://reactnative.dev) | UI móvil híbrida |
| [Expo Router](https://docs.expo.dev/router/introduction/) | Navegación basada en archivos |
| [Context API](https://react.dev/reference/react/createContext) | Estado global del carrito |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Persistencia local |
| [react-native-toast-message](https://github.com/calintamas/react-native-toast-message) | Notificaciones al usuario |
| TypeScript | Tipado estático |

---

## Funcionalidades

- Catálogo de productos con imagen, nombre, precio y botón de agregar.
- Detalle de producto con descripción y stock disponible.
- Carrito con cantidades, subtotales, total y opción de vaciar.
- Resumen de compra con confirmación y limpieza del carrito.
- Filtro por categorías (Todas, Audio, Periféricos, Accesorios).
- Validación de stock al agregar o incrementar cantidades.
- Badge en el tab del carrito con el número total de unidades.
- Toast de confirmación al agregar productos y al completar la compra.
- Persistencia del carrito al cerrar y reabrir la app.

---

## Estructura del proyecto

```
Practica_MiniMarket/
├── src/
│   ├── app/                      # Pantallas (Expo Router)
│   │   ├── _layout.tsx           # Stack raíz + CartProvider + Toast
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx       # Tabs: Catálogo y Carrito (con badge)
│   │   │   ├── index.tsx         # Catálogo
│   │   │   └── cart.tsx          # Carrito
│   │   ├── product/[id].tsx      # Detalle del producto
│   │   └── checkout.tsx          # Resumen de compra
│   ├── components/               # Componentes reutilizables
│   │   ├── ProductCard.tsx
│   │   ├── CartItem.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── EmptyState.tsx
│   ├── context/
│   │   └── CartContext.tsx       # Estado global del carrito
│   ├── data/
│   │   └── products.ts           # Catálogo mock
│   ├── types/
│   │   └── index.ts              # Tipos Product y CartItem
│   └── utils/
│       └── cartHelpers.ts        # getTotal, getItemCount
├── assets/                       # Imágenes e iconos
├── app.json                      # Configuración Expo
└── package.json
```

---

## Gestión de estado

El estado del carrito vive en `src/context/CartContext.tsx` y se expone mediante el hook `useCart()`.

### Modelo del carrito

```typescript
cart = [
  {
    id: 1,
    name: "Audífonos Bluetooth",
    price: 25,
    quantity: 2,
    stock: 10
  }
]
```

### Funciones disponibles

| Función | Descripción |
|---------|-------------|
| `addToCart(product)` | Agrega un producto o incrementa su cantidad (respeta stock) |
| `removeFromCart(productId)` | Elimina un producto del carrito |
| `increaseQuantity(productId)` | Incrementa la cantidad en 1 |
| `decreaseQuantity(productId)` | Decrementa la cantidad; elimina si llega a 0 |
| `clearCart()` | Vacía el carrito y borra AsyncStorage |
| `getTotal()` | Calcula el total de la compra |
| `getItemCount()` | Suma total de unidades (badge del tab) |

### Persistencia

- **Clave:** `@minimarket_cart`
- **Al iniciar:** se lee el carrito guardado desde AsyncStorage.
- **En cada cambio:** se serializa y guarda automáticamente con `JSON.stringify`.

---

## Pantallas

| Pantalla | Ruta | Descripción |
|----------|------|-------------|
| Catálogo | `/(tabs)/` | Lista de productos con filtro por categoría |
| Detalle | `/product/[id]` | Información completa y botón agregar |
| Carrito | `/(tabs)/cart` | Gestión de cantidades y total |
| Resumen | `/checkout` | Confirmación final de la compra |

---

## Productos del catálogo

| Producto | Precio | Categoría | Stock |
|----------|--------|-----------|-------|
| Audífonos Bluetooth | $25 | Audio | 10 |
| Mouse inalámbrico | $15 | Periféricos | 15 |
| Teclado mecánico | $45 | Periféricos | 8 |
| Cargador USB-C | $12 | Accesorios | 20 |
| Soporte para celular | $18 | Accesorios | 12 |

---

## Requisitos previos

- [Node.js LTS](https://nodejs.org/) (v18 o superior recomendado)
- npm (incluido con Node.js)
- [Expo Go](https://expo.dev/go) en tu dispositivo móvil (opcional, para pruebas en físico)

---

## Instalación

```bash
# Clonar o descargar el proyecto y entrar a la carpeta
cd Practica_MiniMarket

# Instalar dependencias
npm install
```

---

## Ejecución

```bash
# Iniciar el servidor de desarrollo
npm start
# o
npx expo start
```

Opciones desde la terminal de Expo:

| Tecla | Acción |
|-------|--------|
| `w` | Abrir en navegador web |
| `a` | Abrir en emulador Android |
| QR | Escanear con Expo Go (Android/iOS) |

Scripts adicionales:

```bash
npm run android   # Expo + Android
npm run ios       # Expo + iOS (requiere macOS para build nativo)
npm run web       # Expo + Web
```

---

## Demostración del Problema de Duplicación

Para fines didácticos, hemos introducido un problema común en la gestión del estado: la **duplicación de ítems**.

### El Problema

Si un usuario agrega el mismo producto varias veces, la lógica actual (en `src/context/CartContext.tsx`) crea una nueva entrada en el carrito en lugar de agruparlos por su `id`.

**Consecuencias:**
- El usuario ve múltiples filas para el mismo producto.
- El cálculo del total es incorrecto (subtotales erróneos).
- Mala experiencia de usuario (UX).

### Cómo reproducir

1. En el catálogo, haz clic en el botón de agregar ("+") para un producto (ej. "Audífonos Bluetooth").
2. Vuelve a hacer clic en el mismo producto.
3. Ve a la pantalla del **Carrito**.
4. **Resultado esperado:** Debería haber una sola línea con `cantidad: 2`.
5. **Resultado actual (bug):** Aparecen dos líneas para el mismo producto, cada una con `cantidad: 1`.

### La Solución

Para corregirlo, debemos centralizar la lógica de agregación en `src/context/CartContext.tsx` utilizando el `id` como identificador único.

**Código Correcto (a restaurar):**

```typescript
const addToCart = useCallback((product: Product) => {
  setCart((prev) => {
    // 1. Verificar si ya existe en el carrito
    const existing = prev.find((item) => item.id === product.id);

    // 2. Si existe, mapear el arreglo y actualizar cantidad
    if (existing) {
      return prev.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    }

    // 3. Si no existe, agregar nueva entrada
    return [
      ...prev,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock,
      },
    ];
  });
}, []);
```

---

---

## Conceptos clave para la presentación

Este proyecto ilustra cómo una app móvil híbrida administra información compartida entre varios componentes y pantallas:

- **Estado global:** un único `CartContext` accesible desde cualquier pantalla.
- **Sincronización:** cambios en el catálogo se reflejan al instante en el carrito y el badge.
- **Persistencia local:** AsyncStorage mantiene el carrito entre sesiones.
- **Validación de negocio:** control de stock antes de agregar o incrementar cantidades.

El archivo central para explicar en clase es `src/context/CartContext.tsx`.

---


---

## Licencia

Proyecto académico — uso educativo.
