import { useMemo } from 'react';

const STORAGE_KEY = 'vb_device_id';

export function useDeviceId() {
  return useMemo(() => {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  }, []);
}
