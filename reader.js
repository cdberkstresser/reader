
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
	var questionText = html.match(/<div class="wysiwygtext">.*<\/div>/i)[0];
	questionText = questionText.replace(/<div class="wysiwygtext">/g, "");
	questionText = questionText.replace(/<\/div>/g, "");

	/*
		Save answers for speech synthesis
	*/
	var answerText = "";
	var answers = html.match(/Select .* as your answer/ig);

	try {
		for (n = 0; n < answers.length; ++n) {
			answerText += answers[n].replace("Select ","\n" + (n+1) + " ").replace(" as your answer", "");
		}
	} catch (err) {

	}
	questionText += answerText;
	questionText = questionText.replace(/`/g, "");

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

	html = html.replace(/<div class="wysiwygtext">/g, "<div class=\"wysiwygtext\"><button type=button onclick='window.speechSynthesis.speak(new SpeechSynthesisUtterance(`" + questionText + "`));'>Play</button>&nbsp;");

	questions[question].innerHTML = html;
}
//set a blue border to let users know this extension is active.
document.body.style.border = "5px solid blue";