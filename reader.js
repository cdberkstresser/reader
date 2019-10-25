document.body.style.border = "5px solid blue";
var questions = document.getElementsByClassName("questionDisplay");
for (question = 0;question < questions.length;++question) {
	questions[question].innerHTML = questions[question].innerHTML + " bla bla ";
}