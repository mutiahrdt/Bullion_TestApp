<template>
  <div class="dashboard-container" :class="{ 'sidebar-open': sidebarOpen }">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'open': sidebarOpen }">
      <div class="sidebar-header">
        <div class="logo-container"><img :src="logoIcon" alt="Bullion Ecosystem" class="logo"></div>
        <button class="menu-toggle" @click="toggleSidebar"><div class="hamburger-lines"><span></span><span></span><span></span></div></button>
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
        <button class="menu-toggle" @click="toggleSidebar"><div class="hamburger-lines"><span></span><span></span><span></span></div></button>
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
          <div class="loading-container" v-if="isLoading"><div class="loading-spinner"></div><p>Memuat data pengguna...</p></div>
          <div class="error-container" v-else-if="error"><p class="error-message">{{ error }}</p><button @click="fetchUsers" class="retry-button">Coba Lagi</button></div>
          <div v-else-if="users.length === 0" class="empty-state"><p>Tidak ada pengguna yang terdaftar.</p></div>
          <table class="user-table" v-else>
            <thead>
              <tr>
                <th class="col-account-id">Account ID</th><th class="col-name">Name</th><th class="col-date">Date</th><th class="col-status">Status</th><th class="col-action">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id" class="table-row">
                <td class="account-id">#{{ user.account_id || (user._id && user._id.slice(-5)) }}</td>
                <td class="user-name">{{ getFullName(user) }}</td>
                <td class="date">{{ formatDate(user.date_of_birth || user.dob || user.created_at) }}</td>
                <td class="status"><span class="status-badge registered">Registered</span></td>
                <td class="actions">
                  <button @click="onClickView(user)" class="action-btn view-btn"><IconView />Lihat</button>
                  <button @click="onClickEdit(user)" class="action-btn edit-btn"><IconEdit />Edit</button>
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

    <!-- VIEW Modal -->
    <div v-if="viewModalOpen" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-scroll-container">
          <div class="modal-header">
            <h2>Lihat User</h2>
            <button @click="closeViewModal" class="close-btn-circle"><IconClose /></button>
          </div>
          <div class="modal-body view-modal-body">
            <div class="profile-header"><label class="profile-label">Foto Profil</label><div class="user-avatar"><img v-if="selectedUser?.photo" :src="photoDataUrl(selectedUser.photo)" alt="avatar" class="avatar-image"><div v-else class="avatar-placeholder">{{ getInitials(selectedUser) }}</div></div></div>
            <div class="details-grid">
              <div class="detail-row"><div class="detail-item"><label>Nama Depan</label><span>{{ firstNameFrom(selectedUser) }}</span></div><div class="detail-item"><label>Nama Belakang</label><span>{{ lastNameFrom(selectedUser) }}</span></div></div>
              <div class="detail-row"><div class="detail-item"><label>Jenis Kelamin</label><span>{{ genderLabel(selectedUser) }}</span></div><div class="detail-item"><label>Tanggal Lahir</label><span>{{ formatDate(selectedUser?.date_of_birth || selectedUser?.dob) }}</span></div></div>
              <div class="detail-item full-width"><label>Email</label><span>{{ selectedUser?.email || '-' }}</span></div>
              <div class="detail-item full-width"><label>No. Handphone</label><span>{{ selectedUser?.phone || '-' }}</span></div>
              <div class="detail-item full-width"><label>Alamat</label><span>{{ selectedUser?.address || '-' }}</span></div>
            </div>
          </div>
          <div class="modal-footer view-modal-footer">
            <button @click="openEditFromView" class="btn-primary btn-full-width">Edit</button>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT Modal -->
    <div v-if="editModalOpen" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content edit-modal-content" @click.stop>
        <div class="modal-scroll-container">
          <div class="modal-header">
            <h2>Edit User</h2>
            <button @click="closeEditModal" class="close-btn-circle"><IconClose /></button>
          </div>
          <div class="modal-body edit-modal-body">
            <form @submit.prevent="handleEditSubmit" class="edit-form">
              <div class="form-row"><div class="form-group"><label for="firstNameEdit">Nama Depan</label><input id="firstNameEdit" type="text" v-model="editForm.first_name" placeholder="Masukkan nama depan" /></div><div class="form-group"><label for="lastNameEdit">Nama Belakang</label><input id="lastNameEdit" type="text" v-model="editForm.last_name" placeholder="Masukkan nama belakang" /></div></div>
              <div class="form-row">
                <div class="form-group">
                  <label for="genderEdit">Jenis Kelamin</label>
                  <div class="select-wrapper">
                    <select id="genderEdit" v-model="editForm.gender"><option disabled value="">Pilih jenis kelamin</option><option value="L">Laki-laki</option><option value="P">Perempuan</option></select>
                    <span class="icon select-icon"><IconChevronDown /></span>
                  </div>
                </div>
                <div class="form-group">
                  <label for="dobEdit">Tanggal Lahir</label>
                  <div class="input-with-icon">
                    <input id="dobEdit" :type="dobInputType" v-model="editForm.date_of_birth" placeholder="Pilih tanggal" @focus="dobInputType = 'date'" @blur="!editForm.date_of_birth ? dobInputType = 'text' : null" />
                    <span class="icon calendar-icon"><IconCalendar /></span>
                  </div>
                </div>
              </div>
              <div class="form-group"><label for="emailEdit">Email</label><input id="emailEdit" type="email" v-model="editForm.email" placeholder="Masukkan email" /></div>
              <div class="form-group"><label for="phoneEdit">No. Handphone</label><input id="phoneEdit" type="tel" v-model="editForm.phone" placeholder="Masukkan no. handphone" /></div>
              <div class="form-group"><label for="addressEdit">Alamat</label><input id="addressEdit" type="text" v-model="editForm.address" placeholder="Masukkan alamat" /></div>
              <div class="form-row">
                <div class="form-group">
                  <label for="passwordEdit">Password</label>
                  <div class="input-with-icon">
                    <input id="passwordEdit" :type="passwordFieldType" v-model="editForm.password" placeholder="Masukkan password baru" />
                    <span class="icon icon--clickable eye-icon" @click="togglePasswordVisibility"><IconEye v-if="!isPasswordVisible" /><IconEyeSlash v-else /></span>
                  </div>
                </div>
                <div class="form-group">
                  <label for="confirmPasswordEdit">Konfirmasi Password</label>
                  <div class="input-with-icon">
                    <input id="confirmPasswordEdit" :type="confirmPasswordFieldType" v-model="editForm.password_confirmation" placeholder="Konfirmasi password baru" />
                    <span class="icon icon--clickable eye-icon" @click="toggleConfirmPasswordVisibility"><IconEye v-if="!isConfirmPasswordVisible" /><IconEyeSlash v-else /></span>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="profilePictureEdit">Foto Profil</label>
                <div class="custom-file-input">
                  <label for="profilePictureEdit" class="file-label" @click.prevent="$refs.editFileInput.click()">
                    <span>{{ editForm.photoName || 'Pilih foto profil' }}</span>
                    <span class="icon upload-icon"><IconUpload /></span>
                  </label>
                  <input ref="editFileInput" id="profilePictureEdit" type="file" @change="onEditFileChange" accept="image/jpeg,image/jpg" style="display:none" />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer edit-modal-footer">
            <button @click="handleEditSubmit" class="btn-primary submit-btn" :disabled="editLoading">{{ editLoading ? 'Menyimpan...' : 'Simpan' }}</button>
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
import { userService } from '@/services/apiService';
import logoIcon from '@/assets/logo-sidebar.png';

