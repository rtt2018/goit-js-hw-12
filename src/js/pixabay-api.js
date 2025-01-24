import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export default async function getResponseData(requestWords, additionalParams) {
  // Об'єкт параметрів для axios
  const requestParams = {
    key: '48329924-6906af0078b1de986ec16b549',
    q: requestWords,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  // Динамічно додаю нові параметри, якщо вони були передані у функцію у параметрі additionalParams
  if (Object.keys(additionalParams).length > 0) {
    for (let param in additionalParams) {
      requestParams[param] = additionalParams[param];
    }
  }
  // Роблю запит
  const responseData = await axios
    .get('', {
      params: requestParams,
    })
    .then(response => {
      return response.data; // повертаю тільки дані з реквесту
    });

  return responseData;
}
