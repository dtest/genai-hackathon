'use client'
import { useState } from "react";
import { EstimatedValueItems, getItemValueEstimates } from "./actions";

export default function Home() {
  const [fileUri, setFileUri] = useState('gs://cardmedia_ingest/SportsAlbumHeyMickey5.mp4');
  const [favoriteThings, setFavoriteThings] = useState<EstimatedValueItems[]>([]);
  async function handleClick() {
    const updatedListOfThings = await getItemValueEstimates({ fileUri });
    setFavoriteThings(updatedListOfThings);
  }
  return (
    <main>
      <h1>Trading Card Sale Pricer</h1>
      <input
        placeholder="New Favorite Thing"
        value={fileUri}
        onChange={(e) => setFileUri(e.target.value)}
        className="border-black border-2"
      />
      <button onClick={handleClick} className="border-black border-2 hover:text-white hover:bg-black rounded">
        Search Video For Valuable Trading Cards
      </button>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Estimated Value</th>
            <th>Player</th>
            <th>Manufacturer</th>
            <th>Sport</th>
            <th>Year</th>
            <th>Search on Google</th>
          </tr>
        </thead>
        <tbody>
          {favoriteThings.map(item => <tr key={item.fullTitle}>
            <td>${item.estimatedValueInCents / 100}</td>
            <td>{item.playerName}</td>
            <td>{item.manufacturer}</td>
            <td>{item.sport}</td>
            <td>{item.year}</td>
            <td>
              <a href={`https://www.google.com/search?q=${item.fullTitle}`} target="_blank">Learn More ↗</a>
            </td>
          </tr>)}
        </tbody>
      </table>
    </main>
  );
}