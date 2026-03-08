import { Component } from '@angular/core';
import { EditorComponent } from './editor/editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EditorComponent],
  template: `
    <header class="app-header">
      <div class="app-header-inner">
        <h1 class="app-title">Recipe Editor</h1>
        <a href="https://recipes.yehudardevelopment.com/" class="site-link">View Recipe Site</a>
      </div>
    </header>
    <main class="app-main">
      <app-editor />
    </main>
  `,
})
export class AppComponent {}
