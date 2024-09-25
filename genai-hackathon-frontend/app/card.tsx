'use client'

export default function Card({ status }: { status: string }) {
  return (
    <div className="card-wrapper">
      <div className="card">
        <div className="card-front">
          <div className="card-front-contents">
            <div className="card-image-wrapper">
              <img
                className="front-image"
                src={status === 'uploading' ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Google_Cloud_storage.svg/128px-Google_Cloud_storage.svg.png" : "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg"}
                alt="Mad Hatter"
              />
            </div>
            <div className="card-description">
              <h1 className="title">{status === 'uploading' ? "Uploading" : "Generating"}</h1>
              <p className="description">
                {status === 'uploading' ? "Sending your file to Google Cloud Storage." : "Asking Gemini to estimate the value of these cards."}
              </p>
            </div>
          </div>
        </div>
        <div className="card-back">
          <div className="card-back-contents">
            <img
              className="back-image"
              src="https://upload.wikimedia.org/wikipedia/commons/0/05/Vertex_AI_Logo.svg"
              alt="Rabbit"
            />
          </div>
        </div>
      </div>
    </div>
  );
}