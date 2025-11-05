import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-last-one-week-information',
  templateUrl: './last-one-week-information.component.html',
  styleUrls: ['./last-one-week-information.component.scss'],
})
export class LastOneWeekInformationComponent implements OnInit {
  @Input() message: string = '';
  
  // Parsed data dari message
  expiryType: 'tenancy' | 'permit' | 'unknown' = 'unknown';
  expiryDate: string = '';
  daysRemaining: number = 0;
  formattedDate: string = '';
  urgencyLevel: 'critical' | 'warning' | 'info' = 'warning';

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.parseMessage();
    this.calculateUrgency();
  }

  /**
   * Parse message untuk extract informasi penting
   */
  private parseMessage() {
    // Detect type (Tenancy Agreement atau Work Permit)
    if (this.message.toLowerCase().includes('tenancy agreement')) {
      this.expiryType = 'tenancy';
    } else if (this.message.toLowerCase().includes('work permit')) {
      this.expiryType = 'permit';
    }

    // Extract tanggal dari message
    // Format: "...on 12 November 2025..."
    const dateMatch = this.message.match(/on\s+(\d{1,2}\s+\w+\s+\d{4})/i);
    if (dateMatch) {
      this.expiryDate = dateMatch[1];
      this.formattedDate = this.formatDate(this.expiryDate);
      this.calculateDaysRemaining(this.expiryDate);
    }

    // Extract dari format alternatif: "...by 2025-11-12..."
    const dateMatch2 = this.message.match(/by\s+(\d{4}-\d{2}-\d{2})/i);
    if (dateMatch2 && !this.expiryDate) {
      this.expiryDate = dateMatch2[1];
      this.formattedDate = this.formatDate(this.expiryDate);
      this.calculateDaysRemaining(this.expiryDate);
    }
  }

  /**
   * Format tanggal untuk display
   */
  private formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  }

  /**
   * Hitung berapa hari lagi sampai expiry
   */
  private calculateDaysRemaining(dateStr: string) {
    try {
      const expiryDate = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expiryDate.setHours(0, 0, 0, 0);
      
      const diffTime = expiryDate.getTime() - today.getTime();
      this.daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (e) {
      this.daysRemaining = 0;
    }
  }

  /**
   * Tentukan urgency level berdasarkan days remaining
   */
  private calculateUrgency() {
    if (this.daysRemaining <= 2) {
      this.urgencyLevel = 'critical';
    } else if (this.daysRemaining <= 5) {
      this.urgencyLevel = 'warning';
    } else {
      this.urgencyLevel = 'info';
    }
  }

  /**
   * Get icon berdasarkan expiry type
   */
  getIcon(): string {
    switch (this.expiryType) {
      case 'tenancy':
        return 'home-outline';
      case 'permit':
        return 'card-outline';
      default:
        return 'alert-circle-outline';
    }
  }

  /**
   * Get title berdasarkan expiry type
   */
  getTitle(): string {
    switch (this.expiryType) {
      case 'tenancy':
        return 'Tenancy Agreement Expiring';
      case 'permit':
        return 'Work Permit Expiring';
      default:
        return 'Important Notice';
    }
  }

  /**
   * Get color berdasarkan urgency
   */
  getUrgencyColor(): string {
    switch (this.urgencyLevel) {
      case 'critical':
        return 'danger';
      case 'warning':
        return 'warning';
      default:
        return 'primary';
    }
  }

  /**
   * Get countdown text
   */
  getCountdownText(): string {
    if (this.daysRemaining === 0) {
      return 'Expires Today!';
    } else if (this.daysRemaining === 1) {
      return 'Expires Tomorrow!';
    } else if (this.daysRemaining < 0) {
      return 'Already Expired!';
    } else {
      return `${this.daysRemaining} Days Remaining`;
    }
  }

  /**
   * Close modal
   */
  async dismiss() {
    await this.modalController.dismiss();
  }

  /**
   * Action: Contact primary contact
   */
  async contactPrimaryContact() {
    // Implement logic untuk contact primary contact
    // Bisa redirect ke chat, phone, atau form
    await this.modalController.dismiss({
      action: 'contact'
    });
  }

  /**
   * Action: View details
   */
  async viewDetails() {
    await this.modalController.dismiss({
      action: 'view_details'
    });
  }

  /**
   * Action: Remind me later
   */
  async remindLater() {
    await this.modalController.dismiss({
      action: 'remind_later'
    });
  }
}