// Import semua komponen ikon yang dibutuhkan
import IconView from '@/components/icons/IconView.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconClose from '@/components/icons/IconClose.vue';
import IconChevronDown from '@/components/icons/IconChevronDown.vue';
import IconCalendar from '@/components/icons/IconCalendar.vue';
import IconEye from '@/components/icons/IconEye.vue';
import IconEyeSlash from '@/components/icons/IconEyeSlash.vue';
import IconUpload from '@/components/icons/IconUpload.vue';

const router = useRouter();

// Sisa script setup sama persis dengan kode asli Anda
const users = ref([]);
const isLoading = ref(true);
const error = ref('');
const currentPage = ref(1);
const totalUsers = ref(0);
const itemsPerPage = ref(10);
const sidebarOpen = ref(false);
const viewModalOpen = ref(false);
const editModalOpen = ref(false);
const selectedUser = ref(null);
const editForm = reactive({ id: '', first_name: '', last_name: '', gender: '', date_of_birth: '', email: '', phone: '', address: '', password: '', password_confirmation: '', photoFile: null, photoName: '' });
const editLoading = ref(false);
const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const passwordFieldType = computed(() => isPasswordVisible.value ? 'text' : 'password');
const confirmPasswordFieldType = computed(() => isConfirmPasswordVisible.value ? 'text' : 'password');
const togglePasswordVisibility = () => isPasswordVisible.value = !isPasswordVisible.value;
const toggleConfirmPasswordVisibility = () => isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value;
const dobInputType = ref('text');
const totalPages = computed(() => totalUsers.value === 0 ? 1 : Math.ceil(totalUsers.value / itemsPerPage.value));
const visiblePages = computed(() => { if (totalPages.value <= 5) return Array.from({ length: totalPages.value }, (_, i) => i + 1); const pages = []; let start = Math.max(1, currentPage.value - 2); let end = Math.min(totalPages.value, start + 4); if (end - start < 4) start = Math.max(1, end - 4); for (let i = start; i <= end; i++) pages.push(i); return pages; });
const getFullName = (u) => u?.name || `${u?.first_name || ''} ${u?.last_name || ''}`.trim() || 'Nama Tidak Tersedia';
const getInitials = (u) => { if (!u) return 'U'; const name = getFullName(u); const parts = name.split(' ').filter(Boolean); const first = parts[0] ? parts[0].charAt(0) : ''; const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : ''; return (first + last).toUpperCase(); };
const formatDate = (dateString) => { if (!dateString) return '-'; const d = new Date(dateString); if (isNaN(d.getTime())) return '-'; return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }); };
const photoDataUrl = (b64) => { if (!b64) return null; return `data:image/jpeg;base64,${b64}`; };
const genderLabel = (u) => { if (!u) return '-'; if (u.gender === 'male' || u.gender === 'L') return 'Laki-laki'; if (u.gender === 'female' || u.gender === 'P') return 'Perempuan'; return u.gender || '-'; };
const firstNameFrom = (u) => { if (!u) return '-'; if (u.first_name) return u.first_name; if (u.name) return u.name.split(' ')[0] || u.name; return '-'; };
const lastNameFrom = (u) => { if (!u) return '-'; if (u.last_name) return u.last_name; if (u.name) { const parts = u.name.split(' '); return parts.length > 1 ? parts.slice(1).join(' ') : '-'; } return '-'; };
const toggleSidebar = () => sidebarOpen.value = !sidebarOpen.value;
const closeSidebar = () => sidebarOpen.value = false;
const goToPage = (page) => { if (page >= 1 && page <= totalPages.value && page !== currentPage.value) fetchUsers(page); };
const goToAddUserPage = () => { router.push({ name: 'register' }); };
const logout = () => { localStorage.removeItem('authToken'); router.push({ name: 'login' }); };
const fetchUsers = async (page = 1) => { isLoading.value = true; error.value = ''; try { const res = await userService.getUsers(page, itemsPerPage.value); users.value = res.data.data; totalUsers.value = res.data.total; currentPage.value = page; } catch (err) { console.error(err); error.value = 'Gagal memuat data pengguna. Silakan coba lagi.'; } finally { isLoading.value = false; } };
const onClickView = async (user) => { if (!user || !user._id) { alert('ID pengguna tidak ditemukan.'); return; } try { const res = await userService.getUserById(user._id); selectedUser.value = res.data.data; viewModalOpen.value = true; } catch (err) { console.error(err); alert('Tidak dapat memuat detail pengguna saat ini.'); } };
const closeViewModal = () => { viewModalOpen.value = false; selectedUser.value = null; };
const openEditFromView = () => { if (!selectedUser.value) return; populateEditFormFrom(selectedUser.value); viewModalOpen.value = false; editModalOpen.value = true; };
const onClickEdit = async (user) => { if (!user || !user._id) { alert('ID pengguna tidak ditemukan.'); return; } try { const res = await userService.getUserById(user._id); populateEditFormFrom(res.data.data); editModalOpen.value = true; } catch (err) { console.error(err); alert('Tidak dapat memuat detail pengguna untuk diedit.'); } };
const closeEditModal = () => { editModalOpen.value = false; resetEditForm(); };
function populateEditFormFrom(u) { editForm.id = u._id || ''; if (u.name) { const parts = u.name.split(' ').filter(Boolean); editForm.first_name = parts[0] || ''; editForm.last_name = parts.slice(1).join(' ') || ''; } else { editForm.first_name = u.first_name || ''; editForm.last_name = u.last_name || ''; } if (u.gender === 'male' || u.gender === 'L' || u.gender === 'l') editForm.gender = 'L'; else if (u.gender === 'female' || u.gender === 'P' || u.gender === 'p') editForm.gender = 'P'; else editForm.gender = ''; editForm.date_of_birth = u.date_of_birth ? new Date(u.date_of_birth).toISOString().slice(0,10) : (u.dob ? new Date(u.dob).toISOString().slice(0,10) : ''); editForm.email = u.email || ''; editForm.phone = u.phone || ''; editForm.address = u.address || ''; editForm.password = ''; editForm.password_confirmation = ''; editForm.photoFile = null; editForm.photoName = u.photo ? 'Ada foto' : ''; }
function resetEditForm() { editForm.id = ''; editForm.first_name = ''; editForm.last_name = ''; editForm.gender = ''; editForm.date_of_birth = ''; editForm.email = ''; editForm.phone = ''; editForm.address = ''; editForm.password = ''; editForm.password_confirmation = ''; editForm.photoFile = null; editForm.photoName = ''; }
const onEditFileChange = (e) => { const f = e.target.files[0]; if (!f) { editForm.photoFile = null; editForm.photoName = ''; return; } if (f.size > 5 * 1024 * 1024) { alert('Ukuran file maksimal 5MB'); e.target.value = ''; return; } if (!['image/jpeg','image/jpg'].includes(f.type)) { alert('Format file harus JPG/JPEG'); e.target.value = ''; return; } editForm.photoFile = f; editForm.photoName = f.name; };
const handleEditSubmit = async () => { if (!editForm.id) { alert('ID user tidak ditemukan.'); return; } if (!editForm.first_name || !editForm.last_name || !editForm.email) { alert('Nama dan email wajib diisi.'); return; } if (editForm.password && editForm.password !== editForm.password_confirmation) { alert('Konfirmasi password tidak cocok.'); return; } editLoading.value = true; try { const submission = new FormData(); submission.append('first_name', editForm.first_name); submission.append('last_name', editForm.last_name); submission.append('gender', editForm.gender === 'L' ? 'male' : (editForm.gender === 'P' ? 'female' : '')); submission.append('date_of_birth', editForm.date_of_birth ? new Date(editForm.date_of_birth).toISOString() : ''); submission.append('email', editForm.email); submission.append('phone', editForm.phone); submission.append('address', editForm.address); if (editForm.password) { const hashed = CryptoJS.SHA256(editForm.password).toString(CryptoJS.enc.Hex); submission.append('password', hashed); } if (editForm.photoFile) { submission.append('photo', editForm.photoFile); } await userService.updateUser(editForm.id, submission); alert('Perubahan berhasil disimpan.'); closeEditModal(); fetchUsers(currentPage.value); } catch (err) { console.error('Error updating user:', err); const msg = (err?.response?.data?.message) ? err.response.data.message : 'Gagal menyimpan perubahan.'; alert(msg); } finally { editLoading.value = false; } };
onMounted(() => fetchUsers(currentPage.value));
</script>

