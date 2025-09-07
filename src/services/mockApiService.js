// mockService.js - Mock Backend Service untuk Testing UI

// Generate sample base64 image (1x1 pixel PNG)
const generateSamplePhoto = () => {
  // This is a tiny 1x1 pixel PNG image in base64
  return '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
};

// Mock user data
const mockUsers = [
  {
    _id: '674d8b123456789012345001',
    account_id: 'USR001',
    first_name: 'Ahmad',
    last_name: 'Santoso',
    name: 'Ahmad Santoso',
    email: 'ahmad.santoso@example.com',
    phone: '081234567890',
    address: 'Jl. Merdeka No. 123, Jakarta Pusat',
    gender: 'male',
    date_of_birth: '1990-05-15T00:00:00.000Z',
    photo: generateSamplePhoto(),
    created_at: '2024-12-02T10:30:00.000Z',
    updated_at: '2024-12-02T10:30:00.000Z'
  },
  {
    _id: '674d8b123456789012345002',
    account_id: 'USR002',
    first_name: 'Siti',
    last_name: 'Nurhaliza',
    name: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@example.com',
    phone: '081234567891',
    address: 'Jl. Sudirman No. 456, Jakarta Selatan',
    gender: 'female',
    date_of_birth: '1992-08-22T00:00:00.000Z',
    photo: null,
    created_at: '2024-12-01T09:15:00.000Z',
    updated_at: '2024-12-01T09:15:00.000Z'
  },
  {
    _id: '674d8b123456789012345003',
    account_id: 'USR003',
    first_name: 'Budi',
    last_name: 'Prasetyo',
    name: 'Budi Prasetyo',
    email: 'budi.prasetyo@example.com',
    phone: '081234567892',
    address: 'Jl. Gatot Subroto No. 789, Jakarta Barat',
    gender: 'male',
    date_of_birth: '1988-12-03T00:00:00.000Z',
    photo: generateSamplePhoto(),
    created_at: '2024-11-30T14:45:00.000Z',
    updated_at: '2024-11-30T14:45:00.000Z'
  },
  {
    _id: '674d8b123456789012345004',
    account_id: 'USR004',
    first_name: 'Dewi',
    last_name: 'Sartika',
    name: 'Dewi Sartika',
    email: 'dewi.sartika@example.com',
    phone: '081234567893',
    address: 'Jl. Thamrin No. 321, Jakarta Pusat',
    gender: 'female',
    date_of_birth: '1995-03-18T00:00:00.000Z',
    photo: null,
    created_at: '2024-11-29T11:20:00.000Z',
    updated_at: '2024-11-29T11:20:00.000Z'
  },
  {
    _id: '674d8b123456789012345005',
    account_id: 'USR005',
    first_name: 'Rizki',
    last_name: 'Ramadhan',
    name: 'Rizki Ramadhan',
    email: 'rizki.ramadhan@example.com',
    phone: '081234567894',
    address: 'Jl. Kebon Sirih No. 654, Jakarta Timur',
    gender: 'male',
    date_of_birth: '1993-07-09T00:00:00.000Z',
    photo: generateSamplePhoto(),
    created_at: '2024-11-28T16:10:00.000Z',
    updated_at: '2024-11-28T16:10:00.000Z'
  },
  {
    _id: '674d8b123456789012345006',
    account_id: 'USR006',
    first_name: 'Maya',
    last_name: 'Indira',
    name: 'Maya Indira',
    email: 'maya.indira@example.com',
    phone: '081234567895',
    address: 'Jl. Rasuna Said No. 987, Jakarta Selatan',
    gender: 'female',
    date_of_birth: '1991-11-25T00:00:00.000Z',
    photo: null,
    created_at: '2024-11-27T08:30:00.000Z',
    updated_at: '2024-11-27T08:30:00.000Z'
  },
  {
    _id: '674d8b123456789012345007',
    account_id: 'USR007',
    first_name: 'Andi',
    last_name: 'Wijaya',
    name: 'Andi Wijaya',
    email: 'andi.wijaya@example.com',
    phone: '081234567896',
    address: 'Jl. Cikini No. 147, Jakarta Pusat',
    gender: 'male',
    date_of_birth: '1989-01-12T00:00:00.000Z',
    photo: generateSamplePhoto(),
    created_at: '2024-11-26T13:45:00.000Z',
    updated_at: '2024-11-26T13:45:00.000Z'
  },
  {
    _id: '674d8b123456789012345008',
    account_id: 'USR008',
    first_name: 'Lestari',
    last_name: 'Putri',
    name: 'Lestari Putri',
    email: 'lestari.putri@example.com',
    phone: '081234567897',
    address: 'Jl. Menteng No. 258, Jakarta Pusat',
    gender: 'female',
    date_of_birth: '1994-06-30T00:00:00.000Z',
    photo: null,
    created_at: '2024-11-25T10:15:00.000Z',
    updated_at: '2024-11-25T10:15:00.000Z'
  },
  {
    _id: '674d8b123456789012345009',
    account_id: 'USR009',
    first_name: 'Faisal',
    last_name: 'Rahman',
    name: 'Faisal Rahman',
    email: 'faisal.rahman@example.com',
    phone: '081234567898',
    address: 'Jl. Kuningan No. 369, Jakarta Selatan',
    gender: 'male',
    date_of_birth: '1987-09-14T00:00:00.000Z',
    photo: generateSamplePhoto(),
    created_at: '2024-11-24T15:50:00.000Z',
    updated_at: '2024-11-24T15:50:00.000Z'
  },
  {
    _id: '674d8b123456789012345010',
    account_id: 'USR010',
    first_name: 'Indah',
    last_name: 'Permata',
    name: 'Indah Permata',
    email: 'indah.permata@example.com',
    phone: '081234567899',
    address: 'Jl. Pancoran No. 741, Jakarta Selatan',
    gender: 'female',
    date_of_birth: '1996-02-28T00:00:00.000Z',
    photo: null,
    created_at: '2024-11-23T12:25:00.000Z',
    updated_at: '2024-11-23T12:25:00.000Z'
  },
  {
    _id: '674d8b123456789012345011',
    account_id: 'USR011',
    first_name: 'Dimas',
    last_name: 'Satria',
    name: 'Dimas Satria',
    email: 'dimas.satria@example.com',
    phone: '081234567800',
    address: 'Jl. Kemang No. 852, Jakarta Selatan',
    gender: 'male',
    date_of_birth: '1990-10-07T00:00:00.000Z',
    photo: generateSamplePhoto(),
    created_at: '2024-11-22T09:40:00.000Z',
    updated_at: '2024-11-22T09:40:00.000Z'
  },
  {
    _id: '674d8b123456789012345012',
    account_id: 'USR012',
    first_name: 'Ratna',
    last_name: 'Sari',
    name: 'Ratna Sari',
    email: 'ratna.sari@example.com',
    phone: '081234567801',
    address: 'Jl. Blok M No. 963, Jakarta Selatan',
    gender: 'female',
    date_of_birth: '1993-04-21T00:00:00.000Z',
    photo: null,
    created_at: '2024-11-21T14:30:00.000Z',
    updated_at: '2024-11-21T14:30:00.000Z'
  }
];

