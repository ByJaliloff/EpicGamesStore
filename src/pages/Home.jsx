import Card from "../components/Card";
import Loader from "../components/Loader";
import SearchNav from "../components/SearchNav";
import Slider from "../components/Slider";
import { GameContext } from "../context/DataContext";
import { useContext } from "react";

export default function Home() {


  const { slides, games, dlcs, loading, error } = useContext(GameContext);

  if (loading) return <Loader />

  return (
    <>
      <SearchNav />
      <Slider slides={slides} games={games} />
      <Card games={games} dlcs={dlcs} loading={loading} error={error} />
    </>
  );
}
