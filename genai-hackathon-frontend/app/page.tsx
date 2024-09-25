'use client'
import { useState } from "react";
import { EstimatedValueItems, getItemValueEstimates, UploadFile } from "./actions";
import Card from "./card";

export default function Home() {
  const [fileUri, setFileUri] = useState('gs://cardmedia_ingest/SportsAlbumHeyMickey5.mp4');
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('success');
  const [favoriteThings, setFavoriteThings] = useState<EstimatedValueItems[]>([]);

  async function getEstimates({ fileUri }: { fileUri: string }) {
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
  
  async function handleClick(event: React.FormEvent) {
    event.preventDefault();
    getEstimates({fileUri})
  }
  

  async function handleUploadClick(formData: FormData) {
    setStatus('loading');
    const { fileUri } = await UploadFile(formData);
    getEstimates({ fileUri });
  }
  return (
    <main>
      <h1>Trading Card Sale Pricer</h1>
      <form action={handleUploadClick}>
        <input type='file' name='file' />
        <button type="submit" disabled={status === 'loading'} className="border-2 p-1 enabled:hover:text-white enabled:hover:bg-black rounded disabled:text-white/50">
          Upload
        </button>
      </form>
      <form onSubmit={handleClick}>
        <input
          placeholder="New Favorite Thing"
          value={fileUri}
          onChange={(e) => setFileUri(e.target.value)}
          className="border-black border-2 text-black p-1 w-full"
          disabled={status === 'loading'}
        />
        <button type="submit" disabled={status === 'loading'} className="border-2 p-1 enabled:hover:text-white enabled:hover:bg-black rounded disabled:text-white/50">
          {'Search Video For Valuable Trading Cards ->'}
        </button>
      </form>
      <div className={`transition-opacity duration-1000 overflow-x-clip pointer-events-none ${status === 'loading' ? 'opacity-100' : 'opacity-0'} h-0`}>
        <Card status={status} />
      </div>
      <table className={`transition-opacity duration-1000 table-auto ${favoriteThings.length > 0 ? 'opacity-100' : 'opacity-0'} m-10`}>
        <thead>
          <tr className="text-left">
            <th className="text-right px-5">Estimated Value</th>
            <th className="px-5">Player</th>
            <th className="px-5">Manufacturer</th>
            <th className="px-5">Sport</th>
            <th className="px-5">Year</th>
            <th className="px-5">Search on Google</th>
          </tr>
        </thead>
        <tbody>
          {favoriteThings.map((item, index) => <tr key={JSON.stringify(index)} className="text-left border-y border-white/20">
            <td className="text-right px-5">
              {(item.estimatedValueInCents / 100).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              })}
            </td>
            <td className="px-5">{item.playerName}</td>
            <td className="px-5">{item.manufacturer}</td>
            <td className="px-5">{item.sport}</td>
            <td className="px-5">{item.year}</td>
            <td className="px-5">
              <a href={`https://www.google.com/search?q=${item.year} ${item.playerName} ${item.manufacturer} ${item.sport} card`} target="_blank">Learn More ↗</a>
            </td>
          </tr>)}
        </tbody>
      </table>
    </main>
  );
}