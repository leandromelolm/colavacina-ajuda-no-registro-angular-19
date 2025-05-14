import { Component, Input } from '@angular/core';

export interface FabAction {
  icon: string;
  callback: () => void;
}

@Component({
  selector: 'app-fab',
  standalone: false,
  templateUrl: './fab.component.html',
  styleUrl: './fab.component.scss'
})
export class FabComponent {

  @Input() icon: string = 'info';
  @Input() action: () => void = () => {};
  @Input() actions: FabAction[] = [];
  isOpen = false;

  onClick() {
    this.action();
  }

  toggleFab() {
    this.isOpen = !this.isOpen;
  }

  triggerAction(action: FabAction) {
    action.callback();
    // this.isOpen = false;
  }

}
