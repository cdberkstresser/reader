
/**
 * This file will clean up CampusWeb's presentation of material for usage of screen readers.
 */

/* Add an options menu to the top of the quiz for selecting voice, pitch, and speed. */
addOptionsMenuToTopOfQuiz();
/* Add a play button to each question. */
addPlayButtons();
/* Remove extraneous content from page. */
removeExtraneousPageData();
/* Set up voice options in the options menu at the top of the quiz for available voices, pitches, and speeds. */
setUpVoices();
/* Restore available voices, pitches, and speeds settings from storage if available. */
restoreOptions();
/* Add event listeners to changes on the voice, pitch, and speed settings. */
document.getElementById("voice").addEventListener("change", saveOptions);
document.getElementById("speed").addEventListener("change", saveOptions);
document.getElementById("pitch").addEventListener("change", saveOptions);

/* The voices available on the system don't appear to be synchronous.  Add them to the list of available options when they are available or change. */
window.speechSynthesis.addEventListener('voiceschanged', setUpVoices);

/**
 * This function handles an issue in which Chrome cancels running threads after about 16 seconds.
 */
function restartSpeech() {
	window.speechSynthesis.resume();
}
/**
 * This function adds an options menu to the top of each quiz for selecting voice, pitch, and speed.
 */
function addOptionsMenuToTopOfQuiz() {
	try {
		var settingsDiv = document.createElement("div");
		var voiceSelect = document.createElement("select");
		var speedSelect = document.createElement("select");
		var pitchSelect = document.createElement("select");
		//first the container div
		settingsDiv.id = "divReaderSettings";
		settingsDiv.textContent = "Reader Settings:\n";
		settingsDiv.setAttribute('style', 'white-space: pre;');
		settingsDiv.style.marginBottom = "1em";
		settingsDiv.style.fontWeight = "bold";
		settingsDiv.style.display = "inline-block";
		settingsDiv.style.border = "1px solid";
		settingsDiv.style.padding = "0.5em";

		//the voices
		voiceSelect.name = "voice";
		voiceSelect.id = "voice";
		voiceSelect.style.width = "100%";
		voiceSelect.style.display = "none";
		voiceSelect.style.marginBottom = "0.5em";

		//the speeds
		speedSelect.name = "speed";
		speedSelect.id = "speed";
		speedSelect.style.width = "100%";
		speedSelect.style.display = "block";
		for (var n = 8; n <= 12; n++) {
			speedSelect.options[speedSelect.options.length] = new Option("Speed: " + (n / 10) + "x", n / 10);
		}
		speedSelect.selectedIndex = 3;
		speedSelect.style.marginBottom = "0.5em";

		//the pitch
		pitchSelect.name = "pitch";
		pitchSelect.id = "pitch";
		pitchSelect.style.width = "100%";
		pitchSelect.style.display = "block";
		for (var n = 8; n <= 12; n++) {
			pitchSelect.options[pitchSelect.options.length] = new Option("Pitch: " + (n / 10), n / 10);
		}
		pitchSelect.selectedIndex = 3;

		document.getElementsByClassName("questionArea")[0].prepend(settingsDiv);
		settingsDiv.append(voiceSelect);
		settingsDiv.append(speedSelect);
		settingsDiv.append(pitchSelect);
	} catch (err) {
		console.log(err);
	}
}

/**
 * This function adds play buttons to each question on the quiz to read the question aloud.
 */
