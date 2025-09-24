import { Component, signal } from '@angular/core';
import { Graph } from './features/graph/graph';

@Component({
  selector: 'app-root',
  imports: [Graph],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
}
