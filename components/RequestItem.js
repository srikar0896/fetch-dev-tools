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
    resolveRequest({id:this.request.id});
  }

  handleReject(){
    rejectRequest({id:this.request.id});
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
    console.log('SAVEING', event.detail.requestId === this.request.id);
    if(event.detail.requestId === this.request.id) {
      this.customResponseCode = event.detail.code;
      console.log("recieved code", event.detail);
    }
  }

  handleCloseEditor() {
    this.drawerOpen = false;
  }

  render(){
    console.log(this.customResponseCode);
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
        <button class="devtools__request_item__action settings" @click="${this.handleToggle}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="24 / arrows / circle-chevron-bottom">
              <path id="icon" fill-rule="evenodd" clip-rule="evenodd" d="M12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM16.7071 10.7071L15.2929 9.29289L12 12.5858L8.70711 9.29289L7.29289 10.7071L12 15.4142L16.7071 10.7071Z" fill="rgba(22, 47, 86, 0.5)"/>
            </g>
          </svg>        
        </button>
      </div>
      ${
        this.isExpanded ?
          this.drawerOpen ? 
          (
            html`
              <fdt-response-editor requestId=${this.request.id} customResponseCode="${this.customResponseCode}">
              </fdt-response-editor>
            `
          ) :
          (
          html`
            <div class="details-wrapper">
              <div class="section">
                <span>
                  Custom Response
                </span>
                ${!!this.customResponseCode && html`..X..`}
                <button class="custom-response-button" @click="${this.toggleDrawer}">
                  Edit
                </button>
              </div>
              <div class="section">
                <span>
                  Status code
                </span>
                <input type="text" autofocus size="3" class="devtools-text-input"/>
              </div>
              <div class="section">
                <span>
                  Error message
                </span>
                <textarea rows="3" cols="25" class="devtools-text-input"></textarea>
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
        width: auto;
        height: auto;
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

      .details-wrapper {
        padding: 8px;
        border-bottom: 1px solid rgba(22, 47, 86, 0.1);
      }

      .section {
        display: flex;
        justify-content: space-between;
        font-family: "Source Code Pro", monospace;
        font-size: 13px;
        padding: 4px;
        align-items: center;
      }

      .devtools-text-input {
        border: 1px solid rgba(133, 132, 132, 1);
        border-radius: 2px;
        font-size: 14px;
        line-height: 14px;
        font-family: "Source Code Pro", monospace;
        padding-left: 4px;
      }
    `
  }
}

customElements.define('fetch-devtools-requestitem', RequestItem);



// {
//   "application_status": "basic_info",
//   "loan_id": 12,
//   "lender_id": 12,
//   "applicant_details": {
//     "id": 1,
//     "first_name": "Ramesh"
//   }
// }