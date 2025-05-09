import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';

import { GeolocationService, LocationData } from 'src/app/service/geolocation/geolocation.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-door-access-main',
  templateUrl: './door-access-main.page.html',
  styleUrls: ['./door-access-main.page.scss'],
})
export class DoorAccessMainPage implements OnInit {

  locationData: LocationData | null = null;
  isLoading = true;
  error: string | null = null;
  watchSubscription: Subscription | null = null;
  isWatching = false;
  hasPermissions = false;

  devices: BleDevice[] = [];
  isScanning = false;
  isBluetoothEnabled = false;

  constructor(
    private geolocationService: GeolocationService, 
    private functionMain: FunctionMainService,
    private platform: Platform
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // Check permissions when page loads
    this.checkPermissions();
    this.checkBluetoothState();
  }

  ionViewWillLeave() {
    this.stopWatchingLocation();
  }

  async checkPermissions() {
    this.hasPermissions = await this.geolocationService.requestPermissions();
    if (this.hasPermissions) {
      // Optionally get location immediately upon permission approval
      this.startWatchingLocation();
    }
  }

  async startWatchingLocation() {
    if (this.isWatching) {
      return;
    }

    // Check permissions first if not already checked
    if (!this.hasPermissions) {
      this.hasPermissions = await this.geolocationService.requestPermissions();
      if (!this.hasPermissions) {
        this.error = 'Location permission denied';
        this.functionMain.presentToast(this.error, 'danger');
        return;
      }
    }

    this.isWatching = true;
    this.isLoading = true;
    this.error = null;
    
    this.watchSubscription = this.geolocationService.watchLocation().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.locationData = data;
        console.log('location', this.locationData)
        this.functionMain.presentToast('Your location successfully to fetch', 'success');
        this.stopWatchingLocation();
      },
      error: (err) => {
        this.error = 'Failed to watch location: ' + (err.message || 'Unknown error');
        this.functionMain.presentToast(this.error, 'danger');
        this.isLoading = false;
        this.isWatching = false;
        console.error('Watch location error:', err);
      }
    });
  }

  stopWatchingLocation() {
    if (this.watchSubscription) {
      this.watchSubscription.unsubscribe();
      this.watchSubscription = null;
    }
    this.isWatching = false;
    this.error = '';
  }

  async initBluetooth() {
    try {
      await BleClient.initialize();
      console.log('Bluetooth initialized');
    } catch (error) {
      console.error('Bluetooth initialization error:', error);
    }
  }

  async checkBluetoothState(fromWhere?: string) {
    try {
      // This checks if Bluetooth adapter is enabled
      const bluetoothState = await BleClient.isEnabled();
      if (bluetoothState === true) {
        console.log('Bluetooth state:', bluetoothState);
        console.log("Bluetooth hidup bang");
        this.searchDevice();
        this.isBluetoothEnabled = bluetoothState;
        if (fromWhere === 'search') {
          this.functionMain.presentToast('Your bluetooth is already on, now you can use this features')
        }
      } else {
        console.log('Bluetooth state:', bluetoothState);
        console.log("Bluetooth ga hidup bang");
        this.functionMain.presentToast('Please turn on your bluetooth to use this features', 'warning');
        this.isBluetoothEnabled = bluetoothState;
      }
      // this.isBluetoothEnabled = bluetoothState.enabled;
      return this.isBluetoothEnabled;
    } catch (error) {
      console.error('Error checking Bluetooth state:', error);
      this.isBluetoothEnabled = false;
      return false;
    }
  }

  async searchDevice() {
    this.initBluetooth();
    if (this.isBluetoothEnabled === true) {
      console.log('Bluetooth state:', this.isBluetoothEnabled);
      console.log("Bluetooth hidup bang aman itu");
      this.devices = [];
      this.isScanning = true;
      
      try {
        await BleClient.requestLEScan(
          {
            services: [],
            allowDuplicates: false,
          },
          (result) => {
            // Add device if it's not already in the list
            if (!this.devices.some(d => d.deviceId === result.device.deviceId)) {
              this.devices.push(result.device);
              console.log(result);
              
            }
          }
        );
        
        // Stop scan after 5 seconds
        setTimeout(async () => {
          await this.stopScan();
        }, 10000);
      } catch (error) {
        console.error('Scan error:', error);
        this.isScanning = false;
      }
    } else {
      console.log('Bluetooth state:', this.isBluetoothEnabled);
      console.log("Bluetooth ga hidup bang idupin dulu");
      this.functionMain.presentToast('Please turn on your bluetooth to use this features', 'warning');
      await BleClient.requestEnable();
      this.checkBluetoothState('search');
    }
  }

  async stopScan() {
    try {
      await BleClient.stopLEScan();
      this.isScanning = false;
      console.log('Scan complete');
    } catch (error) {
      console.error('Error stopping scan:', error);
      this.isScanning = false;
    }
  }

  async connectToDevice(device: BleDevice) {
    try {
      await BleClient.connect(device.deviceId);
      console.log('Connected to device:', device.name);
      
      // Further connection logic goes here
      
    } catch (error) {
      console.error('Connection error:', error);
    }
  }

}
