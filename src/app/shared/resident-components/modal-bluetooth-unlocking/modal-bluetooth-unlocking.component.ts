import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { Haptics, NotificationType } from '@capacitor/haptics';

export type UnlockState = 'checking' | 'scanning' | 'connecting' | 'unlocking' | 'success' | 'error';

@Component({
  selector: 'app-modal-bluetooth-unlocking',
  templateUrl: './modal-bluetooth-unlocking.component.html',
  styleUrls: ['./modal-bluetooth-unlocking.component.scss'],
})
export class ModalBluetoothUnlockingComponent implements OnInit, OnDestroy {

  @Input() door: any;
  @Input() token: string = '';
  @Input() closeModalTime: number = 30000;

  // IFS360 Dedicated 128-bit UUIDs (matching Intercom BleDoorAccessManager)
  readonly SERVICE_UUID = '1fa89f00-34b2-4d7a-b9c2-75d82084c7e1';
  readonly CHAR_UNLOCK_UUID = '1fa89f01-34b2-4d7a-b9c2-75d82084c7e1';
  readonly CHAR_STATUS_UUID = '1fa89f02-34b2-4d7a-b9c2-75d82084c7e1';

  // Minimum RSSI to enforce proximity (closer than approx. 3-4 meters)
  readonly MIN_RSSI_THRESHOLD = -85;

  currentState: UnlockState = 'checking';
  statusMessage: string = 'Initializing Bluetooth...';
  errorMessage: string = '';
  detectedRssi: number | null = null;

  private connectedDeviceId: string | null = null;
  private scanTimeoutId: any;
  private autoDismissTimeoutId: any;
  private isScanning: boolean = false;

  constructor(private modalController: ModalController) {}

  async ngOnInit() {
    await this.startBluetoothUnlock();
  }

  async ngOnDestroy() {
    await this.cleanup();
  }

  async startBluetoothUnlock() {
    this.currentState = 'checking';
    this.errorMessage = '';
    this.statusMessage = 'Checking Bluetooth...';

    try {
      await BleClient.initialize();
      const isEnabled = await BleClient.isEnabled();
      if (!isEnabled) {
        try {
          await BleClient.enable();
        } catch (err) {
          this.currentState = 'error';
          this.errorMessage = 'Please enable Bluetooth in your phone settings to unlock this door.';
          return;
        }
      }

      await this.scanForDoor();
    } catch (error: any) {
      console.error('BLE Init error:', error);
      this.currentState = 'error';
      this.errorMessage = error?.message || 'Bluetooth initialization failed. Please check permissions.';
    }
  }

  async scanForDoor() {
    this.currentState = 'scanning';
    this.statusMessage = 'Searching for nearby door terminal...';
    this.isScanning = true;

    // Timeout if door terminal is not found within 10 seconds
    this.scanTimeoutId = setTimeout(async () => {
      if (this.isScanning) {
        await this.stopScan();
        this.currentState = 'error';
        this.errorMessage = 'Door terminal not found nearby. Please ensure you are standing close to the intercom door.';
      }
    }, 10000);

    try {
      const targetSerial = (this.door?.serial_number || '').trim().toLowerCase();

      await BleClient.requestLEScan(
        {
          services: [this.SERVICE_UUID],
        },
        async (result) => {
          console.log('BLE Device found:', result);
          const devName = (result.device.name || '').toLowerCase();
          const devId = result.device.deviceId;
          const rssi = result.rssi ?? -100;

          // Check if device matches target door serial or IFS360 service
          const matchesSerial = targetSerial ? devName.includes(targetSerial) : true;
          const matchesPrefix = devName.startsWith('ifs_');

          if (matchesSerial || matchesPrefix || result.uuids?.includes(this.SERVICE_UUID)) {
            this.detectedRssi = rssi;

            // Proximity check: Must be within acceptable range
            if (rssi < this.MIN_RSSI_THRESHOLD) {
              this.statusMessage = 'Device detected, but signal is too weak. Please step closer to the door...';
              return;
            }

            // Target door found and in range!
            await this.stopScan();
            await this.connectAndUnlock(devId);
          }
        }
      );
    } catch (scanError: any) {
      console.error('Scan error:', scanError);
      await this.stopScan();
      this.currentState = 'error';
      this.errorMessage = 'Failed to scan for Bluetooth doors. Please ensure location/Bluetooth permissions are granted.';
    }
  }

  async connectAndUnlock(deviceId: string) {
    this.currentState = 'connecting';
    this.statusMessage = 'Connecting to door...';
    this.connectedDeviceId = deviceId;

    try {
      await BleClient.connect(deviceId, () => {
        console.log('Disconnected from BLE device:', deviceId);
      });

      this.currentState = 'unlocking';
      this.statusMessage = 'Sending unlock request...';

      // Subscribe to status response notifications from Intercom
      try {
        await BleClient.startNotifications(
          deviceId,
          this.SERVICE_UUID,
          this.CHAR_STATUS_UUID,
          (value) => {
            this.handleUnlockResponse(value);
          }
        );
      } catch (notifErr) {
        console.warn('Could not start notifications, will proceed with write:', notifErr);
      }

      // Encode unlock payload (token + access_type)
      const payload = JSON.stringify({
        token: this.token,
        access_type: 'bluetooth',
        door_id: this.door?.id,
      });

      const encoder = new TextEncoder();
      const dataView = new DataView(encoder.encode(payload).buffer);

      await BleClient.write(deviceId, this.SERVICE_UUID, this.CHAR_UNLOCK_UUID, dataView);
      console.log('Unlock payload written via BLE successfully.');

      // Fallback timer: if notification is not received in 3.5 seconds, check or treat as success
      setTimeout(() => {
        if (this.currentState === 'unlocking') {
          this.onUnlockSuccess('Door Opened');
        }
      }, 3500);

    } catch (connError: any) {
      console.error('BLE connection/write error:', connError);
      this.currentState = 'error';
      this.errorMessage = 'Failed to connect to door terminal. Please try again.';
      await this.cleanupConnection();
    }
  }

  handleUnlockResponse(dataView: DataView) {
    try {
      const decoder = new TextDecoder();
      const raw = decoder.decode(dataView);
      console.log('Received BLE response notification:', raw);

      const json = JSON.parse(raw);
      if (json.status === 200) {
        this.onUnlockSuccess(json.message || 'Door Unlocked Successfully');
      } else {
        this.currentState = 'error';
        this.errorMessage = json.message || 'Access Denied by Intercom';
      }
    } catch (e) {
      console.warn('Could not parse BLE response, assuming success:', e);
      this.onUnlockSuccess('Door Unlocked');
    }
  }

  async onUnlockSuccess(msg: string) {
    this.currentState = 'success';
    this.statusMessage = msg;

    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (ignored) {}

    // Auto-dismiss after 1.8 seconds
    this.autoDismissTimeoutId = setTimeout(async () => {
      await this.cleanup();
      this.modalController.dismiss({ success: true });
    }, 1800);
  }

  async retry() {
    await this.cleanup();
    await this.startBluetoothUnlock();
  }

  async closeModal() {
    await this.cleanup();
    this.modalController.dismiss({ success: false });
  }

  private async stopScan() {
    if (this.isScanning) {
      this.isScanning = false;
      if (this.scanTimeoutId) {
        clearTimeout(this.scanTimeoutId);
      }
      try {
        await BleClient.stopLEScan();
      } catch (ignored) {}
    }
  }

  private async cleanupConnection() {
    if (this.connectedDeviceId) {
      try {
        await BleClient.stopNotifications(this.connectedDeviceId, this.SERVICE_UUID, this.CHAR_STATUS_UUID);
      } catch (ignored) {}
      try {
        await BleClient.disconnect(this.connectedDeviceId);
      } catch (ignored) {}
      this.connectedDeviceId = null;
    }
  }

  private async cleanup() {
    if (this.scanTimeoutId) clearTimeout(this.scanTimeoutId);
    if (this.autoDismissTimeoutId) clearTimeout(this.autoDismissTimeoutId);
    await this.stopScan();
    await this.cleanupConnection();
  }
}
