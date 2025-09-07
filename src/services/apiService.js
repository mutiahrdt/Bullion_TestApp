import axios from 'axios';

// 1. Buat instance Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  }
});

// 2. Interceptor untuk menambahkan token otentikasi ke setiap request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Definisikan service untuk Otentikasi
export const authService = {
  checkHealth() {
    return apiClient.get('/api/v1/check');
  },
  register(userData) {
    return apiClient.post('/api/v1/auth/register', userData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  login(credentials) {
    return apiClient.post('/api/v1/auth/login', credentials, {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

// 4. Definisikan service untuk Manajemen User (Admin)
export const userService = {
  /**
   * Mengambil daftar pengguna dengan paginasi.
   * @param {number} page - Nomor halaman saat ini.
   * @param {number} limit - Jumlah item per halaman.
   * @returns {Promise}
   */
  getUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return apiClient.get(`/api/v1/admin?offset=${offset}&limit=${limit}`);
  },

  /**
   * Mengambil detail satu pengguna berdasarkan ID.
   * @param {string|number} id - ID pengguna.
   * @returns {Promise}
   */
  getUserById(id) {
    return apiClient.get(`/api/v1/admin/${id}`);
  },

  /**
   * Mengupdate data pengguna.
   * @param {string|number} id - ID pengguna yang akan diupdate.
   * @param {FormData} userData - Data baru pengguna (menggunakan FormData untuk file).
   * @returns {Promise}
   */
  updateUser(id, userData) {
    // API update seringkali menggunakan POST dengan method-override _method=PUT
    // untuk menangani FormData. Pastikan backend mendukung ini.
    userData.append('_method', 'PUT'); 
    return apiClient.post(`/api/v1/admin/${id}/update`, userData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  /**
   * Menghapus pengguna berdasarkan ID.
   * @param {string|number} id - ID pengguna.
   * @returns {Promise}
   */
  deleteUser(id) {
    return apiClient.delete(`/api/v1/admin/${id}/delete`);
  },
};

// Catatan penting:
// Fungsi `updateUser` menggunakan `POST` dengan `_method=PUT` karena form HTML standar
// tidak sepenuhnya mendukung `PUT` dengan `multipart/form-data`.
// Ini adalah praktik umum. Jika backend Anda langsung menerima `PUT` dengan `FormData`,
// Anda bisa mengubah `apiClient.post` menjadi `apiClient.put` dan menghapus `_method`.