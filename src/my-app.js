import { LitElement, html } from '../node_modules/lit';
import './components/todo-app.js';

export class MyApp extends LitElement {
  render() {
    return html`<main><todo-app></todo-app></main>`;
  }
}

customElements.define('my-app', MyApp);
