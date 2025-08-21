import { authInstance } from "../api/axiosInstance";

async function userSignUp(user) {
  try {
    const res = await authInstance.get(`/users?email=${user.email}`);
    if (res.data.length) {
      throw new Error("This email is already registered");
    }

    const { data: newUser } = await authInstance.post(`/users`, {
      ...user,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    });

    return newUser;
  } catch (err) {
    throw new Error(err.message || "Qeydiyyat zamanı xəta baş verdi");
  }
}

async function userLogin({ email, password }) {
  try {
    const { data } = await authInstance.get(`/users?email=${email}`);
    if (!data.length) {
      throw new Error("Belə bir istifadəçi mövcud deyil");
    }

    const user = data[0];

    if (user.password !== password) {
      throw new Error("Şifrə yanlışdır");
    }

    await authInstance.patch(`/users/${user.id}`, {
      lastLogin: new Date().toISOString(),
    });

    return user;
  } catch (err) {
    throw new Error(err.message || "Giriş zamanı xəta baş verdi");
  }
}

async function getAllUsers() {
  try {
    const { data } = await authInstance.get('/users');

    if (Array.isArray(data)) {
      return data;
    } else {
      console.warn('Expected array but got:', typeof data, data);
      return [];
    }
  } catch (err) {
    console.error('Error fetching all users:', err);
    throw new Error(err.message || "İstifadəçilər yüklənərkən xəta baş verdi");
  }
}

async function getUserById(userId) {
  try {
    const { data } = await authInstance.get(`/users/${userId}`);
    return data;
  } catch (err) {
    throw new Error(err.message || "İstifadəçi tapılmadı");
  }
}

async function updateUser(userId, updates) {
  try {
    const { data } = await authInstance.patch(`/users/${userId}`, updates);
    return data;
  } catch (err) {
    throw new Error(err.message || "İstifadəçi yenilənərkən xəta baş verdi");
  }
}

export { 
  userSignUp, 
  userLogin,
  getAllUsers,   
  getUserById,   
  updateUser      
};