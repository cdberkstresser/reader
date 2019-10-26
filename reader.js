
/**
 * This file will clean up CampusWeb's presentation of material for usage of screen readers.
 * 
 * CampusWeb pukes up a lot hiddne text that makes screen readers difficult to use.
 */

//get a list of questions to edit their html to remove the screen reader offensive material.
var questions = document.getElementsByClassName("questionDisplay");
for (question = 0; question < questions.length; ++question) {
	//create a string variable to make repeated replaces easier.
	var html = questions[question].innerHTML;


	/*
		Save question for speech synthesis
	*/
	// use the wysiwygtext div as a marker to get the question.
	var questionText = html.match(/<div class="wysiwygtext">.*<\/div>/i)[0];
	// remove the wysiwyg tag garbage to get the question text.
	questionText = questionText.replace(/<div class="wysiwygtext">/g, "");
	questionText = questionText.replace(/<\/div>/g, "");

	/*
		Save answers for speech synthesis
	*/
	var answerText = "";
	// use the Select blah blah blah as your answer to get the available answers to this question.
	var answers = html.match(/Select .* as your answer/ig);

	//for each answer, append it to a list of available answers.
	try {
		for (n = 0; n < answers.length; ++n) {
			answerText += answers[n].replace("Select ","\n" + (n+1) + " ").replace(" as your answer", "");
		}
	} catch (err) {

	}
	//append the answer to the question so it can be read together.
	questionText += answerText;
	//sanitize some inputs
	questionText = questionText.replace(/`/g, "");
	questionText = questionText.replace(/'/g, "");
	questionText = questionText.replace(/"/g, "");
	questionText = questionText.replace(/[_]+/g, "");

	//log all questions to the console
	console.log(questionText);

	//remove the <legend> tags globally
	html = html.replace(/<legend>.*<\/legend>/g, "");
	//remove the extra select blah as your answer headers.  These don't help.
	html = html.replace(/Select (.*) as your answer/g, "");
	//remove the points possible on the assignment.  These don't help
	html = html.replace(/\([0-9]+pts\)/g, "");
	//remove extra paragraph tag on questions
	html = html.replace(/<div class="wysiwygtext"><p>/g, "<div class=\"wysiwygtext\">");
	//add a line break after each question for more readability.
	html = html.replace(/<\/fieldset>/g, "</fieldset><br>");

	//add a button to the question to play it in a speech synthesizer.
	html = html.replace(/<div class="wysiwygtext">/g, "<div class=\"wysiwygtext\"><button type=button onclick='window.speechSynthesis.speak(new SpeechSynthesisUtterance(`" + questionText + "`));'>Play</button>&nbsp;");

	//replace the innerHTML to include the speech syntesizer and clean up for copy/paste if desired by user.
	questions[question].innerHTML = html;
}
//set a blue border to let users know this extension is active.
document.body.style.border = "5px solid blue";