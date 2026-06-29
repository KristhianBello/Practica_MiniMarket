import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createProduct, fetchProducts, getCategories, PRODUCTS_ENDPOINT } from '@/api/products';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { AppColors } from '@/constants/colors';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

const TEAM_MEMBERS = [
  'Cardenas Ávila Emilio Sleimen',
  'Anthony Axel Mejia Ordoñez',
  'Michael Agustin Intriago Benitez',
  'Kristhian Augusto Bello Soledispa',
];

export default function CatalogScreen() {
  const { addToCart, isLoading: cartLoading, cart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('Accesorios');
  const [stock, setStock] = useState('1');
  const [integrante, setIntegrante] = useState(TEAM_MEMBERS[0]);

  const categories = useMemo(() => getCategories(products), [products]);

  const loadProducts = useCallback(async (refreshing = false) => {
    try {
      setError('');
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoadingProducts(true);
      }

      const data = await fetchProducts();
      setProducts(data);
    } catch {
      setError(
        'No se pudo conectar con la API propia. Verifica que JSON Server este activo y que la URL sea correcta.',
      );
    } finally {
      setIsLoadingProducts(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory('Todas');
    }
  }, [categories, selectedCategory]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todas') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleAddProduct = async () => {
    const parsedPrice = Number(precio.replace(',', '.'));
    const parsedStock = Number(stock);

    if (!nombre.trim() || !precio.trim() || !categoria.trim()) {
      Alert.alert('Datos incompletos', 'Ingrese nombre, precio y categoria.');
      return;
    }

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Precio invalido', 'Ingrese un precio mayor a 0.');
      return;
    }

    if (!Number.isInteger(parsedStock) || parsedStock <= 0) {
      Alert.alert('Stock invalido', 'Ingrese un stock entero mayor a 0.');
      return;
    }

    try {
      setIsSaving(true);
      await createProduct({
        nombre,
        precio: parsedPrice,
        categoria,
        stock: parsedStock,
        integrante,
      });
      setNombre('');
      setPrecio('');
      setStock('1');
      await loadProducts();
      Alert.alert('Correcto', 'Producto registrado con POST en la API propia.');
    } catch {
      Alert.alert('Error', 'No se pudo registrar el producto en la API.');
    } finally {
      setIsSaving(false);
    }
  };

  if (cartLoading || isLoadingProducts) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.loadingText}>Cargando productos desde la API...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>MiniMarket App</Text>
        <Text style={styles.subtitle}>Productos consumidos desde JSON Server</Text>
      </View>

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <FlatList
        key={selectedCategory}
        data={filteredProducts}
        extraData={cart}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadProducts(true)}
            tintColor={AppColors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.form}>
            <Text style={styles.formTitle}>Registrar producto</Text>
            <Text style={styles.endpoint}>Endpoint: {PRODUCTS_ENDPOINT}</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Text style={styles.fieldLabel}>Nombre del producto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ejemplo: Adaptador USB-C"
              value={nombre}
              onChangeText={setNombre}
            />
            <View style={styles.inlineInputs}>
              <View style={styles.inlineField}>
                <Text style={styles.fieldLabel}>Precio</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ejemplo: 12.50"
                  value={precio}
                  onChangeText={setPrecio}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.inlineField}>
                <Text style={styles.fieldLabel}>Stock</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ejemplo: 5"
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="number-pad"
                />
              </View>
            </View>
            <Text style={styles.fieldLabel}>Categoria</Text>
            <TextInput
              style={styles.input}
              placeholder="Ejemplo: Accesorios"
              value={categoria}
              onChangeText={setCategoria}
            />
            <Text style={styles.fieldLabel}>Integrante que registra</Text>
            <View style={styles.memberGrid}>
              {TEAM_MEMBERS.map((member) => {
                const active = member === integrante;
                return (
                  <AnimatedPressable
                    key={member}
                    style={[styles.memberChip, active && styles.memberChipActive]}
                    onPress={() => setIntegrante(member)}
                    scaleTo={0.96}>
                    <Text style={[styles.memberText, active && styles.memberTextActive]}>
                      {member}
                    </Text>
                  </AnimatedPressable>
                );
              })}
            </View>
            <AnimatedPressable
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              disabled={isSaving}
              onPress={handleAddProduct}
              scaleTo={0.97}>
              <Text style={styles.saveText}>
                {isSaving ? 'Guardando...' : 'Agregar producto con POST'}
              </Text>
            </AnimatedPressable>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No hay productos para mostrar</Text>
            <Text style={styles.emptyText}>Revisa el filtro o vuelve a cargar la API.</Text>
            <AnimatedPressable style={styles.retryButton} onPress={() => loadProducts()}>
              <Text style={styles.retryText}>Reintentar</Text>
            </AnimatedPressable>
          </View>
        }
        renderItem={({ item, index }) => (
          <ProductCard
            product={item}
            index={index}
            onPress={() => router.push(`/product/${item.id}`)}
            onAddToCart={() => addToCart(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.background,
  },
  loadingText: {
    color: AppColors.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: AppColors.text,
  },
  subtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  form: {
    backgroundColor: AppColors.card,
    borderRadius: 12,
    marginHorizontal: 8,
    marginBottom: 12,
    padding: 14,
    gap: 8,
  },
  formTitle: {
    color: AppColors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  endpoint: {
    color: AppColors.textSecondary,
    fontSize: 12,
  },
  error: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    color: AppColors.danger,
    fontSize: 13,
    lineHeight: 18,
    padding: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: AppColors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: AppColors.text,
    fontSize: 14,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  inlineInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  inlineField: {
    flex: 1,
  },
  fieldLabel: {
    color: AppColors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  memberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  memberChip: {
    borderColor: AppColors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  memberChipActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  memberText: {
    color: AppColors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  memberTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    marginTop: 4,
    paddingVertical: 12,
  },
  saveButtonDisabled: {
    backgroundColor: AppColors.textSecondary,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyTitle: {
    color: AppColors.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyText: {
    color: AppColors.textSecondary,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
