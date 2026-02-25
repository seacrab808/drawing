export const WEATHER_OPTIONS = [
  { id: 'sunny', label: '맑음', emoji: '☀️' },
  { id: 'cloudy', label: '흐림', emoji: '☁️' },
  { id: 'rainy', label: '비', emoji: '🌧️' },
  { id: 'snowy', label: '눈', emoji: '❄️' },
  { id: 'windy', label: '바람', emoji: '💨' },
  { id: 'heart', label: '기쁨', emoji: '💖' },
  { id: 'sad', label: '슬픔', emoji: '😢' },
  { id: 'angry', label: '화남', emoji: '😤' },
];

export function getWeatherLabel(id) {
  return WEATHER_OPTIONS.find((w) => w.id === id)?.label || id;
}

export function getWeatherEmoji(id) {
  return WEATHER_OPTIONS.find((w) => w.id === id)?.emoji || '❓';
}
