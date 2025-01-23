import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export default async function getResponseData(
  requestWords,
  page_num,
  additionalParams
) {
  const requestParams = {
    key: '48329924-6906af0078b1de986ec16b549',
    q: requestWords,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 15,
    page: page_num,
  };

  if (Object.keys(additionalParams).length > 0) {
    for (param in additionalParams) {
      requestParams[param] = additionalParams[param];
    }
  }

  const responseData = await axios
    .get('', {
      params: requestParams,
    })
    .then(response => {
      return response.data;
    });

  return responseData;
}
