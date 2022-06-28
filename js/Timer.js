export default class Timer {
  constructor(root) {
    root.innerHTML = Timer.getHTML();

    this.el = {
      minutes: root.querySelector(".timer__part--minutes"),
      seconds: root.querySelector(".timer__part--seconds"),
      control: root.querySelector(".timer__btn--control"),
      reset: root.querySelector(".timer__btn--reset"),
      topText: root.querySelector(".top--text"),
      bottomText: root.querySelector(".bottom--text"),
    };

    this.interval = null;
    this.remainingSeconds = 0;
    this.audio = new Audio("dag.mp3");

    this.pomodoroSession = 0;
    this.pomoPause = false;
    this.fullsession = 0;
    this.consumingFreeTime = false;

    this.el.control.addEventListener("click", () => {
      this.updateFullSession();

      //Pomodoro Timer
      if (this.interval === null) {
        if (this.remainingSeconds === 0) {
          if (this.pomodoroSession == 4) {
            this.remainingSeconds = 2700; //Long Pause => 45 min
            this.pomodoroSession = 0;
            this.pomoPause = true;
            this.fullsession = this.fullsession + 1;
          } else {
            if (this.pomoPause == true) {
              this.remainingSeconds = 300; //300s = 5 min
            } else {
              this.remainingSeconds = 1500; //1500s = 25 Minutes
            }
          }
        }
        this.start();
      } else {
        this.stop();
      }
    });

    this.el.reset.addEventListener("click", () => {
      //Consume Free Time
      if (this.interval === null) {
        if (this.remainingSeconds === 0) {
          this.consumingFreeTime = true;
          this.remainingSeconds = 1; //1 * 1800; //Consume 1 full Session -> 30 Min Free Time
          this.fullsession = this.fullsession - 1;
          this.updateInterfaceTime();

          this.start();
        } else {
          this.stop();
        }
      }
    });
  }

  updateInterfaceTime() {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = Math.floor(this.remainingSeconds % 60);

    this.el.minutes.textContent = minutes.toString().padStart(2, "0");
    this.el.seconds.textContent = seconds.toString().padStart(2, "0");
  }

  updateInterfaceControls() {
    if (this.interval === null) {
      this.el.control.innerHTML = `<span class="material-icons">play_arrow</span>`;
      this.el.control.classList.remove("timer__btn--stop");
    } else {
      this.el.control.innerHTML = `<span class="material-icons">pause</span>`;
      this.el.control.classList.remove("timer__btn--start");
    }
  }

  updateFullSession() {
    if (this.pomoPause == true) {
      this.el.topText.innerText = "Time for a break";
    } else {
      this.el.topText.innerText = "Current Session: " + this.pomodoroSession;
    }
    this.el.bottomText.innerText =
      "Mastered Full Pomodoro Round (4x25min): " + this.fullsession;
  }

  start() {
    if (this.remainingSeconds === 0) {
      return;
    }

    this.audio.pause();
    this.audio.remainingSeconds = 0;

    this.interval = setInterval(() => {
      this.remainingSeconds--;
      this.updateInterfaceTime();

      if (this.remainingSeconds === 0) {
        this.audio.remainingSeconds = 100;
        this.audio.play();
        this.stop();

        if (this.consumingFreeTime == false) {
          if (this.pomoPause == false) {
            this.pomodoroSession = this.pomodoroSession + 1;
            this.pomoPause = true;
          } else {
            this.pomoPause = false;
          }
        }
      }
    }, 1000);

    this.updateInterfaceControls();
  }

  stop() {
    clearInterval(this.interval);
    this.interval = null;
    this.updateInterfaceControls();
  }

  static getHTML() {
    return `
      <div class="top--text"> Learn Timer :D </div>
      
      <span class="timer__part timer__part--minutes">00</span>
      <span class="timer__part">:</span>
      <span class="timer__part timer__part--seconds">00</span>
      
      <button type="button" class="timer__btn timer__btn--control timer__btn--start">
      <span class="material-icons">play_arrow</span></button>
      <button type="button" class="timer__btn timer__btn--reset">
      <span class="material-icons">timer</span>
      </button>

      <div class="bottom--text"><div>
    `;
  }
}
