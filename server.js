import express, { urlencoded } from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']  // Additional headers to be included in the request
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

async function fetchNews(url) {
   try {
    const response = await axios.get(url)
    return {
        status : 200,
        success: true,
        message: "Succesfully fetched the data.",
        data : response.data
    }
   } catch (error) {
    console.error(`API request Error : ${error.message}`);
    return {
        status : 500,
        success: false,
        message: "Failed to fetch the data.",
        error: error.response ? error.response.data : error.message
  }
 }
}

app.get('/all-news', async (req, res) => {
    let q = req.query.q || "world";
    let pageSize = parseInt(req.query.pageSize) || 80;
    let page = parseInt(req.query.page) || 1;

    const result = await fetchNews(`https://newsapi.org/v2/everything?page=${page}&pageSize=${pageSize}&q=${encodeURIComponent(q)}&apikey=${process.env.API_KEY}`)
    res.status(result.status).json(result)
})

app.get("/top-headlines", async (req, res) => {
    let pageSize = parseInt(req.query.pageSize) || 80;
    let page = parseInt(req.query.page) || 1;
    let category = req.query.category || "business";
  
   const result = await fetchNews(`https://newsapi.org/v2/top-headlines?category=${category}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${process.env.API_KEY}`);
   res.status(result.status).json(result);
  });

app.get("/country/:iso", async (req, res) => {
    let pageSize = parseInt(req.query.pageSize) || 80;
    let page = parseInt(req.query.page) || 1;
    const country = req.params.iso || 'in'

    const result = await fetchNews(`https://newsapi.org/v2/top-headlines?country=${country}&page=${page}&pageSize=${pageSize}&apiKey=${process.env.API_KEY}`);
    res.status(result.status).json(result);
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})