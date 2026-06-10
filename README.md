# MiniMarket App

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

## Flujo de demostración

1. Agregar un producto desde el catálogo → aparece toast y se actualiza el badge del carrito.
2. Ir al tab **Carrito** → el producto agregado está visible.
3. Volver al catálogo y agregar otro producto → el carrito se sincroniza automáticamente.
4. Filtrar por categoría → solo se muestran productos de esa categoría.
5. Intentar agregar más unidades que el stock → mensaje de error.
6. Cerrar y reabrir la app → el carrito persiste gracias a AsyncStorage.
7. Ir a **Resumen** y confirmar compra → el carrito se limpia.

---

## Conceptos clave para la presentación

Este proyecto ilustra cómo una app móvil híbrida administra información compartida entre varios componentes y pantallas:

- **Estado global:** un único `CartContext` accesible desde cualquier pantalla.
- **Sincronización:** cambios en el catálogo se reflejan al instante en el carrito y el badge.
- **Persistencia local:** AsyncStorage mantiene el carrito entre sesiones.
- **Validación de negocio:** control de stock antes de agregar o incrementar cantidades.

El archivo central para explicar en clase es `src/context/CartContext.tsx`.

---

## Licencia

Proyecto académico — uso educativo.
