'use client'
import { useState } from "react";
import { EstimatedValueItems, getItemValueEstimates, UploadFile } from "./actions";
import Card from "./card";

export default function Home() {
  const [fileUri, setFileUri] = useState('gs://cardmedia_ingest/SportsAlbumHeyMickey5.mp4');
  const [status, setStatus] = useState<'success' | 'error' | 'loading' | 'uploading'>('success');
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
    getEstimates({ fileUri })
  }


  async function handleUploadClick(formData: FormData) {
    setStatus('uploading');
    const { fileUri } = await UploadFile(formData);
    getEstimates({ fileUri });
  }
  return (
    <main>
      <h1>Trading Card Sale Pricer</h1>
      <div className="flex w-full justify-around">
        <form action={handleUploadClick} className="border border-white/20 p-4">
          <input type='file' name='file' />
          <button onClick={() => setStatus('uploading')} type="submit" disabled={status === 'loading' || status === 'uploading'} className="border-2 p-1 enabled:hover:text-white enabled:hover:bg-black rounded disabled:text-white/50">
            Upload
          </button>
        </form>
        <div>OR</div>
        <form onSubmit={handleClick} className="border border-white/20 p-4">
          <input
            placeholder="New Favorite Thing"
            value={fileUri}
            onChange={(e) => setFileUri(e.target.value)}
            className="border-black border-2 text-black p-1 w-full"
            disabled={status === 'loading' || status === 'uploading'}
          />
          <button type="submit" disabled={status === 'loading' || status === 'uploading'} className="border-2 p-1 enabled:hover:text-white enabled:hover:bg-black rounded disabled:text-white/50">
            {'Search Video For Valuable Trading Cards ->'}
          </button>
        </form>
      </div>
      <div className={`transition-opacity duration-1000 overflow-x-clip pointer-events-none ${(status === 'loading' || status === 'uploading') ? 'opacity-100' : 'opacity-0'} h-0`}>
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