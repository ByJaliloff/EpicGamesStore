import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getAllDlcs, addDlcs, updateDlcs, deleteDlcs } from "../service.js/DlcService";

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

const Package = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2l3.09 1.26L22 5l-6.16 2.58L12 9l-3.84-1.42L2 5l6.91-1.74L12 2zm0 15l4-1.5v-3L12 14l-4-1.5v3L12 17z"/>
    <path d="M2 12l10 4 10-4v5c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-5z"/>
  </svg>
);

const Percent = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M7.5 4C5.57 4 4 5.57 4 7.5S5.57 11 7.5 11 11 9.43 11 7.5 9.43 4 7.5 4zM16.5 13c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zM19.07 4.93l-14.14 14.14 1.41 1.41L20.48 6.34 19.07 4.93z"/>
  </svg>
);

const DlcAdminPanel = () => {
  const [dlcList, setDlcList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    gameId: "",
    title: "",
    image: "",
    shortDescription: "",
    price: "",
    discount: "",
    type: "",
    isFree: false
  });
  const [isEditing, setIsEditing] = useState(false);

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setFormData(item);
    setIsEditing(true);
    setShowModal(true);
  };

  useEffect(() => {
    fetchDlc();
  }, []);

  const fetchDlc = async () => {
    const data = await getAllDlcs();
    setDlcList(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalData = { ...formData };

      if (parseFloat(finalData.price) === 0 || finalData.isFree) {
        finalData.price = "Free";
        finalData.discount = 0;
        finalData.isFree = true;
      }

      if (isEditing) {
        await updateDlcs(finalData.id, finalData);
      } else {
        const newItem = { ...finalData, id: uuidv4() };
        await addDlcs(newItem);
      }

      await fetchDlc();
      resetForm();
    } catch (error) {
      alert("Əməliyyat zamanı xəta baş verdi");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Silinməsinə əminsən?")) return;
    try {
      await deleteDlcs(id);
      await fetchDlc();
    } catch (error) {
      alert("Silinmə zamanı xəta baş verdi");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "isFree") {
      setFormData((prev) => ({
        ...prev,
        isFree: checked,
        price: checked ? "Free" : "",
        discount: checked ? 0 : prev.discount,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      gameId: "",
      title: "",
      image: "",
      shortDescription: "",
      price: "",
      discount: "",
      isFree: false,
      type: ""
    });
    setIsEditing(false);
    setShowModal(false);
  };

  const freeDlcs = dlcList.filter(dlc => dlc.isFree || dlc.price === "Free");
  const dlcsOnSale = dlcList.filter(dlc => parseFloat(dlc.discount) > 0);

  const dlcsByType = dlcList.reduce((acc, dlc) => {
    acc[dlc.type] = (acc[dlc.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Package className="mr-3 text-pink-400" />
            DLC-lər
          </h1>
          <p className="text-gray-400">Manage your downloadable content and expansions</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
        >
          <Plus className="mr-2" />
          DLC Əlavə et
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm font-medium">Total DLCs</p>
              <p className="text-3xl font-bold text-white mt-2">{dlcList.length}</p>
            </div>
            <Package className="w-8 h-8 text-pink-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Free DLCs</p>
              <p className="text-3xl font-bold text-white mt-2">{freeDlcs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">On Sale</p>
              <p className="text-3xl font-bold text-white mt-2">{dlcsOnSale.length}</p>
            </div>
            <Percent className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Avg. Discount</p>
              <p className="text-3xl font-bold text-white mt-2">
                {dlcsOnSale.length > 0 
                  ? Math.round(dlcsOnSale.reduce((sum, dlc) => sum + parseFloat(dlc.discount || 0), 0) / dlcsOnSale.length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-white">DLC Types Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(dlcsByType).map(([type, count]) => (
            <div key={type} className="text-center p-4 bg-gray-700/30 rounded-lg">
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-sm text-gray-300 capitalize">{type}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-700/50 text-gray-400 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-4 font-medium">Başlıq</th>
                <th className="px-6 py-4 font-medium">Tipi</th>
                <th className="px-6 py-4 font-medium">Qiymət</th>
                <th className="px-6 py-4 font-medium">Endirim (%)</th>
                <th className="px-6 py-4 font-medium">Şəkil</th>
                <th className="px-6 py-4 font-medium text-center">Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {dlcList.map((item) => (
                <tr key={item.id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">
                      {item.title.length > 30 ? item.title.slice(0, 30) + "..." : item.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.type === 'addon' ? 'bg-blue-600/20 text-blue-400' :
                      item.type === 'edition' ? 'bg-purple-600/20 text-purple-400' :
                      item.type === 'demo' ? 'bg-green-600/20 text-green-400' :
                      item.type === 'editor' ? 'bg-orange-600/20 text-orange-400' :
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.isFree || item.price === "Free" 
                        ? 'bg-green-600/20 text-green-400' 
                        : 'bg-blue-600/20 text-blue-400'
                    }`}>
                      {item.price}
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
                    <img src={item.image} alt="dlc" className="w-12 h-16 rounded-lg object-cover shadow-md" />
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
                {isEditing ? "DLC Redaktə Et" : "Yeni DLC Əlavə Et"}
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
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="type" className="block text-sm font-medium text-gray-300">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                  required
                >
                  <option value="" disabled>Type seçin</option>
                  <option value="addon">Addon</option>
                  <option value="edition">Edition</option>
                  <option value="demo">Demo</option>
                  <option value="editor">Editor</option>
                </select>
              </div>

              {["gameId", "title", "image"].map((field) => (
                <div key={field} className="space-y-2">
                  <label htmlFor={field} className="block text-sm font-medium text-gray-300">
                    {field === "gameId" ? "Game ID" : 
                     field === "title" ? "Başlıq" : 
                     field === "image" ? "Şəkil URL" : 
                     field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    id={field}
                    name={field}
                    placeholder={field === "gameId" ? "Game ID" : 
                               field === "title" ? "Başlıq" : 
                               field === "image" ? "Şəkil URL" : field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                    type="text"
                    required
                  />
                </div>
              ))}

              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                  Qiymət
                </label>
                <input
                  id="price"
                  name="price"
                  placeholder="Qiymət"
                  value={formData.isFree ? "Free" : formData.price}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors disabled:opacity-50"
                  type="number"
                  disabled={formData.isFree}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="discount" className="block text-sm font-medium text-gray-300">
                  Discount (%)
                </label>
                <input
                  id="discount"
                  name="discount"
                  placeholder="Discount"
                  value={formData.discount}
                  onChange={handleChange}
                  disabled={parseFloat(formData.price) === 0 || formData.price === "Free" || formData.isFree}
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors disabled:opacity-50"
                  type="number"
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
                  className="h-4 w-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
                />
                <label className="text-sm font-medium text-gray-300">Bu DLC pulsuzdur (Free)</label>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                  Təsvir
                </label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  placeholder="Təsvir"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors resize-none"
                  required
                />
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
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-medium rounded-lg transition-colors"
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

export default DlcAdminPanel;