import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL;


export const getAllGames = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/games`);
    return res.data;
  } catch (err) {
    console.error("Games almaqda xəta:", err.message);
    return [];
  }
};


export const addGames = async (newGames) => {
  try {
    const res = await axios.post(`${BASE_URL}/games`, newGames);
    return res.data;
  } catch (err) {
    console.error("Games əlavə olunarkən xəta:", err.message);
    return null;
  }
};



export const updateGames = async (id, updatedGames) => {
  try {
    const res = await axios.put(`${BASE_URL}/games/${id}`, updatedGames);
    return res.data;
  } catch (err) {
    console.error("Games yenilənərkən xəta:", err.message);
    return null;
  }
};



export const deleteGames = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/games/${id}`);
    return true;
  } catch (err) {
    console.error("Games silinərkən xəta:", err.message);
    return false;
  }
};
