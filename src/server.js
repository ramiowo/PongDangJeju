const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = 3001;

app.get("/api/tourist-spots", async (req, res) => {
  const { latitude, longitude } = req.query;
  try {
    const response = await fetch(
      `https://apis.data.go.kr/B551011/GeoLocationBasedService/locationBasedList?serviceKey=jLc6WUPu4%2FUfB6qk2uZSC2HzMF8WKzB7SqFCxxg0UgzZt6xgJiCfUddlWVXOJzjSGbJoQiqJxXuXzu%2BEEyELJg%3D%3DY&mapX=${longitude}&mapY=${latitude}&radius=2000&listYN=Y&arrange=E&numOfRows=10&pageNo=1`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
