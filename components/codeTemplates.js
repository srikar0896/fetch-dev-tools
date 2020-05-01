import { LitElement, html, css } from 'lit-element';
import { getTemplates, saveAsTemplate } from '../templatesService';
import eventBus from '../eventBus';

document.querySelector('head').insertAdjacentHTML('beforeend', `<link href="https://fonts.googleapis.com/css2?family=Merriweather+Sans&display=swap" rel="stylesheet">`);
class FDTTemplates extends LitElement {
  constructor(){
    super();
    this.refreshTemplates = this.refreshTemplates.bind(this);
    this.templates = getTemplates();
    eventBus.register('fdt-refresh-templates', this.refreshTemplates);
  }
  
  static get properties() {
    return {
      templates: { type: Object },
      requestId: { type: String, attribute: true }
    }
  }

  refreshTemplates() {
    this.templates = getTemplates();
  }

  useTemplate(id) {
    eventBus.fire('fdt-use-template', { templateId: id, requestId: this.requestId })
  }

  render(){

    return html`
      <div class="section">
        <div class="header">
          <h3>Templates</h3>
        </div>
        <div class="templates-container">
          ${this.templates.map(template => html`
            <button class="template-button" role="button" @click="${() => this.useTemplate(template.id)}">
              ${template.name}
            </button>
          `)}
        </div>
        <hr />
      </div>
      
    `;
  }

  static get styles(){
    return css`
      .section {
        padding: 12px 20px;
      }
      .header {
        margin-bottom: 12px;
      }

      h3 {
        font-family: 'Merriweather Sans', sans-serif;
        font-size: 18px;
        color: rgba(22, 47, 86, 0.87);
        padding-bottom: 8px;
        margin: 0;
      }
      .title-border {
        height: 5px;
        width: 45px;
        background: #2CCA74;
        border-radius: 4px;
      }
      .template-button {
        padding: 8px 16px;
        background: rgba(31, 137, 14, 0.1);
        border-radius: 15px;
        color: #1F890E;
        text-align: center;
        letter-spacing: 1px;
        border: none;
        font-size: 12px;
        margin-bottom: 8px;
        margin-right: 12px;
        cursor: pointer;
      }
      .template-button:hover,
      .template-button:focus {
        background: #1f890e36;
        outline: none;
      }
      .templates-container{
        display: block;
      }
      hr {
        border: 1px solid rgba(22, 47, 86, 0.1);
      }
    `
  }
}

customElements.define('fdt-templates', FDTTemplates);