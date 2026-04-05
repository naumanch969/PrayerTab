/**
 * Geolocation service with multiple fallback strategies.
 * Attempts: Browser Geolocation API → IP-based detection → Default fallback
 */

import type { Location } from '../types';

interface IpGeolocationResponse {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

/**
 * Get user's location using browser Geolocation API
 */
async function getDeviceLocation(): Promise<Location | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      console.error('❌ Geolocation API not available in navigator');
      resolve(null);
      return;
    }

    console.log('📡 Requesting browser geolocation...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        console.log('✅ Browser geolocation success:', location);
        resolve(location);
      },
      (err) => {
        console.error('❌ Browser geolocation failed:', err.code, err.message);
        resolve(null);
      },
      { 
        timeout: 8000,
        enableHighAccuracy: false,
      }
    );
  });
}

/**
 * Get location using IP-based geolocation (fallback)
 * Uses ipapi.co for IP-based location detection
 */
async function getIpLocation(): Promise<Location | null> {
  try {
    console.log('🌐 Trying IP-based geolocation (ipapi.co)...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const ipResponse = await fetch('https://ipapi.co/json/', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!ipResponse.ok) throw new Error('IP geolocation failed');
      
      const data = await ipResponse.json() as IpGeolocationResponse;
      
      if (!data.latitude || !data.longitude) {
        throw new Error('Invalid IP geolocation data');
      }

      const location = {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
      };
      console.log('✅ IP geolocation success (ipapi.co):', location);
      return location;
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  } catch (err) {
    console.error('❌ ipapi.co failed:', err);
    return null;
  }
}

/**
 * Alternative IP geolocation using IP-API
 */
async function getIpLocationAlternative(): Promise<Location | null> {
  try {
    console.log('🌐 Trying IP-based geolocation (ip-api.com)...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch('http://ip-api.com/json/', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('IP-API failed');
      
      const data = await response.json() as any;
      
      if (!data.lat || !data.lon) {
        throw new Error('Invalid IP-API data');
      }

      const location = {
        latitude: data.lat,
        longitude: data.lon,
        city: data.city,
      };
      console.log('✅ IP geolocation success (ip-api.com):', location);
      return location;
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  } catch (err) {
    console.error('❌ ip-api.com failed:', err);
    return null;
  }
}

/**
 * Get user location with intelligent fallbacks
 * 1. Try browser geolocation (most accurate)
 * 2. Try ipapi.co (IP-based)
 * 3. Try ip-api.com (alternative IP-based)
 * 4. Default to a reasonable fallback (Mecca if all else fails)
 */
export async function getUserLocation(): Promise<Location> {
  // Try device geolocation first
  const deviceLoc = await getDeviceLocation();
  if (deviceLoc) {
    console.log('✅ Using device geolocation:', deviceLoc);
    return deviceLoc;
  }

  // Try IP-based fallback
  const ipLoc = await getIpLocation();
  if (ipLoc) {
    console.log('✅ Using IP-based geolocation:', ipLoc);
    return ipLoc;
  }

  // Try alternative IP service
  const altLoc = await getIpLocationAlternative();
  if (altLoc) {
    console.log('✅ Using alternative IP geolocation:', altLoc);
    return altLoc;
  }

  // Final fallback: Default to Mecca (center of Muslim world)
  // This ensures prayer times are at least plausible
  console.warn('⚠️ All geolocation methods failed. Using fallback: Mecca');
  return {
    latitude: 21.4225,
    longitude: 39.8264,
    city: 'Mecca',
  };
}
