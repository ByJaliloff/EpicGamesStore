import { useContext } from "react";
import SearchNav from "../components/SearchNav";
import { GameContext } from "../context/DataContext";

const getDateValue = (dateStr) => {
  if (dateStr === "now") return 0;
  
  const match = dateStr.match(/^(\d+)([hd])\s*ago$/);
  if (!match) return Infinity; 
  
  const [, num, unit] = match;
  const value = parseInt(num);
  
  if (unit === 'h') return value; 
  if (unit === 'd') return value * 24;
  
  return Infinity;
};

export default function NewsSection() {
  const { news } = useContext(GameContext);

  const sortedNews = [...news].sort((a, b) => {
    return getDateValue(a.date) - getDateValue(b.date);
  });

  return (
    <>
      <SearchNav />
      <div className="bg-[#101014]">
        <div className="max-w-[95%] md:max-w-[82%] mx-auto px-[3.5%] py-8">
          <h2 className="text-white text-[18px] font-bold mb-6">Epic Games News</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {sortedNews.slice(0, 2).map((newsItem) => (
              <div
                key={newsItem.id}
                className="flex flex-col justify-between min-h-[400px] rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <a
                  href={newsItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg mb-4 overflow-hidden"
                >
                  <img src={newsItem.image} alt={newsItem.title} className="rounded-lg w-full h-40 sm:h-48 md:h-56 lg:h-72.5 object-cover transition duration-300 filter hover:brightness-120" />
                </a>

                <div className="flex flex-col flex-1">
                  <p className="text-[#ffffffa6] text-[9px] tracking-[1px] font-extrabold mb-2 uppercase">
                    {newsItem.date}
                  </p>

                  <a
                    href={newsItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-bold text-[14px] my-4 leading-[20px] tracking-[0.2px]"
                  >
                    {newsItem.title}
                  </a>

                  <p className="text-[#ffffffa6] font-semibold my-4 leading-[20px] tracking-[0.2px]">
                    {newsItem.description}
                  </p>

                  <a
                    href={newsItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-white border-b border-gray-500 hover:border-gray-300 transition-colors duration-200 w-max"
                  >
                    Read more
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            {sortedNews.slice(2).map((newsItem) => (
              <div
                key={newsItem.id}
                className="flex flex-col md:flex-row gap-4 mb-[30px] pt-[20px] border-t border-gray-500 hover:shadow-md transition-shadow duration-200"
              >
                <a
                  href={newsItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block md:w-[200px] rounded-lg overflow-hidden"
                >
                  <img
                    src={newsItem.image}
                    alt={newsItem.title}
                    className="w-full h-auto md:h-24 object-cover rounded-lg transition duration-300 filter hover:brightness-120"
                  />
                </a>

                <div className="flex flex-col justify-between flex-1">
                  <p className="text-[#ffffffa6] text-[9px] tracking-[1px] font-extrabold mb-2 uppercase">
                    {newsItem.date}
                  </p>

                  <a
                    href={newsItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-bold my-2 text-[14px] leading-[20px] tracking-[0.2px]"
                  >
                    {newsItem.title}
                  </a>

                  <p className="text-[#ffffffa6] font-semibold mb-2 text-[14px] leading-[20px] tracking-[0.2px]">
                    {newsItem.description}
                  </p>

                  <a
                    href={newsItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-white border-b border-gray-500 hover:border-gray-300 transition-colors duration-200 w-max"
                  >
                    Read more
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}