<style scoped>
/* SEMUA CSS DARI KODE ASLI ANDA DITEMPATKAN DI SINI TANPA PERUBAHAN */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Inter:wght@400;500;700&display=swap');
* { box-sizing: border-box; margin:0; padding:0; }
.dashboard-container { display: flex; min-height: 100vh; font-family: 'Montserrat', sans-serif; background-color: #F1F3FC; }
.sidebar { width: 260px; background-color: #ffffff; position: fixed; height: 100vh; z-index: 100; box-shadow: 2px 0 4px rgba(0,0,0,0.05); transition: transform .3s ease; padding: 20px 0; }
.sidebar-header { display: flex; align-items: center; justify-content: space-between; padding: 0 16px; height: 70px; margin-bottom: 10px; }
.logo { height: 32px; width: 104px; }
.nav-menu ul { list-style:none; padding: 0; }
.nav-link { display: flex; align-items: center; padding: 12px 24px; color: #000000; text-decoration: none; font-weight: 400; font-size: 14px; transition: all .2s; gap: 10px; }
.nav-item.active .nav-link { background-color: #FD5725; color: #ffffff; font-weight: 700; }
.nav-item:not(.active) .nav-link:hover { background-color: #f8f9fa; color: #FD5725; }
.nav-icon { width: 20px; height: 20px; background-color: #8B0000; border-radius: 2px; flex-shrink: 0; }
.nav-item.active .nav-icon { background-color: #ffffff; }
.sidebar-overlay { display:none; position:fixed; top:0; left:0; right:0; bottom:0; background-color:rgba(0,0,0,0.5); z-index:99; }
.sidebar-overlay.active { display:block; }
.main-content { flex: 1; margin-left: 260px; min-height: 100vh; background-color: #F1F3FC; }
.content-header { background-color: #ffffff; padding: 32px 36px; display: flex; align-items: center; gap: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-radius: 6px; margin: 24px 32px; }
.header-main { display:flex; justify-content:space-between; align-items:center; width:100%; }
.menu-toggle { background:none; border:none; cursor:pointer; padding:8px; border-radius:4px; z-index:101; }
.hamburger-lines { display:flex; flex-direction:column; width:24px; height:16px; justify-content:space-between; }
.hamburger-lines span { display:block; height:2px; width:100%; background-color:#333333; border-radius:1px; }
.content-header h1 { font-size: 32px; font-weight: 700; color: #000000; margin: 0; }
.content-body { padding:0 32px 32px 32px; }
.content-header .menu-toggle { display:none; }
.header-actions { display: flex; gap: 12px; align-items: center; }
.add-user-btn { background-color: #FD5725; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }
.add-user-btn:hover { background-color: #E64A19; }
.logout-btn { background-color: transparent; color: #666666; border: 1px solid #e0e0e0; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.logout-btn:hover { background-color: #f5f5f5; border-color: #ccc; color: #333333; }
.table-container { background-color: #ffffff; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); padding: 12px; overflow-x: auto; }
.user-table { width: 100%; border-collapse: collapse; }
.user-table th, .user-table td { padding: 16px 8px; vertical-align: middle; }
.user-table th { text-align: left; font-size: 14px; font-weight: 700; color: #000000; white-space: nowrap; }
.user-table td { text-align: left; font-size: 14px; font-weight: 500; color: #000000; border-top: 1px solid #f0f0f0; }
.user-table .col-status, .user-table .status, .user-table .col-account-id, .user-table .account-id, .user-table .col-action, .user-table .actions { text-align: center; }
.user-table .col-account-id, .user-table .account-id { width: 20%; }
.user-table .col-name, .user-table .user-name { width: 25%; }
.table-row:nth-child(odd) { background-color: #FFF4ED; }
.status-badge.registered { padding: 8px 12px; border-radius: 22px; font-size: 12px; background-color: #EBF9F1; color: #1F9254; min-width: 202.8px; display: inline-block; font-family: 'Montserrat', sans-serif; font-weight: 500; text-align: center; }
.actions { display: flex; justify-content: center; align-items: center; gap: 24px; }
.action-btn { display: flex; align-items: center; gap: 8px; padding: 0; border: none; cursor: pointer; font-size: 14px; font-weight: 500; background-color: transparent; }
.action-btn svg { width: 24px; height: 24px; }
.view-btn { color:#FF5722; }
.edit-btn { color:#FF5722; }
.pagination-container { padding: 24px 12px; display: flex; justify-content: flex-end; }
.pagination { display: flex; gap: 12px; align-items: center; }
.pagination-btn { height: 31px; border: 1px solid transparent; border-radius: 8px; cursor: pointer; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 500; transition: all .2s; min-width: 31px; display: flex; align-items: center; justify-content: center; }
.pagination-btn.page-btn { background-color: #E0E0E0; color: #000000; padding: 8px 9px; }
.pagination-btn.prev-btn, .pagination-btn.next-btn { background-color: transparent; color: #9E9E9E; padding: 8px; }
.pagination-btn:hover:not(:disabled):not(.active) { background-color: #d5d5d5; }
.pagination-btn.active { background-color: #FD5725; color: #ffffff; border-color: #FD5725; }
.pagination-btn:disabled { opacity: .5; cursor: not-allowed; }
.loading-container, .error-container, .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:64px 32px; text-align:center; }
.loading-spinner { width:32px; height:32px; border:3px solid #f0f0f0; border-top:3px solid #FF5722; border-radius:50%; animation:spin 1s linear infinite; margin-bottom:16px; }
@keyframes spin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
.error-message { color:#d32f2f; margin-bottom:16px; font-size:16px; }
.retry-button { padding:12px 24px; background-color:#FF5722; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:500; }
.modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background-color:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000;}
.modal-content { background-color: #ffffff; border-radius: 12px; width: 464px; max-width: 90vw; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; }
.modal-scroll-container { overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 24px 0 24px; }
.modal-header h2 { font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 700; }
.close-btn-circle { background-color: #FD5725; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: opacity 0.2s; }
.view-modal-body { padding: 16px 24px; }
.profile-header { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 24px; }
.profile-label { font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 14px; }
.user-avatar { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background-color: #f0f0f0; }
.avatar-image { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.avatar-placeholder { font-size: 24px; font-weight: 600; color: #666; }
.details-grid { display: flex; flex-direction: column; gap: 20px; }
.detail-row { display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; }
.detail-item { display: flex; flex-direction: column; gap: 8px; }
.detail-item label { font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; }
.detail-item span { font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 400; }
.view-modal-footer { padding: 16px 24px 24px 24px; }
.btn-full-width { width: 100%; height: 44px; font-size: 14px; font-family: 'Montserrat', sans-serif; font-weight: 600; border-radius: 8px; background-color: #FD5725; color: white; border: none; cursor: pointer; }
.modal-content.edit-modal-content { max-width: 484px; }
.edit-modal-body { padding: 20px; }
.edit-form { display: flex; flex-direction: column; gap: 15px; }
.edit-form .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.edit-form .form-group { display: flex; flex-direction: column; gap: 8px; }
.edit-form label { font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; }
.edit-modal-content .edit-form input, .edit-modal-content .edit-form select, .edit-modal-content .edit-form .file-label { font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 400; height: 40px; padding: 8px 12px; border: 1px solid #E0E0E0; border-radius: 6px; outline: none; width: 100%; background-color: white; }
.edit-modal-content .edit-form input::placeholder { color: #98A2B3; }
.edit-form .select-wrapper, .edit-form .input-with-icon { position: relative; }
.edit-modal-content .edit-form .input-with-icon input { padding-right: 36px; }
.edit-form .icon { position: absolute; top: 50%; right: 12px; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; pointer-events: none; }
.edit-form .icon--clickable { pointer-events: auto; cursor: pointer; }
.edit-modal-footer { padding: 20px 24px; }
.edit-modal-footer .submit-btn { width: 100%; height: 44px; background-color: #FD5725; color: white; border: none; border-radius: 8px; font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; }
.edit-modal-footer .submit-btn:disabled { background-color: #ccc; cursor: not-allowed; }
.edit-modal-content select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
.edit-modal-content input[type="date"]::-webkit-calendar-picker-indicator { display: none; }
.custom-file-input input[type="file"] { display: none; }
.file-label { display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
@media (max-width: 1024px) { .main-content { margin-left:0; } .sidebar { transform:translateX(-100%); } .sidebar.open { transform:translateX(0); } .content-header .menu-toggle { display: block; } }
@media (max-width:768px) { .content-header { margin:16px; padding:12px 16px; flex-direction: column; align-items: flex-start; } .header-main { flex-direction: column; width: 100%; align-items: flex-start; gap: 16px; } .content-header h1 { font-size:24px; } .header-actions { flex-direction:column; gap:8px; width:100%; } .add-user-btn, .logout-btn { width: 100%; } .status-badge.registered { min-width: 0; } .edit-form .form-row { grid-template-columns: 1fr; } .details-grid .detail-row { grid-template-columns: 1fr; gap: 16px; } }
</style>