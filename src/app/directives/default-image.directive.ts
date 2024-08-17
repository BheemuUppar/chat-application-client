import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDefaultImage]'
})
export class DefaultImageDirective {
  @Input() appDefaultImage !: string;
  
  constructor(private el: ElementRef) {
  }
  @HostListener('error') onError() {
    const defaultImage = this.appDefaultImage || '../../assets/images/default-user-profile.png';
    this.el.nativeElement.src = defaultImage;
  }

}


