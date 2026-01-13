const https = require('https');

const city = process.argv[2];

if (!city) {
  console.error('Please provide a city name as an argument.');
  process.exit(1);
}

const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const weatherData = JSON.parse(data);
      if (weatherData.current_condition && weatherData.current_condition[0]) {
        const temp = weatherData.current_condition[0].temp_C;
        const desc = weatherData.current_condition[0].weatherDesc[0].value;
        console.log(`Weather in ${city}: ${temp}°C, ${desc}`);
      } else {
        console.error('Unable to retrieve weather data for the specified city.');
      }
    } catch (err) {
      console.error('Error parsing weather data:', err.message);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching weather data:', err.message);
});