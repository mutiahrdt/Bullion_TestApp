import { createRouter, createWebHistory } from 'vue-router';

// Import komponen-komponen halaman (Views)
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rute default, arahkan ke login
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    // Rute yang dilindungi (membutuhkan login)
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true } // Tandai bahwa rute ini butuh autentikasi
    }
  ]
});

// Navigation Guard: Pengecekan sebelum masuk ke rute
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Cek apakah token ada

  // Jika rute membutuhkan autentikasi dan pengguna belum login
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Arahkan pengguna ke halaman login
    next({ name: 'login' });
  } 
  // Jika pengguna sudah login dan mencoba mengakses halaman login
  else if (to.name === 'login' && isAuthenticated) { // Hapus pengecekan untuk 'register' di sini
    // Arahkan ke dashboard
    next({ name: 'dashboard' });
  } 
  // Jika tidak, biarkan pengguna melanjutkan
  else {
    next();
  }
});

export default router;