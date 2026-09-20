import { IStorageService } from './IStorageService';
import { LocalStorageService } from './LocalStorageService';

// To switch to Supabase later, simply replace LocalStorageService with SupabaseStorageService:
// export const storageService: IStorageService = new SupabaseStorageService();

export const storageService: IStorageService = LocalStorageService;
export * from './IStorageService';
