import { Component, EventEmitter, NgZone, Output } from '@angular/core';

@Component({
  selector: 'app-refresher-page',
  templateUrl: './refresher-page.component.html',
  styleUrls: ['./refresher-page.component.scss'],
})
export class RefresherPageComponent {
  @Output() eventEmitter = new EventEmitter<any>();

  /** 0..1+ pull progress from ion-refresher */
  pullProgress = 0;
  isPulling = false;
  isReady = false;
  isRefreshing = false;

  private completeFallbackTimer: ReturnType<typeof setTimeout> | null = null;
  private finished = false;
  /** Bumps to ignore stale async getProgress() after cancel/complete */
  private pullSession = 0;

  constructor(private ngZone: NgZone) {}

  onStart() {
    this.clearCompleteFallback();
    this.pullSession++;
    this.finished = false;
    this.isPulling = true;
    this.isRefreshing = false;
    this.isReady = false;
    this.pullProgress = 0;
  }

  async onPull(event: any) {
    if (this.isRefreshing || this.finished) {
      return;
    }

    const session = this.pullSession;
    this.isPulling = true;

    try {
      const progress = await event.target.getProgress();
      if (session !== this.pullSession || this.isRefreshing || this.finished) {
        return;
      }

      this.ngZone.run(() => {
        this.pullProgress = Number(progress) || 0;
        this.isReady = this.pullProgress >= 1;

        if (this.pullProgress < 0.05) {
          this.isPulling = false;
          this.isReady = false;
          this.pullProgress = 0;
        }
      });
    } catch {
      // ignore
    }
  }

  handleRefresh(event: any) {
    this.finished = false;
    this.isRefreshing = true;
    this.isReady = false;
    this.isPulling = true;

    const refresherEl = event?.target;
    const sessionAtRefresh = this.pullSession;

    const finish = () => {
      if (this.finished) {
        return;
      }
      this.finished = true;
      this.clearCompleteFallback();
      this.pullSession = sessionAtRefresh + 1;

      this.ngZone.run(() => {
        this.isRefreshing = false;
        this.isPulling = false;
        this.isReady = false;
        this.pullProgress = 0;
      });

      try {
        refresherEl?.complete?.();
      } catch {
        // ignore
      }
    };

    this.eventEmitter.emit({
      target: { complete: finish },
      detail: { complete: finish },
    });

    this.clearCompleteFallback();
    this.completeFallbackTimer = setTimeout(() => {
      if (this.isRefreshing) {
        finish();
      }
    }, 8000);
  }

  private clearCompleteFallback() {
    if (this.completeFallbackTimer) {
      clearTimeout(this.completeFallbackTimer);
      this.completeFallbackTimer = null;
    }
  }
}
