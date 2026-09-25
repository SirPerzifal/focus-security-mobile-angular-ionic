import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { BleClient, ScanMode } from '@capacitor-community/bluetooth-le';
import { Haptics, NotificationType } from '@capacitor/haptics';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { ModalShowQRAccessDoorComponent } from 'src/app/shared/resident-components/modal-show-qr-access-door/modal-show-qr-access-door.component';
import { ModalBluetoothUnlockingComponent } from 'src/app/shared/resident-components/modal-bluetooth-unlocking/modal-bluetooth-unlocking.component';

@Component({
  selector: 'app-door-access-main',
  templateUrl: './door-access-main.page.html',
  styleUrls: ['./door-access-main.page.scss'],
})
export class DoorAccessMainPage implements OnInit {

  readonly SERVICE_UUID = '1fa89f00-34b2-4d7a-b9c2-75d82084c7e1';
  readonly CHAR_UNLOCK_UUID = '1fa89f01-34b2-4d7a-b9c2-75d82084c7e1';

  isLoading = true;
  userRole: string = '';
  intercomDoorAccessList: any[] = [];
  isBackgroundScanning: boolean = false;

  constructor(
    private functionMain: FunctionMainService,
    private platform: Platform,
    private mainApi: MainApiResidentService,
    private webRtcService: WebRtcService,
    private router: Router,
    private modalController: ModalController
  ) {}

  handleRefresh(event: any) {
    setTimeout(() => {
      this.isLoading = true;
      this.loadIntercomDoorAccess();
      event.target.complete();
    }, 1000);
  }

  onClickNav(event: any) {
    if (event[1] === 'home-page') {
      this.router.navigate(['resident-home-page']);
    }
  }

  ngOnInit() {
    this.webRtcService.initializeSocket();
  }

  ionViewWillEnter() {
    this.loadIntercomDoorAccess();
    this.startBackgroundProximityScan();
  }

  ionViewWillLeave() {
    this.stopBackgroundProximityScan();
  }

  onChangeTypeOfUser(event: any) {
    this.userRole = event;
  }

  loadIntercomDoorAccess() {
    this.isLoading = true;
    this.mainApi.endpointMainProcess({}, 'get/list_of_the_intercom_door').subscribe((response: any) => {
      if (response.result && response.result.response_code === 200) {
        this.isLoading = false;
        this.intercomDoorAccessList = (response.result.data || []).map((door: any) => ({
          ...door,
          isInRange: false,
          isOpening: false,
          bleDeviceId: null,
          rssi: null
        }));
      } else {
        this.isLoading = false;
        this.functionMain.presentToast('Failed to load data', 'danger');
      }
    });
  }

  /**
   * Background proximity scan: checks if any door terminal is physically near the user.
   * If detected, lights up the door card as "Nearby" without blocking the user.
   */
  async startBackgroundProximityScan() {
    try {
      await BleClient.initialize({ androidNeverForLocation: true });
      const isEnabled = await BleClient.isEnabled();
      if (!isEnabled) return;

      this.isBackgroundScanning = true;
      await BleClient.requestLEScan(
        {
          allowDuplicates: false,
          scanMode: ScanMode.SCAN_MODE_LOW_LATENCY
        },
        (result) => {
          try {
            if (!result || !result.device) return;

            const devName = (result.device.name || result.localName || '').toLowerCase();
            const devId = result.device.deviceId || '';
            const rssi = result.rssi ?? -100;
            const cleanServiceUuid = this.SERVICE_UUID.replace(/-/g, '').toLowerCase();
            const rawUuids = (result.uuids || []).map((u: string) => u.replace(/-/g, '').toLowerCase());

            const matchesUuid = rawUuids.includes(cleanServiceUuid);
            const matchesPrefix = devName.startsWith('ifs') || devName.includes('intercom');

            for (const d of this.intercomDoorAccessList) {
              const serial = (d.serial_number || '').trim().toLowerCase();
              const matchesSerial = serial ? (devName.includes(serial) || (serial.length > 8 && devName.includes(serial.slice(-8)))) : false;
              const singleDoorMatch = this.intercomDoorAccessList.length === 1 && (matchesUuid || matchesPrefix);

              if (matchesSerial || singleDoorMatch) {
                d.isInRange = true;
                d.rssi = rssi;
                d.bleDeviceId = devId;
              } else if ((matchesUuid || matchesPrefix) && !d.serial_number && this.intercomDoorAccessList.every((x: any) => !x.isInRange)) {
                d.isInRange = true;
                d.rssi = rssi;
                d.bleDeviceId = devId;
              }
            }
          } catch (callbackErr) {
            console.error('Error in background BLE scan:', callbackErr);
          }
        }
      );
    } catch (scanErr) {
      console.warn('Background BLE proximity scan could not start:', scanErr);
    }
  }

  async stopBackgroundProximityScan() {
    if (this.isBackgroundScanning) {
      this.isBackgroundScanning = false;
      try {
        await BleClient.stopLEScan();
      } catch (ignored) {}
    }
  }

  /**
   * When user clicks a door:
   * - If 'qr': opens QR Code modal as usual.
   * - If 'bluetooth': directly executes the open function immediately (instant auto-open).
   */
  async onClickDoor(door: any) {
    if (door.isOpening) return;

    // Mode 1: QR Code
    if (door.door_access_mode === 'qr') {
      this.openQrModal(door);
      return;
    }

    // Mode 2: Bluetooth / Auto-Open -> Instant Direct Open!
    door.isOpening = true;

    try {
      // 1. Stop background BLE scan to free Bluetooth radio hardware and avoid native crashes
      await this.stopBackgroundProximityScan();

      // 2. Direct Open Signal to Intercom via WebSocket (opens gate relay in < 1s!)
      this.webRtcService.openGate(door.id);
      this.webRtcService.openGate(`Intercom-${door.id}`);

      // 3. Log access record into Odoo backend
      this.mainApi.endpointMainProcess(
        { intercom_door_id: door.id, access_type: 'bluetooth' },
        'get/barcode_access_intercom_door'
      ).subscribe({
        next: (response: any) => {
          console.log('Door access logged to backend:', response);
        },
        error: (err: any) => {
          console.warn('Could not log access record:', err);
        }
      });

      // 4. Instant Haptic Buzz & Visual Success Feedback
      try {
        await Haptics.notification({ type: NotificationType.Success });
      } catch (ignored) {}

      this.functionMain.presentToast(`Opening ${door.name}...`, 'success');

      setTimeout(() => {
        door.isOpening = false;
        // Safely restart proximity scan if user is still on this screen
        this.startBackgroundProximityScan();
      }, 2000);

    } catch (err: any) {
      console.error('Direct open error:', err);
      door.isOpening = false;
      this.functionMain.presentToast('Failed to open door: ' + (err?.message || 'Error'), 'danger');
    }
  }

  private openQrModal(door: any) {
    this.isLoading = true;
    this.mainApi.endpointMainProcess({
      intercom_door_id: door.id
    }, 'get/barcode_access_intercom_door').subscribe(async (response: any) => {
      this.isLoading = false;
      if (response.result && response.result.response_code === 200) {
        const token = response.result.barcode;
        const expiryMs = (response.result.expiry_time_barcode || 30) * 1000;
        const modal = await this.modalController.create({
          component: ModalShowQRAccessDoorComponent,
          backdropDismiss: false,
          cssClass: 'show-qr-access-door-modal',
          componentProps: {
            QRResult: token,
            closeModalTime: expiryMs
          }
        });
        return await modal.present();
      } else {
        this.functionMain.presentToast('Failed to load intercom door', 'danger');
      }
    });
  }

}
