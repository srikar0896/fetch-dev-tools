import { LitElement, html, css } from 'lit-element';
import "./RequestItem";

class FetchDevTools extends LitElement {
  constructor(){
    super();
    this.requests = [
      {id: 1, name: '/get/basic_info'},
      {id: 2, name: '/get/promoter_info'}
    ];
  }

  static get properties() {
    return {
      requests: { reflect: true, type: Object }
    }
  }

  firstUpdated(changedProperties) {
    this.addEventListener('request-resolve', (e) => {
      this.requests = this.requests.filter(request => request.id != e.detail.request_id);
    });
  }

  static get styles(){
    return css`
      .devtools__wrapper {
        border: 1px solid rgba(22, 47, 86, 0.1);
        width: 240px;
        max-width: 300px;
      }
    `
  }

  render(){
    return html`
    <div class="devtools__wrapper">
      ${
        this.requests.length === 0
          ? html`<center><code>No Requests</code></center>`
          : html`
          ${this.requests.map(request => html`<fetch-devtools-requestitem request=${JSON.stringify(request)}></fetch-devtools-requestitem>`)}
        `
      }
      </div>
    `;
  }
}

customElements.define('fetch-devtools', FetchDevTools);