function addPlayButtons() {
	// get a list of questions to remove the screen reader offensive material.
	var questions = document.getElementsByClassName("questionDisplay");
	for (var question = 0; question < questions.length; ++question) {
		try {
			// save question for speech synthesis
			var questionText = questions[question].getElementsByClassName("wysiwygtext")[0].textContent.trim();
			// save answers for speech synthesis
			var answerText = "";
			var answers = questions[question].getElementsByClassName("multiChoice");
			for (var n = 0; n < answers.length; ++n) {
				answerText += "\n" + (n + 1) + " " + answers[n].getElementsByClassName("multiContent")[0].textContent.trim();
			}
			//consider true or false questions, which are layed out differently.
			if (answers.length == 0 && questions[question].innerHTML.match("questionResponses.trueFalse")) {
				questionText = "True or false. " + questionText;
				//answerText += "\n1 True";
				//answerText += "\n2 False";
			}
			// replace _____ in questions with "[blank]" instead.
			questionText = questionText.replace(/[_]{2,}/g, "[blank]");

			// append the answer to the question so it can be read together.
			questionText += answerText + "\n";

			//add a button to the question to play it in a speech synthesizer.
			var btn = document.createElement("button");
			btn.id = "btnPlay_" + question;
			btn.name = btn.id;
			btn.textContent = "Play";
			btn.type = "button";
			btn.style.marginRight = "1em";
			btn.onclick = (function (id, msg) {
				return function () {

					if (document.getElementById(id).textContent == "Stop") { 	// if something is already playing, just cancel it.
						window.speechSynthesis.cancel();
					} else {
						document.getElementById(id).textContent = "Stop"; 		// otherwise, start playing and set the button to allow stoppage
						window.speechSynthesis.cancel();
						var questionUtterance = new SpeechSynthesisUtterance(pronunciationHint(msg));
						try {
							if (document.querySelector("#speed").options.length > 0) {
								questionUtterance.voice = speechSynthesis.getVoices()[document.querySelector("#voice").value];
							}
							questionUtterance.rate = document.querySelector("#speed").value;
							questionUtterance.pitch = document.querySelector("#pitch").value;
						} catch (err) {
							console.log("Error setting voice options: " + err);
						}
						window.speechSynthesis.speak(questionUtterance);
						var timer = window.setInterval(restartSpeech, 15000);
						questionUtterance.onend = function () {					// add an event to reset the text to "Play"
							document.getElementById(id).textContent = "Play";
							clearInterval(timer);
						}
					}
				}
			})(btn.id, questionText);
			var questionForInjectingButton = questions[question].getElementsByClassName("wysiwygtext")[0];
			questionForInjectingButton.prepend(btn);


		} catch (err) {
			console.log("An error has occurred\n" + err);
		}
	}
}

/**
 * This function removes extraneous data from the page that makes copy/paste difficult.
 */
function removeExtraneousPageData() {
	// get a list of questions to remove the screen reader offensive material.
	var questions = document.getElementsByClassName("questionDisplay");
	for (var question = 0; question < questions.length; ++question) {
		try {
			// remove the <legend> tags globally
			var legends = questions[question].getElementsByTagName("legend");
			while (legends.length > 0) {
				legends[0].parentNode.removeChild(legends[0]);
			}

			//remove the points possible on the assignment.  These don't help
			questions[question].getElementsByClassName("pointDisplay")[0].textContent = questions[question].getElementsByClassName("pointDisplay")[0].textContent.replace(/\([0-9]+pts\)/g, "").trim() + "\n";

			// remove the extra select blah as your answer headers.  These don't help.
			var labels = questions[question].getElementsByTagName("label");
			for (var n = 0; n < labels.length; ++n) {
				labels[n].textContent = labels[n].textContent.replace(/Select (.*) as your answer/g, "");
			}
		} catch (err) {
			console.log("An error has occurred\n" + err);
		}
	}
}

/**
 * This method saves the user's chosen properties of the voice to local storage.  Did not use sync storage since different machines and OSs may have different voices.
 * @param {*} e The event arguments
 */
function saveOptions(e) {
	try {
		var api = chrome || browser;
		api.storage.sync.set({
			voice: document.querySelector("#voice").value,
			speed: document.querySelector("#speed").value,
			pitch: document.querySelector("#pitch").value
		});
		e.preventDefault();
	} catch (err) {
		console.log(err);
	}
}

/**
 * Restores voice options from local storage.
 */
function restoreOptions() {
	try {
		var api = chrome || browser;
		api.storage.sync.get(null, res => {
			document.querySelector("#voice").value = res.voice || getFirstVoice();
			document.querySelector("#speed").value = res.speed || 1;
			document.querySelector("#pitch").value = res.pitch || 1;
		});
	} catch (err) {
		console.log(err);
	}
}

/**
 * The speechSynthesis object isn't always ready at load.  Make it an event.
 */
function setUpVoices() {
	try {
		var voiceSelect = document.querySelector("#voice");
		if (voiceSelect.options.length == 0) {
			if (typeof window.speechSynthesis !== 'undefined') {
				var voices = window.speechSynthesis.getVoices();
				for (var n = 0; n < voices.length; ++n) {
					if (voices[n].lang.substring(0, 2) == document.documentElement.lang.substring(0, 2)) {
						voiceSelect.options[voiceSelect.options.length] = new Option("Voice: " + voices[n].name, n);
					}
				}
				if (voices.length > 0) {
					voiceSelect.style.display = "block";
				} else {
					voiceSelect.style.display = "none";
				}
			} 
		}
	} catch (err) {
		console.log(err);
	}
}

/**
 * Get the first voice available that matches the document language.
 */
function getFirstVoice() {
	try {
		var voiceSelect = document.querySelector("#voice");
		if (typeof window.speechSynthesis !== 'undefined') {
			var voices = window.speechSynthesis.getVoices();
			for (var n = 0; n < voices.length; ++n) {
				if (voices[n].lang.substring(0, 2) == document.documentElement.lang.substring(0, 2)) {
					return n;
				}
			}
		}
		return 0;
	} catch (err) {
		console.log(err);
	}
}