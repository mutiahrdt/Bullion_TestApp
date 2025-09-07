<template>
  <div class="dashboard-container" :class="{ 'sidebar-open': sidebarOpen }">
    <!-- Sidebar (tetap sama) -->
    <aside class="sidebar" :class="{ 'open': sidebarOpen }">
      <div class="sidebar-header">
        <div class="logo-container">
          <img :src="logoIcon" alt="Bullion Ecosystem" class="logo">
        </div>
        <button class="menu-toggle" @click="toggleSidebar">
          <div class="hamburger-lines"><span></span><span></span><span></span></div>
        </button>
      </div>

      <nav class="nav-menu">
        <ul>
          <li class="nav-item active"><a href="#" class="nav-link"><span class="nav-icon active"></span>User Aktif</a></li>
          <li class="nav-item"><a href="#" class="nav-link"><span class="nav-icon"></span>Menu 2</a></li>
          <li class="nav-item"><a href="#" class="nav-link"><span class="nav-icon"></span>Menu 3</a></li>
          <li class="nav-item"><a href="#" class="nav-link"><span class="nav-icon"></span>Menu 4</a></li>
          <li class="nav-item"><a href="#" class="nav-link"><span class="nav-icon"></span>Menu 5</a></li>
        </ul>
      </nav>
    </aside>

    <div class="sidebar-overlay" :class="{ 'active': sidebarOpen }" @click="closeSidebar"></div>

    <!-- Main Content -->
    <main class="main-content">
      <header class="content-header">
        <button class="menu-toggle" @click="toggleSidebar">
          <div class="hamburger-lines"><span></span><span></span><span></span></div>
        </button>

        <div class="header-main">
          <h1>User Aktif</h1>
          <div class="header-actions">
            <button @click="goToAddUserPage" class="add-user-btn">Tambah User</button>
            <button @click="logout" class="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div class="content-body">
        <div class="table-container">
          <div class="loading-container" v-if="isLoading">
            <div class="loading-spinner"></div>
            <p>Memuat data pengguna...</p>
          </div>

          <div class="error-container" v-else-if="error">
            <p class="error-message">{{ error }}</p>
            <button @click="fetchUsers" class="retry-button">Coba Lagi</button>
          </div>

          <div v-else-if="users.length === 0" class="empty-state">
            <p>Tidak ada pengguna yang terdaftar.</p>
          </div>

          <table class="user-table" v-else>
            <thead>
              <tr>
                <th class="col-account-id">Account ID</th>
                <th class="col-name">Name</th>
                <th class="col-date">Date</th>
                <th class="col-status">Status</th>
                <th class="col-action">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id" class="table-row">
                <td class="account-id">#{{ user.account_id || (user._id && user._id.slice(-5)) }}</td>
                <td class="user-name">{{ getFullName(user) }}</td>
                <td class="date">{{ formatDate(user.date_of_birth || user.dob || user.created_at) }}</td>
                <td class="status"><span class="status-badge registered">Registered</span></td>
                <td class="actions">
                  <button @click="onClickView(user)" class="action-btn view-btn">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="11.5" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M20.18 11.5C19.34 8.75 16.92 6.75 12 6.75C7.08 6.75 4.66 8.75 3.82 11.5C4.66 14.25 7.08 16.25 12 16.25C16.92 16.25 19.34 14.25 20.18 11.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Lihat
                  </button>
                  <button @click="onClickEdit(user)" class="action-btn edit-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="1.5"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.5"/></svg>
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="pagination-container" v-if="users.length > 0">
            <div class="pagination">
              <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-btn prev-btn">Previous</button>
              <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="['pagination-btn page-btn', { active: page === currentPage }]" >{{ page }}</button>
              <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-btn next-btn">Next</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- VIEW Modal: detail pengguna -->
    <div v-if="viewModalOpen" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-scroll-container">
          <div class="modal-header">
            <h2>Lihat User</h2>
            <button @click="closeViewModal" class="close-btn-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-body view-modal-body">
            <!-- Bagian Foto Profil -->
            <div class="profile-header">
              <label class="profile-label">Foto Profil</label>
              <div class="user-avatar">
                <img v-if="selectedUser?.photo" :src="photoDataUrl(selectedUser.photo)" alt="avatar" class="avatar-image">
                <div v-else class="avatar-placeholder">{{ getInitials(selectedUser) }}</div>
              </div>
            </div>

            <!-- Grid untuk detail user dengan struktur baru -->
            <div class="details-grid">
              <!-- Baris 1: Nama Depan & Nama Belakang -->
              <div class="detail-row">
                <div class="detail-item">
                  <label>Nama Depan</label>
                  <span>{{ firstNameFrom(selectedUser) }}</span>
                </div>
                <div class="detail-item">
                  <label>Nama Belakang</label>
                  <span>{{ lastNameFrom(selectedUser) }}</span>
                </div>
              </div>

              <!-- Baris 2: Jenis Kelamin & Tanggal Lahir -->
              <div class="detail-row">
                <div class="detail-item">
                  <label>Jenis Kelamin</label>
                  <span>{{ genderLabel(selectedUser) }}</span>
                </div>
                <div class="detail-item">
                  <label>Tanggal Lahir</label>
                  <span>{{ formatDate(selectedUser?.date_of_birth || selectedUser?.dob) }}</span>
                </div>
              </div>
              
              <!-- Item yang membentang penuh (full-width) -->
              <div class="detail-item full-width">
                <label>Email</label>
                <span>{{ selectedUser?.email || '-' }}</span>
              </div>
              
              <div class="detail-item full-width">
                <label>No. Handphone</label>
                <span>{{ selectedUser?.phone || '-' }}</span>
              </div>
              
              <div class="detail-item full-width">
                <label>Alamat</label>
                <span>{{ selectedUser?.address || '-' }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer view-modal-footer">
            <button @click="openEditFromView" class="btn-primary btn-full-width">Edit</button>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT Modal: disesuaikan dengan gambar yang diberikan -->
    <div v-if="editModalOpen" class="modal-overlay" @click="closeEditModal">
  <div class="modal-content edit-modal-content" @click.stop>
    <div class="modal-scroll-container">
    <div class="modal-scroll-container">
      <div class="modal-header">
        <h2>Edit User</h2>
        <button @click="closeEditModal" class="close-btn-circle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="modal-body edit-modal-body">
        <form @submit.prevent="handleEditSubmit" class="edit-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstNameEdit">Nama Depan</label>
              <input id="firstNameEdit" type="text" v-model="editForm.first_name" placeholder="Masukkan nama depan" />
            </div>
            <div class="form-group">
              <label for="lastNameEdit">Nama Belakang</label>
              <input id="lastNameEdit" type="text" v-model="editForm.last_name" placeholder="Masukkan nama belakang" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="genderEdit">Jenis Kelamin</label>
              <div class="select-wrapper">
                <select id="genderEdit" v-model="editForm.gender">
                  <option disabled value="">Pilih jenis kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
                <span class="icon select-icon">
                  <svg width="16" height="10" viewBox="0 2 16 10" fill="#FD5725" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L8 8.5L15 1.5" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </div>
            </div>
            <div class="form-group">
              <label for="dobEdit">Tanggal Lahir</label>
              <div class="input-with-icon">
                <input id="dobEdit" :type="dobInputType" v-model="editForm.date_of_birth" placeholder="Pilih tanggal"
                  @focus="dobInputType = 'date'" @blur="!editForm.date_of_birth ? dobInputType = 'text' : null" />
                <span class="icon calendar-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V5" stroke="#FD5725" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 2V5" stroke="#FD5725" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3.5 9.08984H20.5" stroke="#FD5725" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#FD5725" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.6947 13.7002H15.7037" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.6947 16.7002H15.7037" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M11.9955 13.7002H12.0045" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M11.9955 16.7002H12.0045" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.29431 13.7002H8.30331" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.29431 16.7002H8.30331" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="emailEdit">Email</label>
            <input id="emailEdit" type="email" v-model="editForm.email" placeholder="Masukkan email" />
          </div>

          <div class="form-group">
            <label for="phoneEdit">No. Handphone</label>
            <input id="phoneEdit" type="tel" v-model="editForm.phone" placeholder="Masukkan no. handphone" />
          </div>

          <div class="form-group">
            <label for="addressEdit">Alamat</label>
            <input id="addressEdit" type="text" v-model="editForm.address" placeholder="Masukkan alamat" />
          </div>

              <div class="form-row">
            <div class="form-group">
              <label for="passwordEdit">Password</label>
              <div class="input-with-icon">
                <input id="passwordEdit" :type="passwordFieldType" v-model="editForm.password" placeholder="Masukkan password baru" />
                <span class="icon icon--clickable eye-icon" @click="togglePasswordVisibility">
                      <svg v-if="!isPasswordVisible" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="11.5" r="2.5" stroke="#FD5725" stroke-width="1.5"/>
                        <path d="M20.18 11.5C19.34 8.75 16.92 6.75 12 6.75C7.08 6.75 4.66 8.75 3.82 11.5C4.66 14.25 7.08 16.25 12 16.25C16.92 16.25 19.34 14.25 20.18 11.5Z" stroke="#FD5725" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.18 11.5C19.34 8.75 16.92 6.75 12 6.75C7.08 6.75 4.66 8.75 3.82 11.5C4.66 14.25 7.08 16.25 12 16.25C16.92 16.25 19.34 14.25 20.18 11.5Z" stroke="#FD5725" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="11.5" r="2.5" stroke="#FD5725" stroke-width="1.5"/>
                        <path d="M3 3L21 21" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
              </div>
            </div>
            <div class="form-group">
              <label for="confirmPasswordEdit">Konfirmasi Password</label>
              <div class="input-with-icon">
                <input id="confirmPasswordEdit" :type="confirmPasswordFieldType" v-model="editForm.password_confirmation" placeholder="Konfirmasi password baru" />
                <span class="icon icon--clickable eye-icon" @click="toggleConfirmPasswordVisibility">
                      <svg v-if="!isConfirmPasswordVisible" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="11.5" r="2.5" stroke="#FD5725" stroke-width="1.5"/>
                        <path d="M20.18 11.5C19.34 8.75 16.92 6.75 12 6.75C7.08 6.75 4.66 8.75 3.82 11.5C4.66 14.25 7.08 16.25 12 16.25C16.92 16.25 19.34 14.25 20.18 11.5Z" stroke="#FD5725" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.18 11.5C19.34 8.75 16.92 6.75 12 6.75C7.08 6.75 4.66 8.75 3.82 11.5C4.66 14.25 7.08 16.25 12 16.25C16.92 16.25 19.34 14.25 20.18 11.5Z" stroke="#FD5725" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="11.5" r="2.5" stroke="#FD5725" stroke-width="1.5"/>
                        <path d="M3 3L21 21" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="profilePictureEdit">Foto Profil</label>
            <div class="custom-file-input">
              <label for="profilePictureEdit" class="file-label" @click.prevent="$refs.editFileInput.click()">
                <span>{{ editForm.photoName || 'Pilih foto profil' }}</span>
                <span class="icon upload-icon">
                      <svg width="16" height="16" viewBox="0 2 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.44 22.08 10.4 19.68 10.13" stroke="#FD5725" stroke-width="2" fill="none"/>
                        <path d="M14.4 11.4L12 9L9.6 11.4M12 9V16" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
              </label>
              <input ref="editFileInput" id="profilePictureEdit" type="file" @change="onEditFileChange" accept="image/jpeg,image/jpg" style="display:none" />
            </div>
          </div>
        </form>
      </div>
      
      <div class="modal-footer edit-modal-footer">
        <button @click="handleEditSubmit" class="btn-primary submit-btn" :disabled="editLoading">
          {{ editLoading ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </div>
    </div>
    </div>
  </div>
</div>
</div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CryptoJS from 'crypto-js';
import { mockUserService as userService } from '@/services/mockApiService';
import logoIcon from '@/assets/logo-sidebar.png';
import logoWhite from '@/assets/logo-white.png';

const router = useRouter();
const logoIconRef = logoIcon;
const logoWhiteRef = logoWhite;

/* main list state */
const users = ref([]);
const isLoading = ref(true);
const error = ref('');
const currentPage = ref(1);
const totalUsers = ref(0);
const itemsPerPage = ref(10);

/* sidebar */
const sidebarOpen = ref(false);

/* modal states */
const viewModalOpen = ref(false);
const editModalOpen = ref(false);
const selectedUser = ref(null);

/* edit form (reuse register style structure) */
const editForm = reactive({
  id: '',
  first_name: '',
  last_name: '',
  gender: '',
  date_of_birth: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  password_confirmation: '',
  photoFile: null,
  photoName: ''
});

const editLoading = ref(false);

/* password toggle */
const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const passwordFieldType = computed(() => isPasswordVisible.value ? 'text' : 'password');
const confirmPasswordFieldType = computed(() => isConfirmPasswordVisible.value ? 'text' : 'password');
const togglePasswordVisibility = () => isPasswordVisible.value = !isPasswordVisible.value;
const toggleConfirmPasswordVisibility = () => isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value;

/* dob input type (so placeholder shows) */
const dobInputType = ref('text');

/* pagination computed */
const totalPages = computed(() => totalUsers.value === 0 ? 1 : Math.ceil(totalUsers.value / itemsPerPage.value));
const visiblePages = computed(() => {
  if (totalPages.value <= 5) return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  const pages = [];
  let start = Math.max(1, currentPage.value - 2);
  let end = Math.min(totalPages.value, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

/* helpers */
const getFullName = (u) => u?.name || `${u?.first_name || ''} ${u?.last_name || ''}`.trim() || 'Nama Tidak Tersedia';
const getInitials = (u) => {
  if (!u) return 'U';
  const name = getFullName(u);
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0] ? parts[0].charAt(0) : '';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
};
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};
const photoDataUrl = (b64) => {
  if (!b64) return null;
  return `data:image/jpeg;base64,${b64}`;
};
const genderLabel = (u) => {
  if (!u) return '-';
  if (u.gender === 'male' || u.gender === 'L') return 'Laki-laki';
  if (u.gender === 'female' || u.gender === 'P') return 'Perempuan';
  return u.gender || '-';
};
const firstNameFrom = (u) => {
  if (!u) return '-';
  if (u.first_name) return u.first_name;
  if (u.name) return u.name.split(' ')[0] || u.name;
  return '-';
};
const lastNameFrom = (u) => {
  if (!u) return '-';
  if (u.last_name) return u.last_name;
  if (u.name) {
    const parts = u.name.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '-';
  }
  return '-';
};

/* sidebar handlers */
const toggleSidebar = () => sidebarOpen.value = !sidebarOpen.value;
const closeSidebar = () => sidebarOpen.value = false;

/* navigation handlers */
const goToPage = (page) => { if (page >= 1 && page <= totalPages.value && page !== currentPage.value) fetchUsers(page); };

const goToAddUserPage = () => {
  console.log('Navigating to register page');
  try {
    // Menggunakan name route sesuai dengan router config Anda
    router.push({ name: 'register' }).catch(err => {
      console.error('Navigation error:', err);
      // Fallback menggunakan path
      router.push('/register').catch(pathErr => {
        console.error('Path navigation error:', pathErr);
        window.location.href = '/register';
      });
    });
  } catch (error) {
    console.error('Router push error:', error);
    window.location.href = '/register';
  }
};

const logout = () => {
  console.log('Logging out user');
  try {
    // Clear authentication data - sesuaikan dengan key yang digunakan router Anda
    localStorage.removeItem('authToken'); // Sesuai dengan router config
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    sessionStorage.clear();
    
    console.log('Auth data cleared, navigating to login');
    
    // Navigate to login page menggunakan name route
    router.push({ name: 'login' }).catch(err => {
      console.error('Logout navigation error:', err);
      // Fallback menggunakan path
      router.push('/login').catch(pathErr => {
        console.error('Path navigation error:', pathErr);
        window.location.href = '/login';
      });
    });
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = '/login';
  }
};

/* fetch list */
const fetchUsers = async (page = 1) => {
  const pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) { error.value = 'Halaman tidak valid.'; isLoading.value = false; return; }
  isLoading.value = true; error.value = '';
  try {
    const res = await userService.getUsers(pageNumber, itemsPerPage.value);
    if (res.data && Array.isArray(res.data.data)) {
      users.value = res.data.data;
      totalUsers.value = res.data.total || (pageNumber * itemsPerPage.value + (res.data.data.length === itemsPerPage.value ? 1 : 0));
      currentPage.value = pageNumber;
    } else {
      throw new Error('Format data tidak sesuai');
    }
  } catch (err) {
    console.error(err);
    error.value = 'Gagal memuat data pengguna. Silakan coba lagi.';
  } finally {
    isLoading.value = false;
  }
};

/* VIEW detail */
const onClickView = async (user) => {
  if (!user || !user._id) { alert('ID pengguna tidak ditemukan.'); return; }
  try {
    const res = await userService.getUserById(user._id);
    if (res.data && res.data.data) {
      selectedUser.value = res.data.data;
      viewModalOpen.value = true;
    } else {
      throw new Error('Format detail user tidak sesuai');
    }
  } catch (err) {
    console.error(err);
    alert('Tidak dapat memuat detail pengguna saat ini.');
  }
};
const closeViewModal = () => { viewModalOpen.value = false; selectedUser.value = null; };
const openEditFromView = () => {
  if (!selectedUser.value) return;
  populateEditFormFrom(selectedUser.value);
  viewModalOpen.value = false;
  editModalOpen.value = true;
};

/* EDIT: populate and open */
const onClickEdit = async (user) => {
  if (!user || !user._id) { alert('ID pengguna tidak ditemukan.'); return; }
  try {
    const res = await userService.getUserById(user._id);
    if (res.data && res.data.data) {
      populateEditFormFrom(res.data.data);
      editModalOpen.value = true;
    } else {
      throw new Error('Format detail user tidak sesuai');
    }
  } catch (err) {
    console.error(err);
    alert('Tidak dapat memuat detail pengguna untuk diedit.');
  }
};
const closeEditModal = () => {
  editModalOpen.value = false;
  resetEditForm();
};

function populateEditFormFrom(u) {
  editForm.id = u._id || '';
  if (u.name) {
    const parts = u.name.split(' ').filter(Boolean);
    editForm.first_name = parts[0] || '';
    editForm.last_name = parts.slice(1).join(' ') || '';
  } else {
    editForm.first_name = u.first_name || '';
    editForm.last_name = u.last_name || '';
  }
  // convert to L/P for select
  if (u.gender === 'male' || u.gender === 'L' || u.gender === 'l') editForm.gender = 'L';
  else if (u.gender === 'female' || u.gender === 'P' || u.gender === 'p') editForm.gender = 'P';
  else editForm.gender = '';
  editForm.date_of_birth = u.date_of_birth ? new Date(u.date_of_birth).toISOString().slice(0,10) : (u.dob ? new Date(u.dob).toISOString().slice(0,10) : '');
  editForm.email = u.email || '';
  editForm.phone = u.phone || '';
  editForm.address = u.address || '';
  editForm.password = '';
  editForm.password_confirmation = '';
  editForm.photoFile = null;
  editForm.photoName = u.photo ? 'Ada foto' : '';
}

function resetEditForm() {
  editForm.id = '';
  editForm.first_name = '';
  editForm.last_name = '';
  editForm.gender = '';
  editForm.date_of_birth = '';
  editForm.email = '';
  editForm.phone = '';
  editForm.address = '';
  editForm.password = '';
  editForm.password_confirmation = '';
  editForm.photoFile = null;
  editForm.photoName = '';
}

/* file change for edit (validasi client) */
const onEditFileChange = (e) => {
  const f = e.target.files[0];
  if (!f) { editForm.photoFile = null; editForm.photoName = ''; return; }
  if (f.size > 5 * 1024 * 1024) { alert('Ukuran file maksimal 5MB'); e.target.value = ''; return; }
  if (!['image/jpeg','image/jpg'].includes(f.type)) { alert('Format file harus JPG/JPEG'); e.target.value = ''; return; }
  editForm.photoFile = f;
  editForm.photoName = f.name;
};

/* handle edit submit - build FormData, hash password if provided, send to updateUser */
const handleEditSubmit = async () => {
  if (!editForm.id) { alert('ID user tidak ditemukan.'); return; }
  // basic client validation
  if (!editForm.first_name || !editForm.last_name || !editForm.email) { alert('Nama dan email wajib diisi.'); return; }
  if (editForm.password && editForm.password !== editForm.password_confirmation) { alert('Konfirmasi password tidak cocok.'); return; }

  editLoading.value = true;
  try {
    const submission = new FormData();
    submission.append('first_name', editForm.first_name);
    submission.append('last_name', editForm.last_name);
    submission.append('gender', editForm.gender === 'L' ? 'male' : (editForm.gender === 'P' ? 'female' : ''));
    submission.append('date_of_birth', editForm.date_of_birth ? new Date(editForm.date_of_birth).toISOString() : '');
    submission.append('email', editForm.email);
    submission.append('phone', editForm.phone);
    submission.append('address', editForm.address);

    if (editForm.password) {
      const hashed = CryptoJS.SHA256(editForm.password).toString(CryptoJS.enc.Hex);
      submission.append('password', hashed);
    }

    if (editForm.photoFile) {
      submission.append('photo', editForm.photoFile);
    }

    // call userService.updateUser (assumed accept multipart/form-data)
    await userService.updateUser(editForm.id, submission);

    alert('Perubahan berhasil disimpan.');
    closeEditModal();
    fetchUsers(currentPage.value);

  } catch (err) {
    console.error('Error updating user:', err);
    const msg = (err?.response?.data?.message) ? err.response.data.message : 'Gagal menyimpan perubahan.';
    alert(msg);
  } finally {
    editLoading.value = false;
  }
};

/* lifecycle */
onMounted(() => fetchUsers(currentPage.value));

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Inter:wght@400;500;700&display=swap');

* { box-sizing: border-box; margin:0; padding:0; }

.dashboard-container { 
  display: flex; 
  min-height: 100vh; 
  font-family: 'Montserrat', sans-serif; /* Font utama sesuai Figma */
  background-color: #F1F3FC; /* Background sesuai Figma */
}

/* Sidebar Styles - Exact match */
.sidebar { 
  width: 260px; /* Lebar sesuai Figma */
  background-color: #ffffff; 
  position: fixed; 
  height: 100vh; 
  z-index: 100; 
  box-shadow: 2px 0 4px rgba(0,0,0,0.05); /* Shadow lebih halus */
  transition: transform .3s ease; 
  padding: 20px 0; /* Padding vertikal di sidebar utama */
}
.logo-container { background-color:#ffffff; }
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px; /* Padding horizontal sesuai Figma */
  height: 70px; /* Tinggi sesuai Figma */
  margin-bottom: 10px; /* Gap antara header dan nav */
}
.logo { 
  height: 32px; 
  width: 104px; 
}

.nav-menu { 
  padding: 0; 
}

.nav-item { 
  margin: 0; 
}
.nav-menu ul { list-style:none; }
.nav-link { 
  display: flex; 
  align-items: center; 
  padding: 12px 24px; /* Padding sesuai Figma */
  color: #000000;
  text-decoration: none; 
  font-weight: 400; /* Regular */
  font-size: 14px; 
  transition: all .2s; 
  border-left: none; /* Hapus border */
  gap: 10px; /* Gap antara ikon dan teks */
}
.nav-item.active .nav-link { 
  background-color: #FD5725; 
  color: #ffffff; 
  border-left: none; 
  font-weight: 700; /* Bold */
}
.nav-item:not(.active) .nav-link:hover { 
  background-color: #f8f9fa; 
  color: #FD5725; 
}

.nav-icon { 
  width: 20px; /* Ukuran ikon sesuai Figma */
  height: 20px;
  background-color: #8B0000;
  border-radius: 2px;
  margin-right: 0; /* Hapus margin, gunakan gap */
  flex-shrink: 0; 
}

.nav-item.active .nav-icon { 
  background-color: #ffffff; 
}
.nav-item:not(.active) .nav-icon { background-color:#8B0000; }

/* Sidebar Overlay */
.sidebar-overlay { display:none; position:fixed; top:0; left:0; right:0; bottom:0; background-color:rgba(0,0,0,0.5); z-index:99; }
.sidebar-overlay.active { display:block; }

/* Main Content - Exact match */
.main-content { 
  flex: 1; 
  margin-left: 260px; /* Sesuaikan dengan lebar sidebar */
  min-height: 100vh; 
  background-color: #F1F3FC;
}

.content-header { 
  background-color: #ffffff; 
  padding: 32px 36px; /* Padding sesuai Figma */
  display: flex; 
  align-items: center; 
  gap: 16px; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
  border-radius: 6px; /* Radius sesuai Figma */
  margin: 24px 32px; 
}
.header-main { display:flex; justify-content:space-between; align-items:center; width:100%; }
.menu-toggle { background:none; border:none; cursor:pointer; padding:8px; border-radius:4px; z-index:101; }
.hamburger-lines { display:flex; flex-direction:column; width:24px; height:16px; justify-content:space-between; }
.hamburger-lines span { display:block; height:2px; width:100%; background-color:#333333; border-radius:1px; transition:all .3s; }
.content-header h1 { 
  font-size: 32px; /* Ukuran sesuai Figma */
  font-weight: 700; 
  color: #000000; 
  margin: 0; 
}
.content-body { padding:0 32px 32px 32px; }
.content-header .menu-toggle { display:none; }

/* Header actions container */
.header-actions { 
  display: flex; 
  gap: 12px; 
  align-items: center; 
  z-index: 10;
  position: relative;
}

/* add user button */
.add-user-btn { 
  background-color: #FD5725; 
  color: white; 
  border: none; 
  padding: 12px 24px; 
  border-radius: 8px; 
  font-size: 16px; 
  font-weight: 500; 
  cursor: pointer; 
  transition: background-color 0.2s; 
  z-index: 11;
  position: relative;
  pointer-events: auto;
  user-select: none;
}
.add-user-btn:hover { 
  background-color: #E64A19; 
}
.add-user-btn:active {
  transform: translateY(1px);
}
.modal-scroll-container {
  overflow-y: auto;
}

/* logout button */
.logout-btn { 
  background-color: transparent; 
  color: #666666; 
  border: 1px solid #e0e0e0; 
  padding: 12px 24px; 
  border-radius: 8px; 
  font-size: 16px; 
  font-weight: 500; 
  cursor: pointer; 
  transition: all 0.2s; 
  z-index: 11;
  position: relative;
  pointer-events: auto;
  user-select: none;
}
.logout-btn:hover { 
  background-color: #f5f5f5; 
  border-color: #ccc; 
  color: #333333; 
}
.logout-btn:active {
  transform: translateY(1px);
}

/* Table Container - Exact match */
.table-container { 
  background-color: #ffffff; 
  border-radius: 6px; /* Radius sesuai Figma */
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
  padding: 12px; /* Padding sesuai Figma */
  overflow-x: auto; /* Tambahkan scroll-x jika perlu */
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  padding: 16px 8px;
  vertical-align: middle;
}

/* Semua header rata kiri, kecuali yang ditentukan lain */
.user-table th {
  text-align: left;
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  white-space: nowrap;
}

/* Semua sel data rata kiri, kecuali yang ditentukan lain */
.user-table td {
  text-align: left;
  font-size: 14px;
  font-weight: 500; /* Medium */
  color: #000000;
  border-top: 1px solid #f0f0f0;
}

/* Kolom yang diratakan ke tengah */
.user-table .col-status,
.user-table .status,
.user-table .col-account-id,
.user-table .account-id,
.user-table .col-action,
.user-table .actions {
  text-align: center;
}

/* Pengaturan lebar spesifik untuk kolom */
.user-table .col-account-id,
.user-table .account-id {
  width: 20%; /* Beri lebar yang lebih kecil */
}

.user-table .col-name,
.user-table .user-name {
  width: 25%; /* Beri ruang lebih untuk nama */
}

/* Mencegah pemotongan kata (wrapping) pada kolom tertentu */
.user-table .col-account-id,
.user-table .account-id,
.user-table .col-date,
.user-table .date {
  white-space: nowrap;
}

.table-row:hover { background-color:transparent; }
.table-row:nth-child(odd) { 
  background-color: #FFF4ED; 
}

.account-id { 
  font-weight: 500; /* Medium */
}

.user-table .col-status, .user-table .status,
.user-table .col-action, .user-table .actions {
  text-align: center;
}

.user-name { font-weight:500; text-align:left; }

/* Status Badge - Exact match */
.status-badge {
  display: inline-block;
  font-family: 'Montserrat', sans-serif; /* Pastikan font konsisten */
  font-weight: 500; /* Medium */
  text-align: center;
}

.status-badge.registered {
  padding: 8px 12px;         /* Sesuai Figma */
  border-radius: 22px;      /* Sesuai Figma */
  font-size: 12px;          /* Sesuai Figma */
  background-color: #EBF9F1; /* Sesuai Figma */
  color: #1F9254;           /* Sesuai Figma */
  min-width: 202.8px;
}

.actions { 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  gap: 24px; /* Gap sesuai Figma */
}

.action-btn { 
  display: flex; 
  align-items: center; 
  gap: 8px; /* Gap sesuai Figma */
  padding: 0; /* Hapus padding, biarkan natural */
  border: none; 
  border-radius: 0; 
  cursor: pointer; 
  font-size: 14px; 
  font-weight: 500; /* Medium */
  background-color: transparent;
}

.action-btn svg {
  width: 24px;
  height: 24px;
}

.view-btn { background-color:transparent; color:#FF5722; border:1px solid transparent; }
.view-btn:hover { background-color:#fff3f0; }
.edit-btn { background-color:transparent; color:#FF5722; border:1px solid transparent; }
.edit-btn:hover { background-color:#fff3f0; }

/* pagination */
.pagination-container { 
  padding: 24px 12px;
  display: flex; 
  justify-content: flex-end; /* Dorong ke kanan */
  background-color: #ffffff; 
}

.pagination { 
  display: flex; 
  gap: 12px;
  align-items: center; 
}

.pagination-btn { 
  height: 31px;
  border: 1px solid transparent; /* Border default transparan */
  border-radius: 8px;
  cursor: pointer; 
  font-family: 'Montserrat', sans-serif; /* Pastikan font-nya benar */
  font-size: 12px;
  font-weight: 500;
  transition: all .2s;
  min-width: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Style khusus untuk tombol halaman angka (page-btn) */
.pagination-btn.page-btn {
  background-color: #E0E0E0;
  color: #000000;
  padding: 8px 9px;
}

/* Style khusus untuk tombol Prev & Next */
.pagination-btn.prev-btn, .pagination-btn.next-btn {
  background-color: transparent; /* Tidak ada background */
  color: #9E9E9E;
  padding: 8px; /* Padding bisa sedikit berbeda */
}

.pagination-btn:hover:not(:disabled):not(.active) { 
  background-color: #d5d5d5; /* Efek hover yang lebih baik */
  border-color: transparent;
}

/* Style untuk tombol aktif */
.pagination-btn.active { 
  background-color: #FD5725; 
  color: #ffffff; 
  border-color: #FD5725;
}

.pagination-btn:disabled { 
  opacity: .5; 
  cursor: not-allowed; 
}

/* states */
.loading-container, .error-container, .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:64px 32px; text-align:center; background-color:#ffffff; }
.loading-spinner { width:32px; height:32px; border:3px solid #f0f0f0; border-top:3px solid #FF5722; border-radius:50%; animation:spin 1s linear infinite; margin-bottom:16px; }
@keyframes spin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
.error-message { color:#d32f2f; margin-bottom:16px; font-size:16px; }
.retry-button { padding:12px 24px; background-color:#FF5722; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:500; font-size:16px; }
.retry-button:hover { background-color:#E64A19; }
.close-btn-circle {
  background-color: #FD5725;
  color: white;
  border-radius: 50%;
  width: 32px; /* Sesuai Figma */
  height: 32px; /* Sesuai Figma */
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}
.close-btn-circle:hover {
  opacity: 0.85;
}

/* modal base view/detail */
.modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background-color:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000;}
.modal-overlay .modal-content:not(.edit-modal-content) { 
  background-color: #ffffff; 
  border-radius: 12px; /* Radius lebih besar sesuai gambar */
  width: 464px; /* Lebar tetap sesuai gambar */
  max-width: 464px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); 
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 701px;
}

/* Modal Header - perbaiki padding dan alignment */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px; /* Padding disesuaikan */
  border-bottom: none;
}

.modal-header h2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 20px; /* Ukuran lebih kecil sesuai gambar */
  font-weight: 700;
  color: #000000;
}

/* Close button - sesuaikan ukuran */
.close-btn-circle {
  background-color: #FD5725;
  color: white;
  border-radius: 50%;
  width: 28px; /* Lebih kecil sesuai gambar */
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

/* Modal Body - perbaiki padding */
.view-modal-body {
  padding: 16px 24px; /* Padding dikurangi */
}

/* Profile Header - perbaiki spacing */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px; /* Gap dikurangi */
  margin-bottom: 24px; /* Margin dikurangi */
}

.profile-label {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600; /* Tidak terlalu bold */
  font-size: 14px;
  color: #000000;
}

/* Avatar - sesuaikan ukuran dengan gambar */
.view-modal-body .user-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.view-modal-body .avatar-image,
.view-modal-body .avatar-placeholder {
  width: 80px; /* Ukuran lebih kecil sesuai gambar */
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.view-modal-body .avatar-placeholder {
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px; /* Sesuaikan ukuran font */
  font-weight: 600;
  color: #666;
}

/* Details Grid - perbaiki layout agar sesuai gambar */
.details-grid {
  display: flex;
  flex-direction: column; /* Ubah ke kolom vertikal */
  gap: 20px; /* Gap antar item */
}

/* Detail Item - perbaiki layout untuk 2 kolom per baris */
.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Gap antara label dan value lebih kecil */
}

/* Buat 2 kolom untuk item yang berpasangan */
.details-grid .detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
}

/* Item yang full-width tetap menggunakan class ini */
.detail-item.full-width {
  grid-column: unset; /* Reset grid-column */
  width: 100%;
}

.detail-item label {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px; /* Ukuran font lebih kecil sesuai gambar */
  font-weight: 600;
  color: #000000;
  margin: 0;
  padding: 0;
}

.detail-item span {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
}

/* Modal Footer - perbaiki padding dan button */
.view-modal-footer {
  padding: 16px 24px 24px 24px; /* Padding disesuaikan */
  border-top: none;
}

.btn-full-width {
  width: 100%;
  height: 44px; /* Tinggi dikurangi sesuai gambar */
  font-size: 14px; /* Font size dikurangi */
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  border-radius: 8px;
  background-color: #FD5725;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-full-width:hover {
  background-color: #E64A19;
}

.close-btn { background:none; border:none; cursor:pointer; padding:8px; border-radius:6px; color:#666666; }
.close-btn:hover { background-color:#f5f5f5; color:#333333; }
.btn-secondary { padding:12px 24px; border:1px solid #e0e0e0; background-color:#ffffff; color:#666666; border-radius:6px; cursor:pointer; font-weight:500; font-size:16px; }
.btn-secondary:hover { background-color:#f5f5f5; border-color:#ccc; }
.btn-primary { 
  padding: 12px 24px; 
  border: none; 
  background-color: #FD5725; 
  color: white; 
  border-radius: 6px; 
  cursor: pointer; 
  font-weight: 500; 
  font-size: 16px; 
}
.btn-primary:hover { 
  background-color: #E64A19; 
}

/* ======================================================= */
/* BLOK FINAL & LENGKAP UNTUK MODAL EDIT (VERSI KOMPAK)    */
/* ======================================================= */

.modal-content.edit-modal-content { 
  background-color: #ffffff; 
  border-radius: 6px;
  width: 100%;
  max-width: 484px;
  box-shadow: 0 10px 20px -5px rgba(0,0,0,0.15); 
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
}

.edit-modal-body {
  padding: 20px; /* Padding body sedikit dikurangi */
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Jarak vertikal utama antar grup form DIPERKECIL */
}

.edit-form .form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px; /* Jarak antar kolom DIPERKECIL */
}

.edit-form .form-group {
  display: flex;
  flex-direction: column;
  gap: 5px; /* Jarak antara label dan input DIPERKECIL */
}

.edit-form label {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px; /* Font label DIPERKECIL */
  font-weight: 600; /* Sedikit lebih tipis dari Bold */
  color: #000000;
}

.edit-modal-content .edit-form input,
.edit-modal-content .edit-form select,
.edit-modal-content .edit-form .file-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px; /* Font input & placeholder DIPERKECIL */
  font-weight: 400;
  height: 35px; /* Tinggi input DIPERKECIL */
  padding: 8px 12px;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  outline: none;
  width: 100%;
  background-color: white;
}

.edit-modal-content .edit-form input::placeholder {
  color: #98A2B3;
  font-size: 13px; /* Font placeholder DIPERKECIL */
}

.edit-form .select-wrapper,
.edit-form .input-with-icon {
  position: relative;
}

.edit-modal-content .edit-form .input-with-icon input {
  padding-right: 36px; /* Sesuaikan padding untuk ikon */
}

.edit-form .icon {
  position: absolute;
  top: 50%;
  right: 0px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.edit-form .icon--clickable {
  pointer-events: auto;
  cursor: pointer;
}

.edit-modal-footer {
  padding: 0px 24px 0px 24px; /* Sesuaikan padding footer */
  border-top: none;
  margin-top: 0px;
  margin-bottom: 10px
}

.edit-modal-footer .submit-btn {
  width: 100%;
  height: 40px; /* Tinggi tombol DISAMAKAN dengan input */
  background-color: #FD5725;
  color: white;
  border: none;
  border-radius: 6px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px; /* Font tombol DIPERKECIL */
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-modal-footer .submit-btn:hover:not(:disabled) {
  background-color: #E64A19;
}

.edit-modal-footer .submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Menghilangkan ikon default browser */
.edit-modal-content select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.edit-modal-content input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}

/* responsive (dashboard/view unchanged) */
@media (max-width: 1024px) {
  .main-content { margin-left:0; }
  .sidebar { transform:translateX(-100%); }
  .sidebar.open { transform:translateX(0); }
  .content-header .menu-toggle { display: block; }
  .content-header .menu-toggle { 
    display: block; 
  }
  .sidebar-open .content-header .menu-toggle {
    display: none;
  }
  .content-header { padding:16px 24px; margin:24px 32px 10px; }
  .content-body { padding:0 24px 24px 24px; }
}

@media (max-width:768px) {
  .content-header { margin:16px 25px 10px; padding:12px 16px; }
  .content-header h1 { font-size:20px; }
  .header-actions { flex-direction:column; gap:8px; width:100%; }
  .add-user-btn, .logout-btn { padding:10px 16px; font-size:14px; width:100%; }
  .user-table { font-size:14px; }
  .user-table th, .user-table td { padding:16px 12px; }
  .actions { flex-direction:column; gap:8px; }
  .action-btn { padding:6px 12px; font-size:13px; }
  .modal-content { margin:10px; max-width:none; }
  .detail-item { grid-template-columns:1fr; gap:4px; text-align:left; }
  .status-badge.registered {
    width: auto; /* KEMBALIKAN KE LEBAR OTOMATIS DI LAYAR KECIL */
    min-width: 0; /* Pastikan tidak ada min-width yang mengganggu */
    padding: 6px 12px;
    font-size: 13px;
  }
}

@media (max-width:480px) {
  .content-header { padding:12px 16px; }
  .content-header h1 { font-size:24px; }
  .content-body { padding:0 16px 16px 16px; }
  .user-table th, .user-table td { padding:12px 8px; font-size:13px; }
  .table-container { overflow-x:auto; }
  .user-table { min-width:600px; }
  .pagination-btn { padding:8px 10px; font-size:13px; }
  .modal-header h2 { font-size:20px; }
  .avatar-placeholder { font-size:28px; }
  .modal-overlay .modal-content:not(.edit-modal-content) {
    width: 90%;
    max-width: 360px;
    margin: 0 20px;
  }
  
  .modal-header {
    padding: 20px 20px 0 20px;
  }
  
  .view-modal-body {
    padding: 16px 20px;
  }
  
  .view-modal-footer {
    padding: 16px 20px 20px 20px;
  }
  
  .details-grid .detail-row {
    grid-template-columns: 1fr; /* Single column di mobile */
    row-gap: 16px;
  }
}

/* =========================
   REGISTER FORM STYLE (dipakai hanya untuk modal edit)
   — tidak meng-overwrite dashboard/view CSS
   ========================= */

/* register styles — reused inside modal (scoped to avoid polluting global) */
.register-page { display:flex; min-height:100%; background-color:#FFFFFF; width:100%; }
.left-panel { width:38%; min-width:300px; background:linear-gradient(135deg,#2E74B2 0%, #9dc2f5 100%); padding:60px 40px; position:relative; display:flex; flex-direction:column; }
.left-panel-modal { display:none; } /* hidden in modal context */
.logo-image { width:104px; height:32px; z-index:1; }
.right-panel { flex:1; display:flex; justify-content:center; align-items:center; padding:0 10px; overflow-y:auto; min-height:100%; }
.form-container { width:100%; max-width:560px; display:flex; flex-direction:column; gap:16px; }
.select-wrapper, .input-with-icon, .custom-file-input { position:relative; }
input[type="text"], input[type="email"], input[type="tel"], input[type="password"], input[type="date"], select, .file-label { display:block; width:100%; height:44px; padding:8px 12px; border:1px solid #E0E0E0; border-radius:8px; font-size:14px; outline:none; background-color:white; font-weight:300; }
.file-label { display:flex; justify-content:space-between; align-items:center; color:#98A2B3; cursor:pointer; padding-right:13px; }
input::placeholder, select:required:invalid { color:#98A2B3; }
input:focus, select:focus { border-color:#2F66B2; box-shadow:0 0 0 2px rgba(47,102,178,0.08); }
.icon { position:absolute; top:0; right:6px; height:100%; width:40px; display:flex; align-items:center; justify-content:center; pointer-events:none; }
.icon--clickable { cursor:pointer; pointer-events:auto; }
.custom-file-input input[type="file"] { display:none; }

/* small responsive tweaks inside modal */
@media (max-width:768px) {
  .form-row { flex-direction:column; }
  .form-container { gap:12px; }
}
</style>