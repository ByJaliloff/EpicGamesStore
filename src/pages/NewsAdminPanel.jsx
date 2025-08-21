import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getAllNews, addNews, updateNews, deleteNews } from "../service.js/NewsService";

// Utility function to generate relative time for new articles
const generateRelativeTime = () => {
  return "now";
};

// Utility function to convert relative time to actual date for filtering
const parseRelativeTime = (relativeString) => {
  if (relativeString === "now") {
    return new Date();
  }
  
  const match = relativeString.match(/(\d+)([smhd]|mo|y)\s*ago/);
  if (!match) return new Date();
  
  const value = parseInt(match[1]);
  const unit = match[2];
  const now = new Date();
  
  switch (unit) {
    case 's': return new Date(now - value * 1000);
    case 'm': return new Date(now - value * 60 * 1000);
    case 'h': return new Date(now - value * 60 * 60 * 1000);
    case 'd': return new Date(now - value * 24 * 60 * 60 * 1000);
    case 'mo': return new Date(now - value * 30 * 24 * 60 * 60 * 1000);
    case 'y': return new Date(now - value * 365 * 24 * 60 * 60 * 1000);
    default: return new Date();
  }
};

const Edit = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const Trash = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

const Plus = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

const Newspaper = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
  </svg>
);

const NewsAdminPanel = () => {
  const [newsList, setNewsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    image: "",
    link: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    const { date, ...editableData } = item;
    setFormData(editableData);
    setIsEditing(true);
    setShowModal(true);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const data = await getAllNews();
    setNewsList(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const originalItem = newsList.find(item => item.id === formData.id);
        const updatedData = { 
          ...formData, 
          date: originalItem.date 
        };
        await updateNews(formData.id, updatedData);
      } else {
        const newItem = { 
          ...formData, 
          id: uuidv4(),
          date: generateRelativeTime() 
        };
        await addNews(newItem);
      }
      await fetchNews();
      resetForm();
    } catch (error) {
      alert("Əməliyyat zamanı xəta baş verdi");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Silinməsinə əminsən?")) return;
    try {
      await deleteNews(id);
      await fetchNews();
    } catch (error) {
      alert("Silinmə zamanı xəta baş verdi");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      description: "",
      image: "",
      link: ""
    });
    setIsEditing(false);
    setShowModal(false);
  };

  const getRecentArticles = () => {
    return newsList.filter(item => {
      const itemDate = parseRelativeTime(item.date);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return itemDate > weekAgo;
    }).length;
  };

  const getThisMonthArticles = () => {
    return newsList.filter(item => {
      const itemDate = parseRelativeTime(item.date);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
    }).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Newspaper className="mr-3 text-orange-400" />
            Xəbərlər
          </h1>
          <p className="text-gray-400">Manage your news articles and updates</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
        >
          <Plus className="mr-2" />
          Xəbər Əlavə Et
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Articles</p>
              <p className="text-3xl font-bold text-white mt-2">{newsList.length}</p>
            </div>
            <Newspaper className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Recent Articles</p>
              <p className="text-3xl font-bold text-white mt-2">{getRecentArticles()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold text-white mt-2">{getThisMonthArticles()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-700/50 text-gray-400 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-4 font-medium">Başlıq</th>
                <th className="px-6 py-4 font-medium">Təsvir</th>
                <th className="px-6 py-4 font-medium">Tarix</th>
                <th className="px-6 py-4 font-medium">Şəkil</th>
                <th className="px-6 py-4 font-medium text-center">Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((item) => (
                <tr key={item.id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">
                      {item.title.length > 30 ? item.title.slice(0, 30) + "..." : item.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-300 max-w-xs">
                      {item.description.length > 50 ? item.description.slice(0, 50) + "..." : item.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                      {item.date}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <img src={item.image} alt="news" className="w-16 h-10 rounded-lg object-cover" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        title="Redaktə"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isEditing ? "Xəbəri Redaktə Et" : "Xəbər Əlavə Et"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "title", label: "Başlıq" },
                { name: "image", label: "Şəkil URL" },
                { name: "link", label: "Xəbər Linki" },
              ].map(({ name, label }) => (
                <div key={name} className="space-y-2">
                  <label htmlFor={name} className="block text-sm font-medium text-gray-300">
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    placeholder={label}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    type="text"
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              ))}

              {isEditing && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Tarix (Avtomatik)
                  </label>
                  <div className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-gray-400">
                    {(() => {
                      const originalItem = newsList.find(item => item.id === formData.id);
                      return originalItem ? originalItem.date : '';
                    })()}
                  </div>
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                  Təsvir
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Təsvir"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                  required
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-4 pt-6 border-t border-gray-700/50">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  Bağla
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg transition-colors"
                >
                  {isEditing ? "Yadda saxla" : "Əlavə et"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsAdminPanel;