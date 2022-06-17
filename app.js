import {LitElement, css, html} from 'lit'
import Drop from './components/drop.js'
import PlayerControls from './components/player-controls.js'
import FileList from './components/file-list.js'
import Pedals from './pedals.js'

export class App extends LitElement {
  static properties = {
    files: {type: Map},
    isPlaying: {type: Boolean},
    currentTime: {type: Number},
    trackLength: {type: Number}
  }

  static styles = css`
    :host {
      font-size: 32px;
      font-family: sans-serif;
    }

    .pedals-top {
      display: flex;
    }

    .pedals-file-list {
      flex: 1;
    }
    .pedals-file-drop, .pedals-controls {
      flex: 2;
    }
  `
  constructor() {
    super()
  }

  async handleFileClick(e) {
    if (this.pedals && this.pedals.isStarted) {
      this.pedals.stop()
      clearInterval(this.timer)
    }
    const name = e.detail
    const file = this.files.get(name)
    const audioData = await file.arrayBuffer()
    this.pedals = new Pedals()
    this.pedals.setVolume(5)
    await this.pedals.decode(audioData)
    this.isPlaying = this.pedals.isStarted
    this.currentTime = this.pedals.audioContext.currentTime
    this.trackLength = this.pedals.source.buffer.duration
    this.isPlaying = true
    this.pedals.play()
    this.timer = setInterval(() => {
      if (this.pedals.audioContext.currentTime > this.trackLength) {
        this.pedals.stop()
        this.isPlaying = false
      }
      this.currentTime = this.pedals.audioContext.currentTime
    }, 500)
  }

  handleFileClear() {
    this.files = new Map()
  }

  handleFileDrop(e) {
    console.log(`handleFileDrop: `, e)
    const files = e.detail

    this.files = new Map()
    files.forEach(file => {
      this.files.set(file.name, file)
    })
  }

  handleDistortionChange(e) {
    const value = e.detail
    console.log(`distortion change: ${value}`)
    this.pedals.setDistortion(value)
  }

  handleVolumeChange(e) {
    const value = e.detail
    console.log(`volume change: ${value}`)
    this.pedals.setVolume(value)
  }

  handlePanChange(e) {
    const value = e.detail
    console.log(`pan change: ${value}`)
    this.pedals.setPan(value)
  }

  handlePlayClick(e) {
    const isPlaying = e.detail.isPlaying
    this.isPlaying = isPlaying
    if (isPlaying) {
      this.pedals.play()
    } else {
      this.pedals.stop()
    }
  }

  handlePauseClick() {
    this.pedals.stop()
  }

  render() {
    const timeValue = this.currentTime && this.trackLength ? this.currentTime / this.trackLength : 0

    return html`
      <main>
        <h1>Pedal Playground</h1>

        <section class="pedals-top">
          <div class="pedals-file-list">
            <pedals-file-list
              .files=${this.files ? this.files : new Map()}
              @file-click="${this.handleFileClick}"
              @file-clear="${this.handleFileClear}"
            >
            </pedals-file-list>
          </div>

          ${!this.files || this.files.size === 0 ? html`
          <div class="pedals-file-drop">
            <pedals-drop
              @file-drop="${this.handleFileDrop}">
            </pedals-drop>
          </div>` :

          html`
          <div class="pedals-controls">
            <pedals-player-controls
              @volume-change="${this.handleVolumeChange}"
              @pan-change="${this.handlePanChange}"
              @play-click="${this.handlePlayClick}"
              @pause-click="${this.handlePauseClick}"
              @distortion-change="${this.handleDistortionChange}"
              ?isPlaying=${this.isPlaying}
            >
            </pedals-player-controls>
          </div>`}
        </section>
        <section class="progress">
          <progress value="${timeValue}"></progress>
          <span>${this.currentTime && Math.round(this.currentTime) || 0}</span>
        </section>
      </main>
    `
  }
}

customElements.define('pedals-app', App)
