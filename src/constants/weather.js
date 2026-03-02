/** 마음의 날씨 (작성 페이지 2x3 그리드 - 날씨 관련) */
export const MOOD_OPTIONS = [
  { id: 'sunny', label: '해쨍쨍', emoji: '☀️' },
  { id: 'cloudy', label: '흐림', emoji: '☁️' },
  { id: 'lightning', label: '번개', emoji: '⛈️' },
  { id: 'rainy', label: '비', emoji: '🌧️' },
  { id: 'snowy', label: '눈', emoji: '❄️' },
  { id: 'windy', label: '바람', emoji: '💨' },
];

export const WEATHER_OPTIONS = [...MOOD_OPTIONS];

export function getWeatherLabel(id) {
  return WEATHER_OPTIONS.find((w) => w.id === id)?.label || id;
}

export function getWeatherEmoji(id) {
  return WEATHER_OPTIONS.find((w) => w.id === id)?.emoji || '❓';
}