// Simulate network delay
const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Authentication Service
export const mockAuthService = {
  async login(credentials) {
    await delay(1500);
    
    // Simulate login validation
    if (credentials.email === 'admin@email.com' && credentials.password) {
      return {
        data: {
          data: {
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: 'admin-001',
              email: credentials.email,
              name: 'Admin User'
            }
          }
        }
      };
    } else {
      throw {
        response: {
          status: 401,
          data: {
            err_message: 'Email atau password salah'
          }
        }
      };
    }
  },

  async register(formData) {
    await delay(2000);
    
    // Simulate registration success
    const newUserId = 'usr_' + Date.now();
    
    return {
      data: {
        success: true,
        data: {
          id: newUserId,
          message: 'User berhasil didaftarkan'
        }
      }
    };
  }
};

// Mock User Service
export const mockUserService = {
  async getUsers(page = 1, limit = 10) {
    await delay(1200);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = mockUsers.slice(startIndex, endIndex);
    
    return {
      data: {
        success: true,
        data: paginatedUsers,
        total: mockUsers.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(mockUsers.length / limit)
      }
    };
  },

  async getUserById(userId) {
    await delay(800);
    
    const user = mockUsers.find(u => u._id === userId);
    
    if (user) {
      return {
        data: {
          success: true,
          data: user
        }
      };
    } else {
      throw {
        response: {
          status: 404,
          data: {
            message: 'User tidak ditemukan'
          }
        }
      };
    }
  },

  async updateUser(userId, formData) {
    await delay(1500);
    
    const userIndex = mockUsers.findIndex(u => u._id === userId);
    
    if (userIndex !== -1) {
      // Simulate update
      const updatedUser = {
        ...mockUsers[userIndex],
        first_name: formData.get('first_name') || mockUsers[userIndex].first_name,
        last_name: formData.get('last_name') || mockUsers[userIndex].last_name,
        email: formData.get('email') || mockUsers[userIndex].email,
        phone: formData.get('phone') || mockUsers[userIndex].phone,
        address: formData.get('address') || mockUsers[userIndex].address,
        gender: formData.get('gender') || mockUsers[userIndex].gender,
        date_of_birth: formData.get('date_of_birth') || mockUsers[userIndex].date_of_birth,
        updated_at: new Date().toISOString()
      };
      
      // Update name field
      updatedUser.name = `${updatedUser.first_name} ${updatedUser.last_name}`;
      
      // Handle photo update
      if (formData.get('photo')) {
        updatedUser.photo = generateSamplePhoto();
      }
      
      // Update the mock data
      mockUsers[userIndex] = updatedUser;
      
      return {
        data: {
          success: true,
          data: updatedUser
        }
      };
    } else {
      throw {
        response: {
          status: 404,
          data: {
            message: 'User tidak ditemukan'
          }
        }
      };
    }
  },

  async deleteUser(userId) {
    await delay(1000);
    
    const userIndex = mockUsers.findIndex(u => u._id === userId);
    
    if (userIndex !== -1) {
      const deletedUser = mockUsers.splice(userIndex, 1)[0];
      return {
        data: {
          success: true,
          data: deletedUser
        }
      };
    } else {
      throw {
        response: {
          status: 404,
          data: {
            message: 'User tidak ditemukan'
          }
        }
      };
    }
  }
};

// Replace your original services with mock versions
// Add this to your main component or create a separate mock setup file

export const setupMockServices = () => {
  // Override the original services
  window.mockServices = {
    authService: mockAuthService,
    userService: mockUserService
  };
  
  console.log('Mock services initialized successfully!');
  console.log('Available users:', mockUsers.length);
  console.log('Test login credentials: admin@email.com with any password');
};

// Auto-setup when this file is imported
setupMockServices();