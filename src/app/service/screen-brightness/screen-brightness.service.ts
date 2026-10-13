import { Injectable } from '@angular/core';
import { Capacitor, PluginListenerHandle } from '@capacitor/core';
import { ScreenBrightness } from '@capawesome/capacitor-screen-brightness';
import { App } from '@capacitor/app';

@Injectable({
  providedIn: 'root',
})
export class ScreenBrightnessService {
  private originalBrightness: number | null = null;
  private isMaxBrightnessActive = false;
  private appStateListener: PluginListenerHandle | null = null;

  /**
   * Automatically boosts screen brightness to 100% (1.0) while saving
   * the user's initial brightness setting so it can be restored later.
   * Also listens to app background/resume events so device brightness returns
   * to normal if the user switches apps or minimizes the app.
   */
  async setMaxBrightness(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      if (!this.isMaxBrightnessActive) {
        // Save current user brightness before modifying
        const result = await ScreenBrightness.getBrightness();
        this.originalBrightness = typeof result?.brightness === 'number' ? result.brightness : null;
      }

      // Maximize brightness to 100% for rapid optical scanner reading
      await ScreenBrightness.setBrightness({ brightness: 1.0 });
      this.isMaxBrightnessActive = true;

      // Handle app pause / resume (prevent brightness from remaining stuck outside the app)
      if (!this.appStateListener) {
        this.appStateListener = await App.addListener('appStateChange', async (state) => {
          if (!state.isActive) {
            await this.applyOriginalBrightness();
          } else if (this.isMaxBrightnessActive) {
            await ScreenBrightness.setBrightness({ brightness: 1.0 });
          }
        });
      }
    } catch (err) {
      console.warn('ScreenBrightnessService: unable to set max brightness', err);
    }
  }

  /**
   * Restores screen brightness back to the user's original setting
   * or relinquishes control back to the operating system auto-brightness.
   */
  async restoreBrightness(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    this.isMaxBrightnessActive = false;

    if (this.appStateListener) {
      await this.appStateListener.remove();
      this.appStateListener = null;
    }

    await this.applyOriginalBrightness();
    this.originalBrightness = null;
  }

  private async applyOriginalBrightness(): Promise<void> {
    try {
      if (this.originalBrightness !== null) {
        await ScreenBrightness.setBrightness({ brightness: this.originalBrightness });
      } else {
        await ScreenBrightness.resetBrightness();
      }
    } catch (err) {
      console.warn('ScreenBrightnessService: unable to restore brightness', err);
    }
  }
}
