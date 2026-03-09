// Backend API URL - your PC's local IP (from ipconfig IPv4)
const LOCAL_IP = '172.2.3.212';

// Physical device via Expo Go always uses the local network IP
export const API_URL = `http://${LOCAL_IP}:8000`;
