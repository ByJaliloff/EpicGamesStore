import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL;


export const getAllSliders = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/slider`);
    return res.data;
  } catch (err) {
    console.error("Sliderləri almaqda xəta:", err.message);
    return [];
  }
};

export const addSlider = async (newSlider) => {
  try {
    const res = await axios.post(`${BASE_URL}/slider`, newSlider);
    return res.data;
  } catch (err) {
    console.error("Slider əlavə olunarkən xəta:", err.message);
    return null;
  }
};

export const updateSlider = async (id, updatedSlider) => {
  try {
    const res = await axios.put(`${BASE_URL}/slider/${id}`, updatedSlider);
    return res.data;
  } catch (err) {
    console.error("Slider yenilənərkən xəta:", err.message);
    return null;
  }
};

export const deleteSlider = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/slider/${id}`);
    return true;
  } catch (err) {
    console.error("Slider silinərkən xəta:", err.message);
    return false;
  }
};
