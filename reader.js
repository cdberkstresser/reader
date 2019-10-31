
/**
 * This file will clean up CampusWeb's presentation of material for usage of screen readers.
 * 
 * CampusWeb pukes up a lot hidden text that makes screen readers difficult to use.
 */

/**
 * Options menu for the top of the quiz.
 */
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

	//the voices
	voiceSelect.name = "readerVoice";
	voiceSelect.id = "readerVoice";
	voiceSelect.style.marginRight = "0.5em";
	var voices = speechSynthesis.getVoices();
	for (var n = 0; n < voices.length; ++n) {
		voiceSelect.options[voiceSelect.options.length] = new Option("Voice: " + voices[n].name, n);
	}

	//the speeds
	for (var n = 5; n <= 15; n++) {
		speedSelect.options[speedSelect.options.length] = new Option("Speed: " + (n / 10) + "x", n / 10);
	}
	speedSelect.selectedIndex = 5;
	speedSelect.style.marginRight = "0.5em";

	//the pitch
	for (var n = 0; n <= 20; n++) {
		pitchSelect.options[pitchSelect.options.length] = new Option("Pitch: " + (n / 10), n / 10);
	}
	pitchSelect.selectedIndex = 10;
	pitchSelect.style.marginRight = "0.5em";

	document.getElementsByClassName("questionArea")[0].prepend(settingsDiv);
	settingsDiv.append(voiceSelect);
	settingsDiv.append(speedSelect);
	settingsDiv.append(pitchSelect);
} catch (err) {

}

// get a list of questions to remove the screen reader offensive material.
var questions = document.getElementsByClassName("questionDisplay");
for (var question = 0; question < questions.length; ++question) {
	try {
		/***************************************************************
		* Step 1: Clean up the question and potential answers for speech synthesis.
		***************************************************************/

		// save question for speech synthesis
		var questionText = questions[question].getElementsByClassName("wysiwygtext")[0].textContent.trim();
		// save answers for speech synthesis
		var answerText = "";
		var answers = questions[question].getElementsByClassName("multiChoice");
		for (var n = 0; n < answers.length; ++n) {
			answerText += "\n" + (n + 1) + " " + answers[n].getElementsByClassName("multiContent")[0].textContent.trim();
		}

		// replace _____ in questions with "[blank]" instead.
		questionText = questionText.replace(/[_]{2,}/g, "[blank]");

		// append the answer to the question so it can be read together.
		questionText += answerText + "\n";
		// log all questions to the console
		console.log(questionText);

		/***************************************************************
		* Step 2: Clean up the page itself for copy/paste into a personal screen reader if the on-screen one fails for some reason.
		***************************************************************/
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
						questionUtterance.voice = speechSynthesis.getVoices()[voiceSelect.options[voiceSelect.selectedIndex].value];
						questionUtterance.rate = speedSelect.options[speedSelect.selectedIndex].value;
						questionUtterance.pitch = pitchSelect.options[pitchSelect.selectedIndex].value;
					} catch (err) {

					}
					window.speechSynthesis.speak(questionUtterance);
					questionUtterance.onend = function () {					// add an event to reset the text to "Play"
						document.getElementById(id).textContent = "Play";
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
//set a blue border to let users know this extension is active.
document.body.style.border = "5px solid blue";