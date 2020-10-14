window.onload = () => {

    let startButtons = Array.from(document.querySelectorAll('.start'));

    startButtons.forEach(button => {

        button.addEventListener('click', (e) => {

            e.preventDefault();

            new Relax(e.target.dataset.type);

        });
    });

};

class Relax {

    constructor(type) {
        
        this.type = type;
        this.app = document.getElementById('app');
        this.timing = this.getTiming();

        this.startApp();
    
    }

    
    startApp() {

        this.cleanApp();
        
        this.showSettings();

    }

    cleanApp() {

        this.app.innerHTML = '';

    }

    showSettings() {

        this.app.innerHTML = `
            <h3>${this.type} breathing excercise</h3>
            <label>Choose duration</label>
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
        let durationHtml = `${this.durationMinutes > 1 ? `${this.durationMinutes} minutes` : `${this.durationMinutes} minute`}`;
    
        this.timeSettingPreview = document.getElementById('time-setting-preview');
        this.timeSettingPreview.innerHTML = `
            ${durationHtml}
            <p id="calculated-breaths" class="bold"></p>
            <div><button id="start-excercise" class="bg-green white">Start the excercise</button></div>
        `;

        this.startExcerciseButton = document.getElementById('start-excercise');
        this.startExcerciseButton.addEventListener('click', (e) => {

            e.preventDefault();

            this.startRelax();

        });
        
    }

    showBreathCount() {

        this.calculatedBreaths = document.getElementById('calculated-breaths');
        this.calculatedBreaths.innerHTML = `${this.getBreaths()} breaths`;

    }

    initControls() {

        this.plusTime = document.getElementById('plus-time');
        this.minusTime = document.getElementById('minus-time');

        let value = 0;
        
        this.plusTime.addEventListener('click', (e) => {
            
            e.preventDefault();

            value++;
            this.updateTimeSetting(value);
            this.timeSetting.value++;

        });

        this.minusTime.addEventListener('click', (e) => {
            
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

        if (value === '' || value <= 0) {
            return false;
        }
        else {
            return true;
        }

    }

    getTiming() {

        switch (this.type) {

            default:
            case 'calm':

                return [4, 4, 4];

            case 'focus':

                return [4, 0, 4];

            case 'relax':

                return [4, 7, 8];

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
                    Find comfortable and quiet place.
                    <br>
                    Get rid of all distractions and turn your phone on airplane mode.
                    <br>
                    Be still and focus on your breath.
                    <br>
                    Listen to your body.
                    <br>
                    Empty your mind.
                </p>
                <hr>
            </div>
        `;

        this.instruction = document.getElementById('instruction');

        // this.visual = document.getElementById('visual');
        this.circle = document.getElementById('circle');

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

        this.instruction.innerHTML = 'inhale';
        this.instruction.classList.add('green');
        this.circle.classList.remove('shrink');
        this.circle.classList.add('grow');

        setTimeout(() => {

            this.instruction.innerHTML = 'hold';
            this.instruction.classList.remove('green');
            this.instruction.classList.add('blue');

            setTimeout(() => {

                this.instruction.innerHTML = 'exhale';
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
            <h2>Congratulation</h2>
            <p>You have just completed your excercise</p>
            <button onclick="(function(){location.reload()})()">Start again</button>
        `;

    }

}