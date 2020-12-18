const { promisify } = require("util");
require('dotenv').config();

const debug = require('debug')('app');
const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');
const cors = require('cors');

// Create Express server
const host = '0.0.0.0';
const port = 3000;
const app = express();

// CORS is needed if developing locally
app.use(cors({
  origin: 'http://localhost:3001',
  methods: 'GET',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// Create redis client
const redisEndpoint = process.env.NODE_ENV === 'docker' ? 'redis://redis': '';
const redisClient = redis.createClient(redisEndpoint);
const redisGet = promisify(redisClient.get).bind(redisClient);
const redisSetEx = promisify(redisClient.setex).bind(redisClient);

// Global constants
const REDIS_CACHE_TIME = 600; // NOTE: redis counts seconds, NOT milliseconds
const BILL_PAGE_SIZE = 3000;

// Format the URL with the key and given offset
function legAPI(path, offset = '0') {
  return `https://legislation.nysenate.gov/${path}?key=${process.env.OPEN_LEGISLATION_KEY}&offset=${offset}&limit=1000`
}

const requestBillsFromAPI = async(year) => {

    // First request with no offset
  let firstResponse = await fetch(legAPI(`/api/3/bills/${year}`));
    let firstResponseData = await firstResponse.json();

  if (!firstResponseData.success) {
    console.error('Did not successfully retrieve bills from legislation.nysenate.gov');
    return [];
  }

    // Retrieve the remaining pages
  let allBills = firstResponseData.result.items;
    const totalPages = Math.ceil(firstResponseData.total / 1000);
    for (let i = 1; i < totalPages; i++) {
      let offsetStart = (i * 1000) + 1;
      let nextResponse = await fetch(legAPI(`/api/3/bills/${year}`, offsetStart));
      let nextResponseData = await nextResponse.json();
      allBills = allBills.concat(nextResponseData.result.items);
    }
  // Cache the result for REDIS_CACHE_TIME seconds
  await redisSetEx(year, REDIS_CACHE_TIME, JSON.stringify(allBills));
  return allBills;
};

const getBillsWithCache = async(year) => {
  const cachedBills = await redisGet(year);
  if (cachedBills && cachedBills.length > 0) return JSON.parse(cachedBills);

  console.log('resetting cache manually');
  let allBills = await requestBillsFromAPI(year);
  return allBills;
};

// Endpoint to get all the bills in a year
app.get('/api/v1/bills/:year', async (req, res) => {
  let bills = await getBillsWithCache(req.params.year);

  let start = 0;
  if (parseInt(req.query.start)) start = parseInt(req.query.start);

  const slicedBills = bills.slice(start, start + BILL_PAGE_SIZE);

  res.json({
    end: start + BILL_PAGE_SIZE < bills.length ? start + BILL_PAGE_SIZE : 0,
    bills: slicedBills,
  });
});

// Endpoint to get a single bill
app.get('/api/v1/bills/:year/:printNumber', async (req, res) => {
  let apiResponse = await fetch(legAPI(`/api/3/bills/${req.params.year}/${req.params.printNumber}`));
  res.json(await apiResponse.json());
});

const resetCache = async() => {
  console.log('resetting cache automatically');
  const years = [2019]; // Frontend currently only uses this year.
  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    console.log(`fetching bills for year ${year}`);
    try {
      await requestBillsFromAPI(year); // this repopulates the cache
      console.log('successfully reset bills for year ' + year);
    } catch (error) {
      console.error(`Error fetching bills for year ${year}`);
      console.error(error);
    }
  }
  
  // reset cache again in a set amount of time
  setInterval(resetCache, REDIS_CACHE_TIME * 1000);
};

// Listen
app.listen(port, () => {
  console.log(`Example app listening at http://${host}:${port}`);
  resetCache();
});
