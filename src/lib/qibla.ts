/**
 * Qibla direction calculator.
 * Returns bearing in degrees from North (clockwise) toward the Kaaba.
 */

const KAABA_LAT =  21.4225;
const KAABA_LNG =  39.8262;

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

/**
 * Returns the Qibla bearing (0–360°) from the user's location.
 */
export function calculateQibla(latitude: number, longitude: number): number {
  const dLng = toRad(KAABA_LNG - longitude);
  const lat1 = toRad(latitude);
  const lat2 = toRad(KAABA_LAT);

  const x = Math.sin(dLng) * Math.cos(lat2);
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const bearing = toDeg(Math.atan2(x, y));
  return (bearing + 360) % 360;
}

/**
 * Returns distance to Kaaba in KM.
 */
export function calculateDistanceToKaaba(latitude: number, longitude: number): number {
  const R = 6371; // Earth's radius in KM
  const dLat = toRad(KAABA_LAT - latitude);
  const dLng = toRad(KAABA_LNG - longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(latitude)) * Math.cos(toRad(KAABA_LAT)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
