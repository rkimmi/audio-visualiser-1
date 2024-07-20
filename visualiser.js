function main () {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    class Bar {
        constructor(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
        }

        update(micInput) {
            // micInput is -1 or +1
            this.height = micInput * 1000;
        }

        draw(context) {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height)
        }
    }

    const microphone = new Microphone();
    let bars = [];
    let barWidth = canvas.width/256;
    function createBars() {
        for (let i = 0; i < 256; i++) {
            // first arg is pos on degree wheel
            let color = 'hsl(' + i * 2 + ', 60%, 50%)';
            bars.push(new Bar(i * barWidth, canvas.height/2, 1, 20, color))
        }
    }
    
    createBars();

    function animate() {
        if (microphone.initialised) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // generate audio sample from microphone
            // animate bars
            const samples = microphone.getSamples();
            bars.forEach(function(bar, i) {
                bar.update(samples[i]);
                bar.draw(ctx);
            })
        }
        
        requestAnimationFrame(animate) // loop
    }

    animate(); // kick off animation loop
}