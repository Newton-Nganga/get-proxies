const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');

async function scrapeProxies() {
  const proxySources = [
    "https://www.proxy-list.download/HTTP",
    "https://www.sslproxies.org/",
    "https://free-proxy-list.net/"
    // Add more sources here as needed
  ];

  const proxies = [];

  for (const source of proxySources) {
    const response = await axios.get(source);
    const $ = cheerio.load(response.data);

    if (source === "https://www.proxy-list.download/HTTP") {
    console.log("fetching proxies from https://www.proxy-list.download/HTTP")
      $('tbody > tr').each((index, element) => {
        const cells = $(element).find('td');
        const ip = cells.eq(0).text();
        const port = cells.eq(1).text();
        const connectionType = cells.eq(4).text();
        const country = cells.eq(2).text();
        const anonymity = cells.eq(3).text();
        proxies.push({ ip, port, connectionType, country, anonymity });
      });
    } else if (source === "https://www.sslproxies.org/") {
    console.log("fetching proxies from https://www.sslproxies.org/")
      $('tbody > tr').each((index, element) => {
        const cells = $(element).find('td');
        const ip = cells.eq(0).text();
        const port = cells.eq(1).text();
        const connectionType = cells.eq(6).text();
        const country = cells.eq(3).text();
        const anonymity = cells.eq(4).text();
        proxies.push({ ip, port, connectionType, country, anonymity });
      });
    } else if (source === "https://free-proxy-list.net/") {
    console.log("Fetching proxies from https://free-proxy-list.net/")
      $('tbody > tr').each((index, element) => {
        const cells = $(element).find('td');
        const ip = cells.eq(0).text();
        const port = cells.eq(1).text();
        const connectionType = cells.eq(6).text();
        const country = cells.eq(2).text();
        const anonymity = cells.eq(4).text();
        proxies.push({ ip, port, connectionType, country, anonymity });
      });
    }
  }
 console.log("...almost there!")
  return proxies;
}

async function writeProxiesToCsv(proxies) {
  const csv = new ObjectsToCsv(proxies);
  await csv.toDisk('proxies.csv');
}

// Scrape proxies
scrapeProxies()
  .then((proxies) => {
    // Write proxies to CSV file
    console.log("Writing the proxies in the csv file")
    writeProxiesToCsv(proxies)
    
      .then(() => {
        console.log('Proxies have been written to proxies.csv successfully.');
      })
      .catch((error) => {
        console.error('Error writing proxies to CSV:', error);
      });
  })
  .catch((error) => {
    console.error('Error scraping proxies:', error);
  });

