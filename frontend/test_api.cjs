const axios = require('axios');
axios.get('http://127.0.0.1:8000/api/v1/skills')
  .then(res => console.log('Type:', typeof res.data, 'IsArray:', Array.isArray(res.data), 'Length:', res.data.length))
  .catch(err => console.error(err.message));
