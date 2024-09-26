'use client'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { EstimatedValueItems, getItemValueEstimates, UploadFileFromFormData } from "./actions";
import Card from "./card";

export default function Home() {
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

  const onDrop = async (acceptedFiles: File[]) => {
    // Do something with the files
    setStatus('uploading');
    console.log({ acceptedFiles });
    const formData = new FormData();
    formData.append('file', acceptedFiles[0])
    const { fileUri } = await UploadFileFromFormData(formData);
    getEstimates({ fileUri });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  return (
    <main>
      <div {...getRootProps()} className={`
        box-border
        transition-all duration-1000 flex justify-around border-white/20 p-4 m-4
        ${(status === 'loading' || status === 'uploading') ? 'opacity-0' : 'opacity-100'}
        text-balance ${(favoriteThings.length > 0) ? 'text-xl' : 'text-3xl'} font-bold
        border-4 hover:cursor-pointer`}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <center>Drop the files to upload and estimate the value of these cards using Vertex AI and Gemini.</center> :
            <center>Drag 'n' drop some image or video files of trading cards here, or click to select files.</center>
        }
      </div>
      <div className={`transition-opacity duration-1000 overflow-x-clip pointer-events-none ${(status === 'loading' || status === 'uploading') ? 'opacity-100' : 'opacity-0'} h-0`}>
        <Card status={status} />
      </div>
      <center>
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
      </center>
    </main>
  );
}