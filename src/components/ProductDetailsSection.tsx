import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/colors';
import { ProductSpecification } from '@/types';

type ProductDetailsSectionProps = {
  specifications?: ProductSpecification[];
  longDescription?: string;
};

export function ProductDetailsSection({
  specifications = [],
  longDescription,
}: ProductDetailsSectionProps) {
  const hasSpecs = specifications.length > 0;
  const hasLongDescription = Boolean(longDescription?.trim());

  if (!hasSpecs && !hasLongDescription) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Detalles del producto</Text>

      {hasLongDescription && <Text style={styles.longDescription}>{longDescription}</Text>}

      {hasSpecs && (
        <View style={styles.specsCard}>
          {specifications.map((spec, index) => (
            <View
              key={`${spec.label}-${index}`}
              style={[styles.specRow, index < specifications.length - 1 && styles.specRowBorder]}>
              <Text style={styles.specLabel}>{spec.label}</Text>
              <Text style={styles.specValue}>{spec.value}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.text,
  },
  longDescription: {
    fontSize: 15,
    color: AppColors.text,
    lineHeight: 24,
  },
  specsCard: {
    backgroundColor: AppColors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    overflow: 'hidden',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 16,
  },
  specRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  specLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  specValue: {
    flex: 1.2,
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.text,
    textAlign: 'right',
  },
});
