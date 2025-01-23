import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export default async function getResponseData(requestWords, additionalParams) {
  const requestParams = {
    key: '48329924-6906af0078b1de986ec16b549',
    q: requestWords,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 15,
  };

  if (Object.keys(additionalParams).length > 0) {
    for (let param in additionalParams) {
      requestParams[param] = additionalParams[param];
    }
  }
  console.log('getResponseData  requestParams:', requestParams);

  const responseData = await axios
    .get('', {
      params: requestParams,
    })
    .then(response => {
      return response.data;
    });

  return responseData;
}
