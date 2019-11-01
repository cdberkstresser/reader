function saveOptions(e) {
    browser.storage.sync.set({
        voice: document.querySelector("#voice").value,
        speed: document.querySelector("#speed").value,
        pitch: document.querySelector("#pitch").value
    });
    e.preventDefault();
}

function restoreOptions() {
    var storageVoice = browser.storage.managed.get('voice');
    var storageSpeed = browser.storage.managed.get('speed');
    var storagePitch = browser.storage.managed.get('pitch');

    var gettingVoice = browser.storage.sync.get('voice');
    gettingVoice.then((res) => {
        document.querySelector("#voice").value = res.voice || 0;
    });

    var gettingSpeed = browser.storage.sync.get('speed');
    gettingSpeed.then((res) => {
        document.querySelector("#speed").value = res.speed || 1;
    });
    var gettingPitch = browser.storage.sync.get('pitch');
    gettingPitch.then((res) => {
        document.querySelector("#pitch").value = res.pitch || 1;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("change", saveOptions);


/**
 * Options menu for the top of the quiz.
 */
try {
    var settingsDiv = document.getElementById("settings");
    var voiceSelect = document.getElementById("voice");
    var speedSelect = document.getElementById("speed");
    var pitchSelect = document.getElementById("pitch");

    //the voices
    var voices = speechSynthesis.getVoices();
    for (var n = 0; n < voices.length; ++n) {
        voiceSelect.options[voiceSelect.options.length] = new Option(voices[n].name, n);
    }

    //the speeds
    for (var n = 5; n <= 15; n++) {
        speedSelect.options[speedSelect.options.length] = new Option((n / 10) + "x", n / 10);
    }
    speedSelect.selectedIndex = 5;

    //the pitch
    for (var n = 0; n <= 20; n++) {
        pitchSelect.options[pitchSelect.options.length] = new Option((n / 10), n / 10);
    }
    pitchSelect.selectedIndex = 10;

} catch (err) {

}