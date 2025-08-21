import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL;


export const getAllDlcs = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/dlc&add-onns`);
    return res.data;
  } catch (err) {
    console.error("Dlc almaqda xəta:", err.message);
    return [];
  }
};


export const addDlcs = async (newDlcs) => {
  try {
    const res = await axios.post(`${BASE_URL}/dlc&add-onns`, newDlcs);
    return res.data;
  } catch (err) {
    console.error("Dlc əlavə olunarkən xəta:", err.message);
    return null;
  }
};



export const updateDlcs = async (id, updatedDlcs) => {
  try {
    const res = await axios.put(`${BASE_URL}/dlc&add-onns/${id}`, updatedDlcs);
    return res.data;
  } catch (err) {
    console.error("Dlc yenilənərkən xəta:", err.message);
    return null;
  }
};



export const deleteDlcs = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/dlc&add-onns/${id}`);
    return true;
  } catch (err) {
    console.error("Dlc silinərkən xəta:", err.message);
    return false;
  }
};
