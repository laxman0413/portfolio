import { Component } from '@angular/core';
import { MainComponent } from '../portfolio/main/main/main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
