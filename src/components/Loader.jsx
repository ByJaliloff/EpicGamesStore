export default function Loader() {
  return (
    <div
      className="flex items-center justify-center min-h-[300px] sm:min-h-[500px] md:min-h-screen"
      style={{
        background: "linear-gradient(to right, #011E3E, #021837)",
      }}
    >
      <img
        src="/images/epic-loader2.gif"
        alt="Loading..."
        className="w-32 sm:w-40 md:w-52"
      />
    </div>
  );
}
