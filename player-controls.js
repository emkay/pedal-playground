import {LitElement, css, html} from 'lit'

export default class PlayerControls extends LitElement {
  static properties = {
    volume: {type: Number},
    pan: {type: Number},
    distortion: {type: Number},
    isPlaying: {type: Boolean}
  }

  static styles = css`
    .pedals-control-group {
      display: flex;
      justify-content: flex-end;
      padding: 0.5em;
    }

    .pedals-control-group label {
      flex: 1;
    }

    .pedals-control-group span {
      flex: 2;
    }

    .pedals-control-group input {
      flex: 3;
    }

    .pedals-control-group input:hover {
      cursor: grab;
    }

    .pedals-control-group button {
      padding: 0.5em;
      margin: 0.25em;
      width: 100%;
      font-size: 1.5em;
    }

    .pedals-control-group button:hover {
      cursor: pointer;
    }
  `

  constructor() {
    super()

    this.volume = 5
    this.pan = 0
    this.distortion = 0
  }

  onDistortionChange(e) {
    const value = e.target.value
    this.distortion = value

    this.dispatchEvent(new CustomEvent('distortion-change', {
      detail: value,
      bubbles: true,
      composed: true
    }))
  }

  onVolumeChange(e) {
    const value = e.target.value
    this.volume = value

    this.dispatchEvent(new CustomEvent('volume-change', {
      detail: value,
      bubbles: true,
      composed: true
    }))
  }

  onPanChange(e) {
    const value = e.target.value
    this.pan = value

    this.dispatchEvent(new CustomEvent('pan-change', {
      detail: value,
      bubbles: true,
      composed: true
    }))
  }

  onPlayClick() {
    this.isPlaying = !this.isPlaying

    this.dispatchEvent(new CustomEvent('play-click', {
      detail: {
        isPlaying: this.isPlaying
      }
    }))
  }

  render() {
    return html`
      <section class="pedals-controls">
        <heading>
          <h1>Controls</h1>
        </heading>
        <div class="pedals-control-group">
          <label for"pedals-volume">Volume:</label>
          <span>${this.volume}</span>
          <input id="pedals-volume" class="pedals-volume" @change="${this.onVolumeChange}" step="0.25" type="range" min="0" max="10" value="${this.volume}"/>
        </div>
        <div class="pedals-control-group">
          <label for="pedals-pan">Pan:</label>
          <span>${this.pan}</span>
          <input id="pedals-pan" class="pedals-pan" @change="${this.onPanChange}" step="0.25" type="range" min="-1" max="1" value="${this.pan}"/>
        </div>
        <div class="pedals-control-group">
          <label for"pedals-distortion">Distortion:</label>
          <span>${this.distortion}</span>
          <input id="pedals-distortion" class="pedals-distortion" @change="${this.onDistortionChange}" type="range" min="0" max="100" value="${this.distortion}"/>
        </div>
        <div class="pedals-control-group">
          <button @click="${this.onPlayClick}">${this.isPlaying ? "Pause" : "Play"}</button>
        </div>
      </section>
    `
  }
}

customElements.define('pedals-player-controls', PlayerControls)
