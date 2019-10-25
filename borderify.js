/*
Just draw a border round the document.body.
*/
document.body.style.border = "5px solid blue";
//document.body.innerHTML = document.body.innerHTML;
var questions = document.getElementsByClassName("questionDisplay");
for (question = 0;question < questions.length;++question) {
	questions[question].innerHTML = questions[question].innerHTML + " bla bla ";
}