import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL;


const getAllGame = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/games`);
    return res.data;
  } catch (err) {
    console.error(err.message || 'fetch emeliyyatinda xeta bas verdi')
  }
}

const getAllDlc = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/dlc&add-onns`);
    return res.data;
  } catch (err) {
    console.error(err.message || 'fetch emeliyyatinda xeta bas verdi')
  }
}

const getAllAchievement = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/achievements`);
    return res.data;
  } catch (err) {
    console.error(err.message || 'fetch emeliyyatinda xeta bas verdi')
  }
}

const getAllSlide = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/slider`);
    return res.data;
  } catch (err) {
    console.error(err.message || 'fetch emeliyyatinda xeta bas verdi')
  }
}
const getAllNews = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/news`);
    return res.data;
  } catch (err) {
    console.error(err.message || "Xəbərləri gətirərkən xəta baş verdi");
    return [];
  }
};

const getAllFreeGames = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/freegames`);
    return res.data;
  } catch (err) {
    console.error(err.message || "Xəbərləri gətirərkən xəta baş verdi");
    return [];
  }
};



export {
    getAllGame, getAllDlc, getAllAchievement, getAllSlide, getAllNews, getAllFreeGames
}