import { LitElement, html, css } from 'lit-element';
import eventBus from '../eventBus';
import "../WCCodeMirror";
import "./codeTemplates";
import { getTemplate, saveAsTemplate } from '../templatesService';

class OneDialog extends HTMLElement {
  static get observedAttributes() {
    return ['open', 'isSaveFormOpen'];
  }
  
  constructor() {
    super();
    this.handleTemplateChange = this.handleTemplateChange.bind(this);
    this.saveResponse = this.saveResponse.bind(this);
    this.toggleSaveTemplateForm = this.toggleSaveTemplateForm.bind(this);
    this.saveTemplate = this.saveTemplate.bind(this);
    this.setCode = this.setCode.bind(this);
    this.attachShadow({ mode: 'open' });
    this.close = this.close.bind(this);
    eventBus.register('fdt-use-template', this.handleTemplateChange);
    this.isSaveFormOpen = false;
  }
  
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[attrName] = this.hasAttribute(attrName);
    }
  }

  getContent() {
    return `
    <div class="wrapper">
      <div class="overlay"></div>
      <div class="dialog" role="dialog" aria-labelledby="title" aria-describedby="content">
        <div class="section">
          <button tabindex="0" class="close action-button round danger close" aria-label="Close">✖️</button>
        </div>
        <fdt-templates requestId="${this.getAttribute('requestId')}"></fdt-templates>
        <div class="section">
          <div class="header">
          <h3>Response Editor</h3>
        </div>
          <div id="content" class="content">
            <div class="code-actions">
              <button class="fdt-save-response-btn action-button">save response</button>
              <button class="fdt-save-as-template-btn action-button">save as template</button>
            </div>
              <div class="save-template-form hidden">
                <input placeholder="save as" type="text" autofocus size="3" class="devtools-text-input template-name-input"/>
                <button tabindex="0" class="template-button save-template-button" aria-label="Close">✓</button>
              </div>
            <wc-codemirror mode="javascript" theme="monokai" value="function(){console.log("Hello")}"></wc-codemirror>
            <div class="fdt-editor-container" style="height:100%">
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  getStyles() {
    return `
    .hidden {
      display: none !important;
    }
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
    .code-actions {
      margin-bottom: 12px;
    }

    .wrapper {
      opacity: 0;
      transition: visibility 0s, opacity 0.25s ease-in;
    }
    .wrapper:not(.open) {
      visibility: hidden;
    }
    .wrapper.open {
      align-items: center;
      display: flex;
      justify-content: center;
      height: 100vh;
      position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      opacity: 1;
      visibility: visible;
    }
    .overlay {
      background: rgba(0, 0, 0, 0.8);
      height: 100%;
      position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      width: 100%;
    }
    .dialog {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 400px;
      background: #ffffff;
      max-width: 600px;
      overflow: auto;
    }
    .action-button {
      padding: 8px 16px;
      background: rgba(11, 112, 231, 0.15);
      color: #0B70E7;
      text-align: center;
      letter-spacing: 1px;
      border: none;
      font-size: 12px;
      margin-bottom: 8px;
      margin-right: 12px;
      cursor: pointer;
      border-radius: 3px;
    }
    .action-button:hover,
    .action-button:focus {
      background: rgba(11, 112, 231, 0.35);
      outline: none;
    }
    .round {
      border-radius: 50% !important;
    }
    .danger {
      background: #eb57578f !important;
    }
    .close{
      padding-left: 7px;
      padding-right: 3px;
      padding-top: 4px;
      padding-bottom: 4px;
      float: right;
    }
    .close:hover,
    .close:focus {
      background: orange;
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
      flex: 1;
      margin-right: 12px;
    }
    .devtools-text-input:focus {
      border: 3px solid;
      border-color: rgba(138, 90, 158, 0.45);
      box-shadow: 0 0 0 4px rgba(234,76,137,0.1);
      outline: none;
      background: white;
    }
    .save-template-form {
      display: flex;
      margin-bottom: 12px;
      align-items: center;
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
      cursor: pointer;
      padding: 3px 4px;
      border-radius: 2px !important;
      height: 28px;
      padding: 4px 8px;
    }
    .template-button:hover,
    .template-button:focus {
      background: #1f890e36;
      outline: none;
    }
    `;
  }
  
  connectedCallback() {
    const { shadowRoot } = this;
    shadowRoot.innerHTML = `
      <style>
        ${this.getStyles()}
      </style>
      ${this.getContent()}
    `;
    
    
    shadowRoot.querySelector('button').addEventListener('click', this.close);
    shadowRoot.querySelector('.overlay').addEventListener('click', this.close);
    shadowRoot.querySelector('.fdt-save-response-btn').addEventListener('click', this.saveResponse);
    shadowRoot.querySelector('.fdt-save-as-template-btn').addEventListener('click', this.toggleSaveTemplateForm);
    shadowRoot.querySelector('.save-template-button').addEventListener('click', this.saveTemplate);

    this.setCode(this.getAttribute('customResponseCode'));
    this.open = true;
  }

  saveResponse() {
    const code = this.shadowRoot.querySelector('wc-codemirror').value;
    eventBus.fire('fdt-save-response', {
      requestId: this.getAttribute('requestId'),
      code,
    });
    this.close();
    //close drawer
  }

  toggleSaveTemplateForm() {
    this.isSaveFormOpen = true;
    this.shadowRoot.querySelector('.save-template-form').classList.remove('hidden');
    this.shadowRoot.querySelector('.template-name-input').focus();
  }

  saveTemplate() {
    try {
      const code = this.shadowRoot.querySelector('wc-codemirror').value;
      JSON.parse(code);
      const templateName = this.shadowRoot.querySelector('.template-name-input').value;
      saveAsTemplate(code, templateName);
      eventBus.fire('fdt-refresh-templates');
      this.shadowRoot.querySelector('.save-template-form').classList.add('hidden');
    } catch(err) {
      console.log(err);
      // show warning
    }
  }
  setCode(code){
    this.shadowRoot.querySelector('wc-codemirror').value = code;
  }

  handleTemplateChange(event) {

    const code = getTemplate(event.detail.templateId).code;
    // const prettyCode = JSON.stringify(code, null, 2);
    this.setCode(code);
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('button').removeEventListener('click', this.close);
    this.shadowRoot.querySelector('.overlay').removeEventListener('click', this.close);
  }
  
  get open() {
    return this.hasAttribute('open');
  }
  
  
  set open(isOpen) {
    const { shadowRoot } = this;
    shadowRoot.querySelector('.wrapper').classList.toggle('open', isOpen);
    shadowRoot.querySelector('.wrapper').setAttribute('aria-hidden', !isOpen);
    if (isOpen) {
      this._wasFocused = document.activeElement;
      this.setAttribute('open', '');
      document.addEventListener('keydown', this._watchEscape);
      this.focus();
      shadowRoot.querySelector('button').focus();
    } else {
      this._wasFocused && this._wasFocused.focus && this._wasFocused.focus();
      this.removeAttribute('open');
      document.removeEventListener('keydown', this._watchEscape);
      this.close();
    }
  }
  
  
  close() {
    // if (this.open !== false) {
    //   this.open = false;
    // }
    eventBus.fire('fdt-close-editor');
  }
  
  _watchEscape(event) {
    if (event.key === 'Escape') {
        this.close();   
    }
  }
}

customElements.define('fdt-response-editor', OneDialog);
