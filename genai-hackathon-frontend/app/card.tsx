'use client'

export default function Card() {
  return (
    <div className="card-wrapper">
      <div className="card">
        <div className="card-front">
          <div className="card-front-contents">
            <div className="card-image-wrapper">
              <img
                className="front-image"
                src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg"
                alt="Mad Hatter"
              />
            </div>
            <div className="card-description">
              <h1 className="title">Estimation in Progress</h1>
              <p className="description">
                Reaching out the Gemini to find the latest information about these cards.
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