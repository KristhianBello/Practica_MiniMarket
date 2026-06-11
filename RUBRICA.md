# Cumplimiento de la rúbrica — MiniMarket App

**Título del proyecto:** Gestión de Estado Global en una Aplicación Móvil Híbrida de Carrito de Compras

**Stack exigido:** React Native + Context API + AsyncStorage (vía Expo)

---

## Objetivos específicos

| Criterio | Estado | Evidencia en el proyecto |
|----------|--------|--------------------------|
| Crear un catálogo de productos | Cumple | [`src/app/(tabs)/index.tsx`](src/app/(tabs)/index.tsx), [`src/data/products.ts`](src/data/products.ts) |
| Implementar estado global del carrito | Cumple | [`src/context/CartContext.tsx`](src/context/CartContext.tsx) |
| Agregar, eliminar y modificar cantidades | Cumple | `addToCart`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity` |
| Calcular subtotales y total | Cumple | [`src/utils/cartHelpers.ts`](src/utils/cartHelpers.ts), [`src/app/(tabs)/cart.tsx`](src/app/(tabs)/cart.tsx) |
| Persistir el carrito localmente | Cumple | AsyncStorage clave `@minimarket_cart` |
| Navegación manteniendo datos | Cumple | Expo Router + `CartProvider` en [`src/app/_layout.tsx`](src/app/_layout.tsx) |

---

## Pantallas requeridas

### 1. Inicio / Catálogo

| Requisito | Cumple | Ubicación |
|-----------|--------|-----------|
| Lista de productos | Sí | `FlatList` en catálogo |
| Imagen | Sí | [`ProductCard.tsx`](src/components/ProductCard.tsx) |
| Nombre | Sí | Tarjeta de producto |
| Precio | Sí | Tarjeta de producto |
| Botón agregar | Sí | Llama a `addToCart()` |
| 5 productos del ejemplo | Sí | [`products.ts`](src/data/products.ts) |
| Filtro por categorías (extra) | Sí | [`CategoryFilter.tsx`](src/components/CategoryFilter.tsx) |

### 2. Detalle del producto

| Requisito | Cumple | Ubicación |
|-----------|--------|-----------|
| Imagen | Sí | [`product/[id].tsx`](src/app/product/[id].tsx) |
| Nombre | Sí | Pantalla detalle |
| Precio | Sí | Pantalla detalle |
| Descripción | Sí | Campo `description` |
| Stock disponible | Sí | Texto de stock |
| Botón "Agregar al carrito" | Sí | Con validación de stock |
| Detalles adicionales | Sí | Sección `ProductDetailsSection` |

### 3. Carrito

| Requisito | Cumple | Ubicación |
|-----------|--------|-----------|
| Productos agregados | Sí | [`cart.tsx`](src/app/(tabs)/cart.tsx) |
| Imagen del producto | Sí | [`CartItem.tsx`](src/components/CartItem.tsx) |
| Cantidad por producto | Sí | Controles +/- |
| Aumentar cantidad | Sí | `increaseQuantity()` |
| Disminuir cantidad | Sí | `decreaseQuantity()` |
| Eliminar producto | Sí | `removeFromCart()` |
| Subtotal por producto | Sí | En cada fila del carrito |
| Total general | Sí | `getTotal()` |
| Vaciar carrito (extra) | Sí | `clearCart()` |

### 4. Resumen de compra

| Requisito | Cumple | Ubicación |
|-----------|--------|-----------|
| Lista de productos | Sí | [`checkout.tsx`](src/app/checkout.tsx) |
| Total | Sí | Total a pagar |
| Confirmar compra | Sí | Botón confirmar |
| Limpiar carrito al confirmar | Sí | `clearCart()` + toast de éxito |

---

## Funciones del estado (rúbrica)

| Función | Implementada | Archivo |
|---------|--------------|---------|
| `addToCart(product)` | Sí | `CartContext.tsx` |
| `removeFromCart(productId)` | Sí | `CartContext.tsx` |
| `increaseQuantity(productId)` | Sí | `CartContext.tsx` |
| `decreaseQuantity(productId)` | Sí | `CartContext.tsx` |
| `clearCart()` | Sí | `CartContext.tsx` |
| `getTotal()` | Sí | `cartHelpers.ts` + contexto |
| `getItemCount()` | Sí | Badge del tab carrito |

### Modelo de estado

```typescript
cart = [
  { id: 1, name: "Audífonos Bluetooth", price: 25, quantity: 2, stock: 10 }
]
```

---

## Extras de la rúbrica

| Extra | Cumple |
|-------|--------|
| Contador (badge) en ícono del carrito | Sí |
| Toast "Producto agregado" | Sí |
| Validación de stock | Sí |
| Persistencia con AsyncStorage | Sí |
| Botón vaciar carrito | Sí |
| Filtro por categorías | Sí |
| Diseño con cards | Sí |

---

## Flujo de demostración (para presentación)

1. Abrir catálogo → ver 5 productos con imagen, nombre y precio.
2. Agregar producto → toast + badge del carrito se actualiza.
3. Ir al carrito → producto visible con imagen, cantidad y subtotal.
4. Regresar al catálogo → agregar otro producto → carrito sincronizado.
5. Filtrar por categoría → solo productos de esa categoría.
6. Superar stock → mensaje de error.
7. Cerrar y reabrir la app → carrito persiste (AsyncStorage).
8. Ir a resumen → confirmar compra → carrito vacío.

---

## Archivo clave para explicar en clase

**[`src/context/CartContext.tsx`](src/context/CartContext.tsx)** — aquí se demuestra:

- Estado global con Context API
- Acciones que modifican el carrito
- Sincronización automática en todas las pantallas
- Persistencia con AsyncStorage
