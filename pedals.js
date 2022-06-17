// import Distortion from './effects/distortion.js'

export default class Pedals {
  constructor() {
    this.isStarted = false
    this.audioContext = new AudioContext()
    this.source = this.audioContext.createBufferSource()
    this.analyser = this.audioContext.createAnalyser()
    this.gainNode = this.audioContext.createGain()
    this.pannerNode = this.audioContext.createStereoPanner()
    this.distortionNode = this.audioContext.createWaveShaper()

    this.source.connect(this.analyser)
    this.analyser.connect(this.gainNode)
    this.gainNode.connect(this.pannerNode)
    this.pannerNode.connect(this.distortionNode)
    this.distortionNode.connect(this.audioContext.destination)
  }

  async decode(audioData) {
    try {
      const buffer = await this.audioContext.decodeAudioData(audioData)
      this.source.buffer = buffer
      this.source.loop = false
    } catch (e) {
      console.error(e)
    }
  }

  makeDistortionCurve(k = 50) {
    // https://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion
    const DEG = Math.PI / 180
    const nSamples = 44100
    const curve = new Float32Array(nSamples)
    curve.forEach((_, i) => {
      const x = (i * 2) / nSamples - 1
      curve[i] = ((3 + k) * x * 20 * DEG) / (Math.PI + k * Math.abs(x))
    })
    return curve
  }

  setDistortion(value) {
    this.distortionNode.curve = this.makeDistortionCurve(value)
  }

  setVolume(value) {
    this.gainNode.gain.setValueAtTime(value, this.audioContext.currentTime)
  }

  setPan(value) {
    this.pannerNode.pan.setValueAtTime(value, this.audioContext.currentTime)
  }

  play() {
    if (!this.isStarted) {
      this.source.start(0)
      this.isStarted = true
    } else {
      this.audioContext.resume()
    }
  }

  stop() {
    this.audioContext.suspend()
  }
}

