import PocketBase from 'pocketbase';

const url = import.meta.env.VITE_POCKET_BASE_URL
export const pb = new PocketBase(url);