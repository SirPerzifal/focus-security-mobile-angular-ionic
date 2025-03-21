import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  // you can override any of the methods defined in the parent class

  override monthTooltip(event: CalendarEvent): string {
    return '';
  }

  override weekTooltip(event: CalendarEvent): string {
    return '';
  }

  override dayTooltip(event: CalendarEvent): string {
    return '';
  }
}
