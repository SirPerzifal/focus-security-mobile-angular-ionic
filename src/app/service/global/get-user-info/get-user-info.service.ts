import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

type PreferenceKeys = 'block' | 'unit' | 'family' | 'project_id' | 'project_name' | 'type_family' | 'user' | 'block_name' | 'unit_name';

@Injectable({
  providedIn: 'root'
})
export class GetUserInfoService {

  constructor() { }

  async getPreferenceStorage(wantWhat: PreferenceKeys | PreferenceKeys[]): Promise<any> {
    if (!wantWhat) {
      return null; // Atau bisa juga throw error jika diinginkan
    }

    // Jika wantWhat adalah string, ubah menjadi array
    const requests = Array.isArray(wantWhat) ? wantWhat : [wantWhat];
    const results: { [key: string]: any } = {};

    for (const request of requests) {
      const key = this.whatWantPreference(request);
      if (key) {
        const { value } = await Preferences.get({ key });
        results[request] = value; // Simpan hasil berdasarkan permintaan
      } else {
        results[request] = null; // Atau bisa juga throw error jika diinginkan
      }
    }

    return results; // Mengembalikan objek yang berisi semua nilai yang diambil dari Preferences
  }

  whatWantPreference(wantWhat: string): string {
    switch (wantWhat) {
      case 'block': return 'ACTIVE_BLOCK';
      case 'block_name': return 'NAME_OF_BLOCK';
      case 'unit': return 'ACTIVE_UNIT';
      case 'unit_name': return 'NAME_OF_UNIT';
      case 'family': return 'ACTIVE_FAMILY';
      case 'project_id': return 'ACTIVE_PROJECT';
      case 'project_name': return 'PROJECT_NAME';
      case 'type_family': return 'FAMILY_TYPE';
      case 'user': return 'USER_INFO';
      default: return '';
    }
  }
}