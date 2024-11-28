import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [MatButtonToggleModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  hideSingleSelectionIndicator = signal(true);
  toggleSingleSelectionIndicator() {
    this.hideSingleSelectionIndicator.update(value => !value);
  }
}
