import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getAllSliders, addSlider, updateSlider, deleteSlider } from "../service.js/SlideService";

// SVG Icons
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

const SliderAdminPanel = () => {
  const [sliders, setSliders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    subtitle: "",
    description: "",
    price: "",
    logo: "",
    image: "",
    mobImg: "",
    thumbnail: "",
    gameId: "",
    isFree: false
  });
  const [isEditing, setIsEditing] = useState(false);

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    const isFree = item.price === "Free" || item.price === "$0";
    setFormData({ ...item, isFree });
    setIsEditing(true);
    setShowModal(true);
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    const data = await getAllSliders();
    setSliders(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const finalPrice = formData.isFree ? "Free" : formData.price;

      const finalData = {
        ...formData,
        price: finalPrice,
      };

      if (isEditing) {
        await updateSlider(finalData.id, finalData);
      } else {
        const newItem = { ...finalData, id: uuidv4() };
        await addSlider(newItem);
      }

      await fetchSliders();
      resetForm();
    } catch (error) {
      alert("Əməliyyat zamanı xəta baş verdi");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Silinməsinə əminsən?")) return;
    try {
      await deleteSlider(id);
      await fetchSliders();
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
      }));
    } else if (name === "price") {
      const formattedPrice = value === "0" || value === "0.00" ? "Free" : `$${value}`;
      setFormData((prev) => ({
        ...prev,
        price: formattedPrice,
        isFree: formattedPrice === "Free"
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEdit = (item) => {
    openEditModal(item);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      subtitle: "",
      description: "",
      price: "",
      logo: "",
      image: "",
      mobImg: "",
      thumbnail: "",
      gameId: "",
      isFree: false
    });
    setIsEditing(false);
    setShowModal(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Slaydlar</h1>
          <p className="text-gray-400">Manage your homepage sliders</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
        >
          <Plus className="mr-2" />
          Slayd Əlavə Et
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-700/50 text-gray-400 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-4 font-medium">Başlıq</th>
                <th className="px-6 py-4 font-medium">Alt başlıq</th>
                <th className="px-6 py-4 font-medium">Qiymət</th>
                <th className="px-6 py-4 font-medium">Thumbnail</th>
                <th className="px-6 py-4 font-medium text-center">Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {sliders.map((item) => (
                <tr key={item.id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{item.title}</td>
                  <td className="px-6 py-4 text-gray-300">{item.subtitle}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.price === "Free" ? 'bg-green-600/20 text-green-400' : 'bg-blue-600/20 text-blue-400'
                    }`}>
                      {item.price}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <img src={item.thumbnail} alt="thumb" className="w-16 h-10 rounded-lg object-cover" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
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
                {isEditing ? "Slaydı Redaktə Et" : "Slayd Əlavə Et"}
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

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "title", label: "Başlıq" },
                { name: "subtitle", label: "Alt başlıq" },
                { name: "logo", label: "Logo URL" },
                { name: "image", label: "Şəkil URL" },
                { name: "mobImg", label: "Mobil şəkil URL" },
                { name: "thumbnail", label: "Thumbnail URL" },
                { name: "gameId", label: "Oyun ID" },
              ].map(({ name, label }) => (
                <div key={name} className="space-y-2">
                  <label htmlFor={name} className="block text-sm font-medium text-gray-300">
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    placeholder={label}
                    value={
                      name === "price"
                        ? (formData.price || "").replace(/[^0-9.]/g, "")
                        : formData[name] || ""
                    }
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required={name !== "price"}
                    type={name === "price" ? "number" : "text"}
                  />
                </div>
              ))}

              <div className="space-y-2 md:col-span-3">
                <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                  Qiymət
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Qiymət"
                  value={
                    formData.isFree
                      ? ""
                      : (formData.price || "").replace(/[^0-9.]/g, "")
                  }
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={formData.isFree}
                />
                <div className="flex items-center gap-3 mt-3">
                  <input
                    id="isFree"
                    name="isFree"
                    type="checkbox"
                    checked={formData.isFree}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="isFree" className="text-sm font-medium text-gray-300">
                    Bu oyun pulsuzdur (Free)
                  </label>
                </div>
              </div>

              <div className="space-y-2 md:col-span-3">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                  Təsvir
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Təsvir"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  required
                />
              </div>

              <div className="md:col-span-3 flex justify-end gap-4 pt-6 border-t border-gray-700/50">
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
                  type="submit"
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-colors"
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

export default SliderAdminPanel;