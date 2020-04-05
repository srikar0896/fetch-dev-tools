import { LitElement, html, css } from 'lit-element';
import { resolveRequest, rejectRequest } from "../requestService";
import { getTemplates, saveAsTemplate } from '../templatesService';
import "./customResponseEditor";
import eventBus from '../eventBus';

class RequestItem extends LitElement {
  constructor(){
    super();
    this.isExpanded = false;
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSaveResponse = this.handleSaveResponse.bind(this);
    this.handleCloseEditor = this.handleCloseEditor.bind(this);
    this.customResponseCode = "";
    this.status_code = "301";
    this.error_message = "not auth!";
    eventBus.register('fdt-save-response', this.handleSaveResponse);
    eventBus.register('fdt-close-editor', this.handleCloseEditor);
  }

  bind(property) {
    return (e) => {
      this[property] = e.target.value
    }
  }
  
  shouldUpdate(x, y){
    console.log(x,y);
    return true;
  }

  static get properties() {
    return {
      request: { attribute: true, reflect: true, type: Object },
      isExpanded: { type: Boolean },
      drawerOpen: {type: Boolean},
      customResponseCode: { type: String, reflect: true },
    }
  }

  handleResolve(){
    resolveRequest({id:this.request.id, status_code: this.status_code, response: this.customResponseCode || "" });
  }

  handleReject(){
    rejectRequest({ id:this.request.id, status_code: this.status_code, error_message: this.error_message });
  }
  
  handleToggle() {
    this.isExpanded = !this.isExpanded;
    const customResponseButton = this.shadowRoot.querySelector('.custom-response-button');
    // customResponseButton.focus();
  }

  toggleDrawer() {
    this.drawerOpen = !this.isDrawerOpen;
  }

  handleSaveResponse(event) {
    if(event.detail.requestId === this.request.id) {
      this.customResponseCode = event.detail.code;
      this.shadowRoot.querySelector('.custom-response-button').focus();
    }
  }

  handleCloseEditor() {
    this.drawerOpen = false;
  }

  render(){
    return html`
    <div class="devtools__request_item__wrapper">
      <div class="devtools__request_item">
        <div class="devtools__request_item__actions_wrapper">
          <button class="devtools__request_item__action resolve" @click="${this.handleResolve}">
            ✓
          </button>
          <button class="devtools__request_item__action reject" @click="${this.handleReject}">
            ×
          </button>
        </div>
        <div class="devtools__request_item__name__wrapper">
          <code class="devtools__request_item__name">${this.request.options.url}</code>
        </div>
        <button class="devtools__request_item__action settings ${this.isExpanded ? "expanded" : ""}" @click="${this.handleToggle}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="24 / arrows / circle-chevron-bottom">
              <path id="icon" fill-rule="evenodd" clip-rule="evenodd" d="M12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM16.7071 10.7071L15.2929 9.29289L12 12.5858L8.70711 9.29289L7.29289 10.7071L12 15.4142L16.7071 10.7071Z" fill="#FE940C"/>
            </g>
          </svg>
        </button>
      </div>
      ${this.drawerOpen ? 
        (
          html`
            <fdt-response-editor requestId=${this.request.id} customResponseCode="${this.customResponseCode}">
            </fdt-response-editor>
          `
        ) : null }
      ${
        this.isExpanded ?
          (
          html`
            <div class="details-wrapper">
              <div class="section">
                <div class="row">
                  <span class="label">
                    Custom Response
                  </span>
                  ${!!this.customResponseCode ? html`<div class="updated-badge">✓</div>` : ''}
                </div>
                <button class="custom-response-button" @click="${this.toggleDrawer}">
                  EDIT
                </button>
              </div>
              <div class="section">
                <span>
                  Status code
                </span>
                <input .value="${this.status_code}" type="text" autofocus size="3" class="devtools-text-input status-code"/>
              </div>
              <div class="section">
                <span>
                  Error message
                </span>
                <textarea .value="${this.error_message}" rows="3" cols="25" class="devtools-text-input"></textarea>
              </div>
            </div>
          `
        ) : null
      }
      </div>
    `;
  }

  static get styles(){
    return css`
      .row {
        display: flex;
      }

      .devtools__request_item {
        display: flex;
        padding: 8px;
        align-items: center;
        background: #1F1b47;
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
        line-height: 10px;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        border: none;
        border: 3px solid transparent;
      }

      .devtools__request_item__action:focus {
        box-shadow: 0 0 0 4px rgba(234,76,137,0.1);
        outline: 3px solid rgba(138, 90, 158, 0.45);
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
        width: auto;
        height: auto;
        font-size: 16px;
        background: transparent;
      }

      .devtools__request_item__action:first-child {
        margin-right: 4px
      }

      .devtools__request_item__name__wrapper {
        flex: 1;
      }

      .devtools__request_item__name{
        /* background: rgba(29, 28, 29, 0.04); */
        background: white;
        color: rgb(224, 30, 90);
        border-radius: 3px;
        padding: 1px 3px 2px 3px;
        border: 1px solid rgba(22, 47, 86, 0.1);
        margin: 0;
      }

      .details-wrapper {
        background: #24365A;
        color: white;
        border-bottom: 1px solid rgba(22, 47, 86, 0.1);
      }

      .custom-response-button {
        color: black;
        background: white;
        height: 24px;
        line-height: 24px;
        border: none;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        height: 32px;
        border-radius: 10px;
        padding: 0 16px;
        font-size: 14px;
        font-weight: normal;
        font-family: inherit;
        border: 3px solid transparent;
        border-radius: 20px;
        padding: 0 11px;
        font-size: 11px;
        height: 28px;
      }

      .custom-response-button:hover {
        background: #f2f2f2;
      }

      .custom-response-button:focus,
      .devtools-text-input:focus {
        border: 3px solid;
        border-color: rgba(138, 90, 158, 0.45);
        box-shadow: 0 0 0 4px rgba(234,76,137,0.1);
        outline: none;
        background: white;
      }

      .section {
        display: flex;
        justify-content: space-between;
        font-family: "Source Code Pro", monospace;
        font-size: 13px;
        padding: 8px;
        align-items: center;
        border-bottom: 1px solid #ffffff42;
      }

      .devtools-text-input {
        border: 1px solid rgba(133, 132, 132, 1);
        border-radius: 2px;
        font-size: 14px;
        line-height: 32px;
        font-family: "Source Code Pro", monospace;
        padding-left: 4px;
        border-radius: 6px;
        outline: none;
        border: none;
        background: #f3f3f4;
        font-weight: 400;
        line-height: 24px;
        box-sizing: border-box;
        border: 3px solid transparent;
      }
      .status-code {
        width: 80px;
        height: 32px;
        border-radius: 6px;
      }
      .updated-badge {
        color: #27AE60;
        margin-left: 6px;
      }

      .expanded {
        transform: rotate(180deg);
        transition: transform .2s ease-in-out;
      }
    `
  }
}

customElements.define('fetch-devtools-requestitem', RequestItem);
