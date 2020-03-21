import { LitElement, html, css } from 'lit-element';


class RequestItem extends LitElement {
  constructor(){
    super();
    console.log(this.request);
  }

  static get properties() {
    return {
      request: { attribute: true, reflect: true, type: Object }
    }
  }

  static get styles(){
    return css`
      .devtools__request_item {
        display: flex;
        padding: 8px;
        align-items: center;
        background: white;
        border-bottom: 1px solid rgba(22, 47, 86, 0.1);
      }
      .devtools__request_item__actions_wrapper {
        display: flex;
        margin-right: 12px;
      }
      .devtools__request_item__action {
        padding: 0;
        width: 16px;
        height: 16px;
        border: 1px solid;
        line-height: 14px;
        border-radius: 50%;
        color: white;
        cursor: pointer;
      }

      .resolve {
        font-size: 11px;
        background: #24A832;
      }
      
      .reject {
        font-size: 12px;
        background: #EE6619;
      }

      .settings {
        font-size: 16px;
      }

      .devtools__request_item__action:first-child {
        margin-right: 4px
      }

      .devtools__request_item__name__wrapper {
        flex: 1;
      }

      .devtools__request_item__name{
        background: rgba(29, 28, 29, 0.04);
        color: rgb(224, 30, 90);
        border-radius: 3px;
        padding: 1px 3px 2px 3px;
        border: 1px solid rgba(22, 47, 86, 0.1);
        margin: 0;
      }
    `
  }

  handleResolve(e){
    let myEvent = new CustomEvent('request-resolve', {
      detail: {
        request_id: this.request.id,
      },
      bubbles: true, 
      composed: true });
    this.dispatchEvent(myEvent);
  }

  render(){
    return html`
      <div class="devtools__request_item">
        <div class="devtools__request_item__actions_wrapper">
          <button class="devtools__request_item__action resolve" @click="${this.handleResolve}">
            ✓
          </button>
          <button class="devtools__request_item__action reject" @click="${this.handleResolve}">
            ×
          </button>
        </div>
        <div class="devtools__request_item__name__wrapper">
          <code class="devtools__request_item__name">${this.request.name}</code>
        </div>
        <button class="devtools__request_item__action settings" @click="${this.handleResolve}">
          ⚙
        </button>
      </div>
    `;
  }
}

customElements.define('fetch-devtools-requestitem', RequestItem);