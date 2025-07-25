import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from, switchMap, mergeMap, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-door-access-main',
  templateUrl: './door-access-main.page.html',
  styleUrls: ['./door-access-main.page.scss'],
})
export class DoorAccessMainPage extends ApiService implements OnInit {

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
  projectId: number = 0;

  constructor(
    private functionMain: FunctionMainService,
    private storage: StorageService,
    private platform: Platform,
    private mainApi: MainApiResidentService,
    http: HttpClient
  ) {super(http)}

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.projectId = estate.project_id;
            this.searchDeviceFromBluetooth();
          }
        })
      }
    })
  }

  ionViewWillLeave() {
    this.stopWatchingLocation();
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
      // console.log('Bluetooth initialized');
    } catch (error) {
      // console.error('Bluetooth initialization error:', error);
    }
  }

  async checkBluetoothState(fromWhere?: string) {
    try {
      // This checks if Bluetooth adapter is enabled
      const bluetoothState = await BleClient.isEnabled();
      if (bluetoothState === true) {
        // console.log('Bluetooth state:', bluetoothState);
        console.log("Bluetooth hidup bang");
        this.searchDeviceFromBluetooth();
        this.isBluetoothEnabled = bluetoothState;
        if (fromWhere === 'search') {
          this.functionMain.presentToast('Your bluetooth is already on, now you can use this features')
        }
      } else {
        // console.log('Bluetooth state:', bluetoothState);
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
      // console.log('Bluetooth state:', this.isBluetoothEnabled);
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
              this.searchDeviceFromBackend(this.projectId);
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
      // console.log('Bluetooth state:', this.isBluetoothEnabled);
      console.log("Bluetooth ga hidup bang idupin dulu");
      await BleClient.requestEnable();
      this.checkBluetoothState('search');
    }
  }

  async searchDeviceFromBackend(projectId: number) {
    this.mainApi.endpointCustomProcess({
      project_id: projectId
    }, '/get/door_access_configuration').subscribe((response: any) => {
      this.devicesFromBackend = [];
      const result = response.result.response_result;
      if (response.result.response_code === 200) {
        this.devicesFromBackend = result;
        if (this.devicesFromScan.length > 0 && this.devicesFromBackend.length > 0) {
          // Memeriksa apakah ada perangkat yang dipindai dengan nama Bluetooth yang sama
          if (this.devicesFromScan.some(d => d.name === result.bluetooth_name)) {
            console.log(this.devicesFromScan.some(d => d.name), result.bluetooth_name);
            
            this.devicesToClick = this.devicesFromBackend.filter((device: any) => {
              const blue_name_from_backend = device.bluetooth_name;
              // Memeriksa apakah ada perangkat yang dipindai dengan nama Bluetooth yang sama
              const blue_name_from_scan = this.devicesFromScan.some(d => d.name === blue_name_from_backend);
              return blue_name_from_scan; // Mengembalikan true jika ada yang cocok
            }).map((device: any) => {
              return {
                id: device.id,
                name: device.name,
                bluetoothName: device.bluetooth_name
              }
            });
            console.log("paling atas", this.devicesFromScan, this.devicesFromBackend, result, this.devicesToClick);
          }
          console.log("tengah ni", this.devicesFromScan, this.devicesFromBackend, result);
        }
        console.log("paling bawah", this.devicesFromScan, this.devicesFromBackend, result);
      }
    });
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
    console.log(device, this.projectId);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    this.http.post(this.baseUrl + '/intercom/get_project_location', {
      project_id: this.projectId, 
      door_access_id: device.id
    }, { headers }).pipe(
      catchError(this.handleError)
    ).subscribe(
      (response: any) => {
      console.log('Response:', response);
      }, (error: any) => {
        console.log('Respponse', error);
      }
    );
    
  }

  private handleError(error: any) {
      console.error('An error occurred:', error);
      
      if (error.error instanceof ErrorEvent) {
        console.error('Client-side error:', error.error.message);
      } else {
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`
        );
      }
  
      return throwError(() => new Error('Something went wrong; please try again later.'));
    }

}
