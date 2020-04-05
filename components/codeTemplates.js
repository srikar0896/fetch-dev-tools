import { LitElement, html, css } from 'lit-element';
import { getTemplates, saveAsTemplate } from '../templatesService';
import eventBus from '../eventBus';

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

  useTemplate(templateId) {
    eventBus.fire('fdt-use-template', { templateId, requestId: this.requestId })
  }

  render(){

    return html`
      <div>
        <h4>Templates</h4>
        <div class="templates-container">
          ${this.templates.map(template => html`
            <button role="button" @click="${() => this.useTemplate(template.id)}">
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
      .templates-container{
        display: flex;
        padding: 4px;
      }
    `
  }
}

customElements.define('fdt-templates', FDTTemplates);