import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  getAllGames,
  addGames,
  updateGames,
  deleteGames,
} from "../service.js/GamesService";

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

const PlayCircle = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
  </svg>
);

const Percent = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M7.5 4C5.57 4 4 5.57 4 7.5S5.57 11 7.5 11 11 9.43 11 7.5 9.43 4 7.5 4zM16.5 13c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zM19.07 4.93l-14.14 14.14 1.41 1.41L20.48 6.34 19.07 4.93z"/>
  </svg>
);

const GamesAdminPanel = () => {
  const [games, setGames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    logo: "",
    image: "",
    price: "",
    discount: "",
    isFree: false,
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const data = await getAllGames();
    setGames(data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setFormData(item);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalData = { ...formData };

      if (parseFloat(finalData.price) === 0 || finalData.isFree) {
        finalData.price = "Free";
        finalData.isFree = true;
        finalData.discount = 0;
      }

      if (isEditing) {
        await updateGames(finalData.id, finalData);
      } else {
        await addGames({ ...finalData, id: uuidv4() });
      }

      await fetchGames();
      resetForm();
    } catch (err) {
      alert("Xəta baş verdi");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Silinməsinə əminsiniz?")) return;
    try {
      await deleteGames(id);
      await fetchGames();
    } catch {
      alert("Silinmə zamanı xəta baş verdi");
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      logo: "",
      image: "",
      price: "",
      discount: "",
      isFree: false,
    });
    setIsEditing(false);
    setShowModal(false);
  };

  const freeGames = games.filter(game => game.isFree || game.price === "Free");
  const gamesOnSale = games.filter(game => parseFloat(game.discount) > 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <PlayCircle className="mr-3 text-blue-400" />
            Oyunlar
          </h1>
          <p className="text-gray-400">Manage your game library and catalog</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
        >
          <Plus className="mr-2" />
          Oyun əlavə et
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Games</p>
              <p className="text-3xl font-bold text-white mt-2">{games.length}</p>
            </div>
            <PlayCircle className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Free Games</p>
              <p className="text-3xl font-bold text-white mt-2">{freeGames.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">On Sale</p>
              <p className="text-3xl font-bold text-white mt-2">{gamesOnSale.length}</p>
            </div>
            <Percent className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Avg. Discount</p>
              <p className="text-3xl font-bold text-white mt-2">
                {gamesOnSale.length > 0 
                  ? Math.round(gamesOnSale.reduce((sum, game) => sum + parseFloat(game.discount || 0), 0) / gamesOnSale.length)
                  : 0}%
              </p>
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
                <th className="px-6 py-4 font-medium">Şəkil</th>
                <th className="px-6 py-4 font-medium">Qiymət</th>
                <th className="px-6 py-4 font-medium">Endirim(%)</th>
                <th className="px-6 py-4 font-medium">Logo</th>
                <th className="px-6 py-4 font-medium text-center">Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {games.map((item) => (
                <tr key={item.id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">
                      {item.title.length > 30 ? item.title.slice(0, 30) + "..." : item.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <img src={item.image} alt="image" className="w-12 h-16 rounded-lg object-cover shadow-md" />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.isFree || item.price === "Free" 
                        ? 'bg-green-600/20 text-green-400' 
                        : 'bg-blue-600/20 text-blue-400'
                    }`}>
                      {item.isFree ? "Free" : item.price}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {parseFloat(item.discount) > 0 ? (
                      <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium">
                        {item.discount}%
                      </span>
                    ) : (
                      <span className="text-gray-500">0%</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <img src={item.logo} alt="logo" className="w-16 h-8 rounded object-contain bg-gray-700/30 p-1" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        title="Redaktə et"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isEditing ? "Oyun Redaktə Et" : "Yeni Oyun Əlavə Et"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["title", "logo", "image"].map((field) => (
                <div key={field} className="space-y-2">
                  <label htmlFor={field} className="block text-sm font-medium text-gray-300 capitalize">
                    {field === "logo" ? "Logo URL" : field === "image" ? "Şəkil URL" : "Başlıq"}
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder={field === "logo" ? "Logo URL" : field === "image" ? "Şəkil URL" : "Başlıq"}
                    required
                  />
                </div>
              ))}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Qiymət</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                  placeholder="Qiymət"
                  disabled={formData.isFree}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Endirim (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  disabled={parseFloat(formData.price) === 0 || formData.price === "Free" || formData.isFree}
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                  placeholder="Endirim"
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div className="flex items-center gap-3 md:col-span-2">
                <input
                  type="checkbox"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label className="text-sm font-medium text-gray-300">Bu oyun pulsuzdur (Free)</label>
              </div>

              <div className="md:col-span-2 flex justify-end gap-4 pt-6 border-t border-gray-700/50">
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  Bağla
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                >
                  {isEditing ? "Yadda saxla" : "Əlavə et"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesAdminPanel;