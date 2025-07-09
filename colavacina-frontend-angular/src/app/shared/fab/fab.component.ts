import { Component, Input } from '@angular/core';

export interface FabAction {
  icon: string;
  title: string;
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
  @Input() title: string = 'Menu';
  @Input() action: () => void = () => {};
  @Input() actions: FabAction[] = [];
  isOpen = false;
  flexDirection: string = 'flex-direction-row';

  ngOnInit() {
    this.flexDirection = localStorage.getItem('menu-flex-direction') || 'flex-direction-row';
  }

  onClick() {
    this.action();
  }

  toggleFab() {
    this.isOpen = !this.isOpen;
  }

  triggerAction(action: FabAction) {
    action.callback();
    console.log(action)
    
    if (action.title == 'Rotacionar menu') {
      this.flexDirection = localStorage.getItem('menu-flex-direction') || 'flex-direction-row';
      this.isOpen = false;
    }
  }

}
