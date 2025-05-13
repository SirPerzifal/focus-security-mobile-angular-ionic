import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';

import { GeolocationService, LocationData } from 'src/app/service/geolocation/geolocation.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';

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

  devicesFromScan: BleDevice[] = [];
  devicesFromBackend: any[] = [];
  devicesToClick: any[] = [];
  isScanning = false;
  isBluetoothEnabled = false;

  constructor(
    private geolocationService: GeolocationService, 
    private functionMain: FunctionMainService,
    private storage: StorageService,
    private platform: Platform,
    private mainApi: MainApiResidentService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // Check permissions when page loads
    this.checkPermissions();
    this.searchDeviceFromBluetooth();
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.searchDeviceFromBackend(estate.project_id);
          }
        })
      }
    })
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
        this.searchDeviceFromBluetooth();
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

  async searchDeviceFromBluetooth() {
    this.initBluetooth();
    if (this.isBluetoothEnabled === true) {
      console.log('Bluetooth state:', this.isBluetoothEnabled);
      console.log("Bluetooth hidup bang aman itu");
      this.devicesFromScan = [];
      this.isScanning = true;
      
      try {
        await BleClient.requestLEScan(
          {
            services: [],
            allowDuplicates: false,
          },
          (result) => {
            // Add device if it's not already in the list
            if (!this.devicesFromScan.some(d => d.deviceId === result.device.deviceId)) {
              this.devicesFromScan.push(result.device);
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
      await BleClient.requestEnable();
      this.checkBluetoothState('search');
    }
  }

  async searchDeviceFromBackend(projectId: number) {
    this.mainApi.endpointCustomProcess({
      project_id: projectId
    }, '/get/door_access_configuration').subscribe((response: any) => {
      const result = response.result.response_result;
      if (response.result.response_code === 200) {
        this.devicesFromBackend = result;
        if (this.devicesFromScan.length > 0 && this.devicesFromBackend.length > 0) {
          if (this.devicesFromScan.some(d => d.name === result.bluetooth_name)) {
            this.devicesToClick === this.devicesFromBackend.filter((device: any) => {
              const blue_name_from_backend = device.bluetooth_name;
              const blue_name_from_scan = device.name;
              return blue_name_from_backend === blue_name_from_scan;
            }).map((device: any) => {
              return {
                id: device.id,
                name: device.name,
                bluetoothName: device.bluetooth_name
              }
            })
            console.log(this.devicesFromScan, this.devicesFromBackend, result);
          }
          console.log(this.devicesFromScan, this.devicesFromBackend, result);
        }
        console.log(this.devicesFromScan, this.devicesFromBackend, result);
      }
    })
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

  async deviceClick(device: any) {
    console.log(device);
    
  }

}
