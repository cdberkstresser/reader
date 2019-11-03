function saveOptions(e) {
    browser.storage.sync.set({
        experimentalMode: document.querySelector("#experimentalMode").value,
        indefiniteArticleColor: document.querySelector("#indefiniteArticleColor").value,
        definiteArticleColor: document.querySelector("#definiteArticleColor").value,
        dyslexify: document.querySelector("#dyslexify").value
    });
    e.preventDefault();
}
function restoreOptions() {
	try {
		var api = chrome || browser;
		api.storage.local.get(null, res => {
			document.querySelector("#experimentalMode").value = res.experimentalMode || 0;
			document.querySelector("#indefiniteArticleColor").value = res.indefiniteArticleColor || 0;
            document.querySelector("#definiteArticleColor").value = res.definiteArticleColor || 0;
            document.querySelector("#dyslexify").value = res.dyslexify || 0;
		});
	} catch (err) {
		console.log(err);
	}
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("change", saveOptions);