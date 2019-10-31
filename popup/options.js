function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        voice: 0
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#voice").value = result.voice || "0";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.sync.get("voice");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

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