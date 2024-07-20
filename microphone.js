class Microphone {
    constructor() {
        this.initialised = false;
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(function(stream) {
                this.audioContext = new AudioContext();
                this.microphone = this.audioContext.createMediaStreamSource(stream);
                this.analyser = this.audioContext.createAnalyser(); // create analyser node
                // slice audio in equal parts. must be a power of 2 between 2^5 and 2^15
                this.analyser.fftSize = 512; // defaults to 2048;
                // frequencyBinCount is always equal to half of fftSize
                const bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(bufferLength); // 8 bit 
                this.microphone.connect(this.analyser);
                this.initialised = true;
            }
            .bind(this))
            .catch(function(err) { 
                alert(err) 
            });
    }
    getSamples() {
        this.analyser.getByteTimeDomainData(this.dataArray); // 0 - 255
        let normSamples = [...this.dataArray].map(e => e/128 -1) // 0 - -2, then -1 or +1
        return normSamples;
    }
    
    getVolume() {
        this.analyser.getByteTimeDomainData(this.dataArray); // 0 - 255
        let normSamples = [...this.dataArray].map(e => e/128 -1) // 0 - -2, then -1 or +1
        let sum = 0;
        // Root mean square average
        
        for (let i = 0; i < normSamples.length; i++) {
            sum += normSamples[i] * normSamples;
        }
        
        let volume = Math.sqrt(sum / normSamples.length);
        return volume;
    }
}

const microphone = new Microphone();
console.log(microphone);