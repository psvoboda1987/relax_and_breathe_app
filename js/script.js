window.onload = () => {

    let startButtons = Array.from(document.getElementsByClassName('start'));

    startButtons.forEach(button => {

        button.addEventListener('click', (e) => {

            e.preventDefault();

            new Relax(e.target.dataset.type);

        });
    });

};

class Relax {

    app = document.getElementById('app');

    constructor(type) {
        
        this.type = type;

        this.setTiming();

        this.cleanApp();
        
        this.showSettings();

    }

    setTiming() {

        this.timing = this.getTiming();

    }

    cleanApp() {

        this.app.innerHTML = '';

    }

    showSettings() {

        this.app.innerHTML = `
            <h3>${this.type} </h3>
            <label>Zvolte délku (minuty)</label>
            <input type="text" id="time-setting" class="maw-300">
            <div>
                <button id="minus-time" class="bg-purple white">-</button>
                <button id="plus-time" class="bg-olive white">+</button>
            </div>
            <span id="time-setting-preview"></span>
        `;

        this.initControls();

        this.timeSetting = document.getElementById('time-setting');
        this.timeSetting.value = 0;

    }

    showTime(value) {

        this.durationMinutes = value;
        let durationHtml = `${this.durationMinutes} ${this.durationMinutes > 1 ? ` minuty` : ` minuta`}`;
    
        document.getElementById('time-setting-preview').innerHTML = `
            ${durationHtml}
            <p id="calculated-breaths" class="bold"></p>
            <div><button id="start-excercise" class="bg-green white">Začít cvičení</button></div>
        `;

        document.getElementById('start-excercise').addEventListener('click', (e) => {

            e.preventDefault();

            this.startRelax();

        });
        
    }

    showBreathCount() {

        document.getElementById('calculated-breaths').innerHTML = `${this.getBreaths()} ${this.getBreaths() < 5 ? 'nádechy' : 'nádechů'} `;

    }

    initControls() {

        let value = 0;
        
        document.getElementById('plus-time').addEventListener('click', (e) => {
            
            e.preventDefault();

            value++;

            this.updateTimeSetting(value);

            this.timeSetting.value++;

        });

        document.getElementById('minus-time').addEventListener('click', (e) => {
            
            e.preventDefault();

            if (value <= 1) return;

            value--;

            this.updateTimeSetting(value);

            this.timeSetting.value--;

        });

    }

    updateTimeSetting(value) {

        if (this.validate(value) === false) return false;

        this.showTime(value);

        this.showBreathCount();
        
    }

    validate(value) {

        if (value === '' || value <= 0) return false;
        
        return true;

    }

    getTiming() {

        switch (this.type) {

            case 'Soustředění':

                return [4, 0, 4];

            case 'Relaxace':

                return [4, 7, 8];

            default:
            case 'Uklidnění':

                return [4, 4, 4];

        }

    }

    getBreaths() {

        let timePerExcercise = this.timing.reduce((total, value) => total + value);
        this.timePerExcercise = timePerExcercise;

        return parseInt(((this.durationMinutes * 60) / timePerExcercise));

    }

    startRelax(){

        this.cleanApp();

        let timeLimit = this.durationMinutes * 60;
        let elapsedTime = 1;
                
        this.app.innerHTML = `
            <div id="visual">
                <div id="circle">
                    <div id="core"></div>
                </div>
                <div id="inner-display">
                    <h3 id="timer"></h3>
                    <h3 id="instruction"></h3>
                </div>
            </div>
            <div>
                <hr>
                <p>
                    Najděte si klidné a komfortní místo pro cvičení.
                    <br>
                    Zbavte se všeho, co vás rozptyluje a ztlumte svůj telefon.
                    <br>
                    Buďte v klidu a soustřeďte se na správné dýchání.
                    <br>
                    Naslouchejte svému tělu.
                    <br>
                    Uklidněte svoji mysl.
                </p>
                <hr>
                <a href="index.html">Zpět na začátek</a>
            </div>
        `;

        this.timer = document.getElementById('timer');
        this.timer.innerHTML = elapsedTime;

        let clock = setInterval(() => {

            if (elapsedTime >= timeLimit) {
            
                clearInterval(clock);

                return;

            }

            elapsedTime++;

            this.timer.innerHTML = elapsedTime;

        }, 1000);

        this.runBreatheCycle();

        let breatheCycle = setInterval(() => {

            if (elapsedTime >= timeLimit) {
            
                clearInterval(breatheCycle);

                this.finishCycle();

                return;

            }

            this.runBreatheCycle();
            
        }, this.timePerExcercise * 1000);

    }

    runBreatheCycle() {

        this.inhaleTime = this.timing[0] * 1000;
        this.holdTime = this.timing[1] * 1000;
        this.exhaleTime = this.timing[2] * 1000;

        this.instruction = document.getElementById('instruction');
        this.instruction.innerHTML = 'nádech';
        this.instruction.classList.add('green');

        this.circle = document.getElementById('circle');
        this.circle.classList.remove('shrink');
        this.circle.classList.add('grow');

        setTimeout(() => {

            this.instruction.innerHTML = 'výdrž';
            this.instruction.classList.remove('green');
            this.instruction.classList.add('blue');

            setTimeout(() => {

                this.instruction.innerHTML = 'výdech';
                this.circle.classList.remove('grow');
                this.circle.classList.add('shrink');
                this.instruction.classList.remove('blue');
                this.instruction.classList.add('orange');

            }, this.holdTime);

        }, this.inhaleTime);
        
    }

    finishCycle() {

        this.cleanApp();

        this.app.innerHTML = `
            <h2>Gratuluji</h2>
            <p>Právě jste dokončili vaše cvičení</p>
            <button onclick="(function(){location.reload()})()">Opakovat</button>
        `;

    }

}