// DetailsPage.js
import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./css/DetailsPage.css";
function DetailsPage() {
  const { state } = useLocation();
  const { technologies, pageCount } = state || {
    technologies: [],
    pageCount: 0,
  };

  return (
    <div className="details-page">
      <Link to="/" className="back-link">
        Back
      </Link>
      <h1 className="results-title">{state.url} Results</h1>
      <p className="page-count">{pageCount} Pages Found</p>
      <div className="technologies-list">
        {technologies.map((tech, index) => (
          <div className="technology-item" key={index}>
            {tech.name}
            {tech.categories && (
              <ul>
                {tech.categories.map((category, catIndex) => (
                  <li key={catIndex}>{category}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetailsPage;
