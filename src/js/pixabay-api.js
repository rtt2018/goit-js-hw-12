export default function getRequestURL(requestWords) {
  const API_KEY = '48329924-6906af0078b1de986ec16b549';

  const requestImageParam = {
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 15,
  };

  let URL =
    'https://pixabay.com/api/?key=' +
    `${API_KEY}` +
    '&q=' +
    encodeURIComponent(requestWords);

  for (const param in requestImageParam) {
    URL += `&${param}=${requestImageParam[param]}`;
  }

  return URL;
}
