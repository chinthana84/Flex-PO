import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
    selector: '[disableAfterClick]'
})

export class DisableButtonAfterClickDirective {
    constructor() { }

    @HostListener('click', ['$event'])
    clickEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.disabled = true;
    }
}
