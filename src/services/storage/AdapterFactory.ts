import { StorageAdapter } from './StorageAdapter';
import { LocalAdapter } from './LocalAdapter';
import { FirebaseAdapter } from './FirebaseAdapter';
import { SupabaseAdapter } from './SupabaseAdapter';

export class AdapterFactory {
  private static instance: StorageAdapter | null = null;
  private static currentType: 'local' | 'supabase' | 'firebase' = 'local';

  static getAdapter(type?: 'local' | 'supabase' | 'firebase'): StorageAdapter {
    if (type && type !== this.currentType) {
      this.currentType = type;
      this.instance = null;
    }

    if (!this.instance) {
      switch (this.currentType) {
        case 'firebase':
          this.instance = new FirebaseAdapter();
          break;
        case 'supabase':
          this.instance = new SupabaseAdapter();
          break;
        case 'local':
        default:
          this.instance = new LocalAdapter();
          break;
      }
    }

    return this.instance;
  }
}
