import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation, Position, PositionOptions } from '@capacitor/geolocation';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number | null | undefined;
  accuracy: number;
  altitudeAccuracy: number | null | undefined;
  timestamp: number;
  deviceType: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };

  constructor(private platform: Platform) { }

  /**
   * Get the current location using Capacitor Geolocation plugin
   */
  getCurrentLocation(): Observable<LocationData> {
    // Determine which platform we're running on
    const deviceType = this.getDeviceType();
    
    return from(Geolocation.getCurrentPosition(this.options)).pipe(
      map((position: Position) => this.mapToLocationData(position, deviceType)),
      catchError(error => {
        console.error('Error getting location', error);
        return of({
          latitude: 0,
          longitude: 0,
          altitude: null,
          accuracy: 0,
          altitudeAccuracy: null,
          timestamp: Date.now(),
          deviceType: deviceType,
        });
      })
    );
  }

  /**
   * Watch for location updates using Capacitor Geolocation plugin
   */
  watchLocation(): Observable<LocationData> {
    const deviceType = this.getDeviceType();
    
    return new Observable<LocationData>(observer => {
      let watchId: string;
      
      // Start watching position
      Geolocation.watchPosition(this.options, (position, err) => {
        if (err) {
          console.error('Error watching location', err);
          observer.error(err);
          return;
        }
        
        if (position) {
          observer.next(this.mapToLocationData(position, deviceType));
        }
      }).then(id => {
        watchId = id;
      });
      
      // Return teardown logic
      return () => {
        if (watchId) {
          Geolocation.clearWatch({ id: watchId });
        }
      };
    });
  }

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const status = await Geolocation.requestPermissions();
      return status.location === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions', error);
      return false;
    }
  }

  /**
   * Helper method to determine device type
   */
  private getDeviceType(): string {
    if (this.platform.is('android')) {
      return 'android';
    } else if (this.platform.is('ios')) {
      return 'ios';
    } else {
      return 'desktop';
    }
  }

  /**
   * Helper method to map Position to LocationData
   */
  private mapToLocationData(position: Position, deviceType: string): LocationData {
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude !== null ? position.coords.altitude : null,
      accuracy: position.coords.accuracy,
      altitudeAccuracy: position.coords.altitudeAccuracy !== null ? position.coords.altitudeAccuracy : null,
      timestamp: position.timestamp,
      deviceType: deviceType
    };
  }
}