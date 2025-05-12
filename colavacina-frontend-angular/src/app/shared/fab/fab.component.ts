import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fab',
  standalone: false,
  templateUrl: './fab.component.html',
  styleUrl: './fab.component.scss'
})
export class FabComponent {

  @Input() icon: string = 'add';
  @Input() action: () => void = () => {};

  onClick() {
    this.action();
  }

}
