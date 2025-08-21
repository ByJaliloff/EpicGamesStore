import { useNavigate } from "react-router-dom";
import SearchNav from "../components/SearchNav";

export default function Error() {
  const navigate = useNavigate();

  return (
    <>
      <SearchNav />
      <div className="bg-[#101014] text-white min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden px-4">
        <div className="absolute text-[#27272B] font-extrabold leading-none select-none 
                        text-[clamp(120px,35vw,400px)]">
          404
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-[clamp(20px,4vw,30px)] font-bold mb-6">
            Page Not Found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-[#0078f2] hover:bg-[#1484ff] active:bg-[#0060c9] text-white 
                       text-[11px] sm:text-[13px] w-36 sm:w-40 h-9 sm:h-10 font-semibold 
                       px-5 cursor-pointer rounded transition-all duration-200"
          >
            BACK TO STORE
          </button>
        </div>
      </div>
    </>
  );
}
