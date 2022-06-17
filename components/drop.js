import {LitElement, css, html} from 'lit'

export default class Drop extends LitElement {
  static styles = css`
  .drop-zone {
    border: 2px dashed blue;
    width:  400px;
    height: 200px;
    padding: 0.5em;
    margin: auto;
  }

  .drop-zone h1 {
    text-align: center;
  }
  `

  constructor() {
    super()
  }

  handleDrag(e) {
    e.preventDefault()
  }

  handleDrop(e) {
    e.preventDefault()
    const items = e.dataTransfer.items
    if (items) {
      const filteredItems = Array.from(items).filter(this.isSupportedItem)
      const files = filteredItems
        .map(item => item.getAsFile())

      this.dispatchEvent(new CustomEvent('file-drop', {
        detail: files,
        bubbles: true,
        composed: true
      }))
    }
  }

  isSupportedItem(item) {
    return item.kind === 'file' && item.type === 'audio/mpeg'
  }

  render() {
    return html`
      <section class="drop-component">
        <section class="drop-zone" @drop=${this.handleDrop} @dragover=${this.handleDrag}>
          <heading>
            <h1>Drop File(s)</h1>
          </heading>
        </section>
      </section>
    `
  }
}

customElements.define('pedals-drop', Drop)
