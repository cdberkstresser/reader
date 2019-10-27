
/**
 * This file will clean up CampusWeb's presentation of material for usage of screen readers.
 * 
 * CampusWeb pukes up a lot hidden text that makes screen readers difficult to use.
 */

// get a list of questions to remove the screen reader offensive material.
var questions = document.getElementsByClassName("questionDisplay");
for (question = 0; question < questions.length; ++question) {
	try {
		/***************************************************************
		* Step 1: Clean up the question and potential answers for speech synthesis.
		***************************************************************/

		// save question for speech synthesis
		var questionText = questions[question].getElementsByClassName("wysiwygtext")[0].textContent.trim();
		// save answers for speech synthesis
		var answerText = "";
		var answers = questions[question].getElementsByClassName("multiChoice");
		for (n = 0; n < answers.length; ++n) {
			answerText += "\n" + (n + 1) + " " + answers[n].getElementsByClassName("multiContent")[0].textContent.trim();
		}

		// append the answer to the question so it can be read together.
		questionText += answerText + "\n";
		// sanitize some inputs
		questionText = questionText.replace(/[^a-zA-Z0-9/ /./,/?/:/\n]/g,"");
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
		questions[question].innerHTML = questions[question].innerHTML.replace(/Select (.*) as your answer/g, "")

		//add a button to the question to play it in a speech synthesizer.
		var questionForInjectingButton = questions[question].getElementsByClassName("wysiwygtext")[0];
		questionForInjectingButton.textContent = questionForInjectingButton.textContent.trim();
		questionForInjectingButton.innerHTML = "<button type=button onclick='window.speechSynthesis.speak(new SpeechSynthesisUtterance(`" + questionText + "`));'>Play</button>&nbsp; " + questionForInjectingButton.textContent;
	} catch (err) {
		console.log("An error has occurred\n" + err);
	}
}
//set a blue border to let users know this extension is active.
document.body.style.border = "5px solid blue";