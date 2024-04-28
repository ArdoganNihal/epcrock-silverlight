const request = require("supertest");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// App'inizi import edin veya direkt burada oluşturun
const app = express();
app.use(cors());
app.use(bodyParser.json()); // express.json() ile aynı işlevi görür

// Dummy analyze route, gerçek route'unuzu buraya entegre edin
app.post("/analyze", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Test için basit bir response
  res.status(200).json({ message: "Success", url });
});

describe("POST /analyze", () => {
  it("should require a URL", async () => {
    const response = await request(app).post("/analyze").send({});
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "URL is required" });
  });

  it("should return a success message for valid URL", async () => {
    const response = await request(app)
      .post("/analyze")
      .send({ url: "https://example.com" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Success");
    expect(response.body).toHaveProperty("url", "https://example.com");
  });

  // Daha fazla test eklenebilir...
});
