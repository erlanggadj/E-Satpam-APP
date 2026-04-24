// config/env.ts
// Configuration for environment variables

// Ngrok public tunnel → forwards to localhost:8080
// URL ini bisa diakses dari mana saja selama ngrok aktif
// export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || 'https://pod-subpar-snowman.ngrok-free.dev/api/v1';

// Untuk Android Emulator: 10.0.2.2 = localhost laptop
export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || 'http://10.101.191.116:8080/api/v1';