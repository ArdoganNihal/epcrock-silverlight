require("dotenv").config();
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// BuiltWith API'den teknoloji bilgilerini çekme ve sayfa sayısını hesaplama
app.post("/analyze", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const apiKey = process.env.BUILTWITH_API_KEY;
    const response = await fetch(
      `https://api.builtwith.com/v14/api.json?KEY=${apiKey}&LOOKUP=${url}`
    );
    const builtWithData = await response.json();

    if (!builtWithData.Results || builtWithData.Results.length === 0) {
      return res.status(404).json({ error: "No results found for this URL" });
    }

    // Teknolojileri çıkarma
    const technologies = builtWithData.Results.flatMap((result) =>
      result.Result.Paths.flatMap((path) =>
        path.Technologies.map((tech) => ({
          name: tech.Name,
          categories: tech.Categories,
        }))
      )
    );

    // Puppeteer ile sayfa sayısını hesaplama
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const links = await page.evaluate(() => {
      return Array.from(new Set(document.querySelectorAll("a[href]"))).map(
        (link) => link.href
      );
    });
    await browser.close();

    const pageCount = links.length; // Sayfa sayısı olarak alınan link sayısı

    res.json({ technologies, pageCount });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
