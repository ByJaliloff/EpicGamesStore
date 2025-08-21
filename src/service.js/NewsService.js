import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL;


export const getAllNews = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/news`);
    return res.data;
  } catch (err) {
    console.error("News almaqda xəta:", err.message);
    return [];
  }
};


export const addNews = async (newNews) => {
  try {
    const res = await axios.post(`${BASE_URL}/news`, newNews);
    return res.data;
  } catch (err) {
    console.error("News əlavə olunarkən xəta:", err.message);
    return null;
  }
};



export const updateNews = async (id, updatedNews) => {
  try {
    const res = await axios.put(`${BASE_URL}/news/${id}`, updatedNews);
    return res.data;
  } catch (err) {
    console.error("News yenilənərkən xəta:", err.message);
    return null;
  }
};



export const deleteNews = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/news/${id}`);
    return true;
  } catch (err) {
    console.error("News silinərkən xəta:", err.message);
    return false;
  }
};
