import {
  INITIAL_CATEGORIES,
  INITIAL_SUBCATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_HOMEPAGE_SETTINGS,
  INITIAL_STORE_SETTINGS,
} from '../services/storage/seedData';
import { Category, Subcategory, Product, HomepageSettings, StoreSettings } from '../types';

export interface LocalStorageSeedData {
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
  homepageSettings: HomepageSettings;
  storeSettings: StoreSettings;
}

/**
 * Canonical seed data for portable deployment testing and initial storage bootstrap.
 * This guarantees consistent initialization across localhost, preview environments, and production domains.
 */
export const LOCAL_STORAGE_SEED: LocalStorageSeedData = {
  categories: INITIAL_CATEGORIES,
  subcategories: INITIAL_SUBCATEGORIES,
  products: INITIAL_PRODUCTS,
  homepageSettings: INITIAL_HOMEPAGE_SETTINGS,
  storeSettings: INITIAL_STORE_SETTINGS,
};

export const LOCAL_STORAGE_KEYS = {
  CATEGORIES: 'md_categories_v1',
  SUBCATEGORIES: 'md_subcategories_v1',
  PRODUCTS: 'md_products_v1',
  HOMEPAGE: 'md_homepage_v1',
  SETTINGS: 'md_store_settings_v1',
  INITIALIZED: 'md_initialized_v1',
  AUTH_SESSION: 'md_admin_auth_session',
  ADMIN_EMAIL: 'md_admin_email',
} as const;
