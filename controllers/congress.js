const request = require('request');

const dc = require('./dc');

const CONGRESS_API_URL = `https://congress.api.sunlightfoundation.com/legislators/locate?apikey=${
    process.env.SUNLIGHT_FOUNDATION_KEY}`;

const cachedZipLookups = {};

function getPeople(zip, cb) {
  if (cachedZipLookups[zip]) {
    cb(cachedZipLookups[zip]);
    return;
  }

  const url = `${CONGRESS_API_URL}&zip=${zip}`;
  console.log('Lookup', url);
  request(url, (err, resp, body) => {
    if (err) {
      console.error('Error looking up zip code', zip, err);
      cb([]);
      return;
    }

    const ret = JSON.parse(body).results;
    // add Paul Ryan as a "senator" for DC zips
    if (dc.zipCodes.indexOf(parseInt(zip, 10)) > -1) {
      ret.push(dc.paulRyanObj);
    }
    if (ret.length > 0) {
      cachedZipLookups[zip] = ret;
    }
    cb(ret);
  });
}

module.exports = {
  getPeople,
};
