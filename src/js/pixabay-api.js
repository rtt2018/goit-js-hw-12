import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export default async function getResponseData(
  requestWords,
  additionalParams = {}
) {
  const requestParams = {
    key: '48329924-6906af0078b1de986ec16b549',
    q: requestWords,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    ...additionalParams,
  };

  const responseData = await axios.get('', {
    params: requestParams,
  });
  return responseData;
}
