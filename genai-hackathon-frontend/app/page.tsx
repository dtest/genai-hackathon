'use client'
import { useState } from "react";
import { EstimatedValueItems, getItemValueEstimates } from "./actions";
import Card from "./card";

export default function Home() {
  const [fileUri, setFileUri] = useState('gs://cardmedia_ingest/SportsAlbumHeyMickey5.mp4');
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('success');
  const [favoriteThings, setFavoriteThings] = useState<EstimatedValueItems[]>([]);
  async function handleClick() {
    setStatus('loading');
    try {
      const updatedListOfThings = await getItemValueEstimates({ fileUri });
      setFavoriteThings(updatedListOfThings);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      console.error(error)
    }
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
      <div className={`transition-opacity overflow-x-clip pointer-events-none ${status === 'loading' ? 'opacity-100' : 'opacity-0'} h-0`}>
        <Card />
      </div>
      <table className={`transition-opacity table-auto w-full ${favoriteThings.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
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
          {favoriteThings.map((item, index) => <tr key={JSON.stringify(index)}>
            <td>
              {(item.estimatedValueInCents / 100).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              })}
            </td>
            <td>{item.playerName}</td>
            <td>{item.manufacturer}</td>
            <td>{item.sport}</td>
            <td>{item.year}</td>
            <td>
              <a href={`https://www.google.com/search?q=${item.year} ${item.playerName} ${item.manufacturer} ${item.sport} card`} target="_blank">Learn More ↗</a>
            </td>
          </tr>)}
        </tbody>
      </table>
    </main>
  );
}