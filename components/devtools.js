import { LitElement, html, css } from 'lit-element';
import "./RequestItem";
import fetch from "../fetch";
import requestsService from "../requestService";
import { makeDragable } from "../utils";

class FetchDevTools extends LitElement {
  constructor(){
    super();
    this.requests = [];

    fetch(`get/basic_info`, {
      method: 'GET'
    }).then(console.log);

    fetch(`get/promoter_info`).then(console.log);

    this.subscription = requestsService.subscriber.subscribe(
      debuggingRequests => {
        this.setRequests(debuggingRequests);
      }
    );
  }

  disconnectedCallback(){
    this.subscription.unsubscribe();
  }

  setRequests(requests){
    this.requests = requests;
  }

  static get properties() {
    return {
      requests: { reflect: true, type: Object }
    }
  }

  firstUpdated() {
    const handle = this.shadowRoot.querySelector('.devtools__container__drag_handle');
    makeDragable(handle);
  }

  render(){
    return html`
    <div class="devtools__wrapper">
      <div class="devtools__container__drag_handle">API DEV TOOLS</div>
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

  static get styles(){
    return css`
      .devtools__wrapper {
        border: 1px solid rgba(22, 47, 86, 0.1);
        width: 240px;
        max-width: 300px;
      }
      .devtools__container__drag_handle {
        font-family: "Source Code Pro", monospace;
        font-size: 14px;
        display: flex;
        justify-content: center;
        padding: 3px 0;
        cursor: grab;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2r9//38gYGAEESAAEGAAasgJOgzOKCoAAAAASUVORK5CYII=);
      }
      .devtools-text-input {
        border: 1px solid #f2f2f2;
        border-radius: 3px;
      }
    `
  }
}

customElements.define('fetch-devtools', FetchDevTools);