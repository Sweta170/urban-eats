import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
    baseURL: 'http://10.0.2.2:5000', // Android emulator → localhost
    // For physical device, replace with your machine's local IP, e.g.:
    // baseURL: 'http://192.168.x.x:5000',
    timeout: 10000,
});

axiosInstance.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
