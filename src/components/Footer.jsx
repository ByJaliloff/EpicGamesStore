import { FaFacebookF, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sections = [
    {
      title: "Games",
      items: ["Fortnite", "Fall Guys", "Rocket League", "Unreal Tournament", "Infinity Blade", "Shadow Complex", "Robo Recall"],
    },
    {
      title: "Marketplaces",
      items: ["Epic Games Store", "Fab", "Sketchfab", "ArtStation", "Store Refund Policy", "Store EULA"],
    },
    {
      title: "Tools",
      items: ["Unreal Engine", "UEFN", "MetaHuman", "Twinmotion", "Megascans", "RealityScan", "Rad Game Tools"],
    },
    {
      title: "Online Services",
      items: ["Epic Online Services", "Kids Web Services", "Services Agreement", "Acceptable Use Policy", "Trust Statement", "Subprocessor List"],
    },
    {
      title: "Company",
      items: ["About", "Newsroom", "Careers", "Students", "UX Research"],
    },
    {
      title: "Resources",
      items: [
        "Dev Community", "MegaGrants", "Support-A-Creator", "Creator Agreement",
        "Distribute on Epic Games", "Unreal Engine Branding Guidelines", "Fan Art Policy",
        "Community Rules", "EU Digital Services Act Inquiry", "Epic Pro Support"
      ],
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <footer className="bg-[#18181C] text-white text-sm pt-10">
      <div className="max-w-[93%] mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:items-center mb-8  pb-4">
          <Link to="/">
            <img src="/icons/store.svg" alt="Store Logo" className="h-10 select-none object-contain" />
          </Link>
          <div className="flex items-center gap-4 text-gray-400 select-none">
            <FaFacebookF size={25} />
            <FaXTwitter size={25} />
            <FaYoutube size={25} />
          </div>
        </div>

        <div>
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-6 border-b border-t border-gray-700 py-6">
              {sections.map(({ title, items }) => (
                <div key={title} className="min-w-[150px]">
                  <h3 className="font-bold mb-3 text-[20px]">{title}</h3>
                  <ul className="text-gray-300">
                    {items.map((item) => (
                      <li key={item} className="select-text text-[#ffffffa6] py-1.5">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          <div className="md:hidden flex flex-col gap-4">
            {sections.map(({ title, items }, index) => (
              <div key={title}>
                <div
                  className="flex justify-between items-center text-[18px] font-bold py-2 border-b border-gray-700 cursor-pointer"
                  onClick={() => toggleSection(index)}
                >
                  <span>{title}</span>
                  {openIndex === index ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
                {openIndex === index && (
                  <ul className="text-gray-300 pl-2 pt-2">
                    {items.map((item) => (
                      <li key={item} className="select-text text-[#ffffffa6] py-1.5 font-semibold">{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-gray-400 text-xs text-center md:text-left select-text">
          <p>
            © 2025, Epic Games, Inc. All rights reserved. Epic, Epic Games, the Epic Games logo, Fortnite, the Fortnite logo, Unreal, Unreal Engine, the Unreal Engine logo, Unreal Tournament, and the Unreal Tournament logo are trademarks or registered trademarks of Epic Games, Inc. in the United States of America and elsewhere. Other brands or product names are the trademarks of their respective owners.
          </p>
        </div>

        <div className="flex justify-end mt-6">
            <button
              onClick={scrollToTop}
              className="bg-[#3A3A3E] hover:bg-[#69696B] px-5 py-3 rounded text-white text-sm cursor-pointer font-semibold flex items-center gap-2"
            >
              Back to top
              <img src="/icons/up-arrow.png" alt="Up arrow" className="w-4 h-4" />
            </button>

        </div>
      </div>
    </footer>
  );
}
