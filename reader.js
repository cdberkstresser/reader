
/**
 * This file will clean up CampusWeb's presentation of material for usage of screen readers.
 * 
 * CampusWeb pukes up a lot hidden text that makes screen readers difficult to use.
 */

/**
 * Set up placeholders for easy access to voice, pitch, and speed settings and restore from storage.
 */
var settingsVoice = document.createElement("input");
var settingsPitch = document.createElement("input");
var settingsSpeed = document.createElement("input");

settingsVoice.id = "settingsVoice";
settingsVoice.setAttribute("type", "hidden");
settingsSpeed.id = "settingsSpeed";
settingsSpeed.setAttribute("type", "hidden");
settingsPitch.id = "settingsPitch";
settingsPitch.setAttribute("type", "hidden");


var questions = document.getElementsByClassName("questionDisplay");
questions[0].prepend(settingsVoice);
questions[0].prepend(settingsSpeed);
questions[0].prepend(settingsPitch);

try {
	var gettingVoice = browser.storage.sync.get('voice');
	gettingVoice.then((res) => {
		document.getElementById("settingsVoice").value = res.voice;
	});
	var gettingSpeed = browser.storage.sync.get('speed');
	gettingSpeed.then((res) => {
		document.getElementById("settingsSpeed").value = res.speed;
	});
	var gettingPitch = browser.storage.sync.get('pitch');
	gettingPitch.then((res) => {
		document.getElementById("settingsPitch").value = res.pitch;
	});
} catch (err) {
	console.log(err);
}

// get a list of questions to remove the screen reader offensive material.
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
					questionUtterance = new SpeechSynthesisUtterance(pronunciationHint(msg));
					try {
						var voiceNumber = document.getElementById("settingsVoice").value;
						questionUtterance.voice = speechSynthesis.getVoices()[voiceNumber];
						questionUtterance.rate = document.getElementById("settingsSpeed").value;
						questionUtterance.pitch = document.getElementById("settingsPitch").value;
					} catch (err) {
						console.log(err);
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