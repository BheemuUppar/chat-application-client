import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  formatDate(dateString: any) {
    if (dateString == null) {
      return '';
    }
    const inputDate = new Date(dateString);
    const today = new Date();

    const isSameDay = (date1: any, date2: any) =>
      date1.toDateString() === date2.toDateString();
    const isYesterday = (date: any) => {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      return isSameDay(date, yesterday);
    };
    const isWithinLastWeek = (date: any) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      return date >= oneWeekAgo;
    };
    const isWithinSameYear = (date: any) =>
      date.getFullYear() === today.getFullYear();

    if (isSameDay(inputDate, today)) {
      return inputDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (isYesterday(inputDate)) {
      return 'Yesterday';
    } else if (isWithinLastWeek(inputDate)) {
      return inputDate.toLocaleDateString([], { weekday: 'long' });
    } else if (isWithinSameYear(inputDate)) {
      return inputDate.toLocaleDateString([], {
        day: 'numeric',
        month: 'short',
      });
    } else {
      return inputDate.toLocaleDateString([], {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  }
}
