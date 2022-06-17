import {LitElement, css, html} from 'lit'

export default class FileList extends LitElement {
  static styles = css`
    a {
      color: #868b8e;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `
  static properties = {
    files: {type: Map}
  }

  constructor() {
    super()
  }

  handleFileClick(e) {
    const file = e.target.textContent
    this.dispatchEvent(new CustomEvent('file-click', {
      detail: file,
      bubbles: true,
      composed: true
    }))
  }

  handleClearClick() {
    this.dispatchEvent(new CustomEvent('file-clear', {
      bubbles: true,
      composed: true
    }))
  }

  render() {
    console.log('render file list')
    const fileNames = Array.from(this.files.keys())
      .map(file => html`<li><a href="#" @click="${this.handleFileClick}">${file}</a></li>`)
    return html`
      <section class="pedals-file-list">
        <heading>
          <h1>Track List</h1>
        </heading>
        <ol>
          ${fileNames}
        </ol>
        <button @click="${this.handleClearClick}">Clear</button>
      </section>
    `
  }
}

customElements.define('pedals-file-list', FileList)
