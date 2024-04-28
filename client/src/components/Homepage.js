// HomePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Homepage.css";

function HomePage() {
  const [urlInput, setUrlInput] = useState("");
  const [analysisQueue, setAnalysisQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Kullanıcının önceden yapmış olduğu analizleri localStorage'dan al
    const savedAnalyses = localStorage.getItem("analyses");
    if (savedAnalyses) {
      setAnalysisQueue(JSON.parse(savedAnalyses));
    }
  }, []);

  useEffect(() => {
    // Analiz kuyruğunu localStorage'a kaydet
    localStorage.setItem("analyses", JSON.stringify(analysisQueue));
  }, [analysisQueue]);

  const validURL = (str) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(str);
  };

  const addToQueue = (url) => {
    setAnalysisQueue((prevQueue) => [
      ...prevQueue,
      { url, status: "Analysing..." },
    ]);
  };

  const updateQueueStatus = (url, result) => {
    setAnalysisQueue((prevQueue) =>
      prevQueue.map((item) =>
        item.url === url ? { ...item, ...result, status: "View More" } : item
      )
    );
  };

  const handleViewMoreClick = (url) => {
    // Burada `url`'e göre analiz sonuçlarını buluyoruz
    const analysisResult = analysisQueue.find((item) => item.url === url);
    if (analysisResult) {
      // Detay sayfasına geçiş yap ve sonuçları state olarak geçir
      navigate("/details", { state: analysisResult });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validURL(urlInput)) {
      alert("Please enter a valid URL.");
      return;
    }

    addToQueue(urlInput);

    // Burada API'nize istek gönderin ve yanıtı alın
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: urlInput }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      // Analiz sonuçlarını kuyruğa ekle
      updateQueueStatus(urlInput, result);
    } catch (error) {
      console.error("Error during analysis:", error);
      updateQueueStatus(urlInput, { status: "Failed to analyse" });
    } finally {
      setLoading(false);
      setUrlInput(""); // input alanını temizle
    }
  };

  return (
    <div className="homepage">
      <h1 className="dashboard-title">Silverlight Dashboard</h1>
      <form className="url-form" onSubmit={handleSubmit}>
        <input
          className="url-input"
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter website URL"
          disabled={loading}
        />
        <button
          className="analyze-button"
          type="submit"
          disabled={!validURL(urlInput) || loading}
        >
          Analyse
        </button>
      </form>
      <div className="analysis-section">
        <h2>Analysing Targets</h2>
        <div className="analysis-list">
          {analysisQueue.slice(0, 3).map((item, index) => (
            <div className="analysis-item" key={index}>
              <span>{item.url}</span>
              {item.status === "Analysing..." ? (
                <span>{item.status}</span>
              ) : (
                <button onClick={() => handleViewMoreClick(item.url)}>
                  View More
                </button>
              )}
            </div>
          ))}
        </div>
        {/* Sayfalama kontrolleri burada eklenebilir */}
      </div>
    </div>
  );
}

export default HomePage;
