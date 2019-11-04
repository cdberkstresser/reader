/**
 * This method saves the user's chosen properties of the voice to local storage.  Did not use sync storage since different machines and OSs may have different voices.
 * @param {*} e The event arguments
 */
function saveOptions(e) {
    var api = chrome || browser;
    api.storage.local.set({
        experimentalMode: document.querySelector("#experimentalMode").checked,
        indefiniteArticleColor: document.querySelector("#indefiniteArticleColor").value,
        definiteArticleColor: document.querySelector("#definiteArticleColor").value,
        dyslexify: document.querySelector("#dyslexify").checked
    });
    e.preventDefault();
}
/**
 * Restores voice options from local storage.
 */
function restoreOptions() {
    try {
        var api = chrome || browser;
        api.storage.local.get(null, res => {
            document.querySelector("#experimentalMode").checked = res.experimentalMode || false;
            document.querySelector("#indefiniteArticleColor").value = res.indefiniteArticleColor || "#575757";
            document.querySelector("#definiteArticleColor").value = res.definiteArticleColor || "#575757";
            document.querySelector("#dyslexify").checked = res.dyslexify || false;
            enableOptions();
        });
    } catch (err) {
        console.log(err);
    }
}

/**
 * Enable or disable the experimental mode options based on the master checkbox.
 */
function enableOptions() {
    var options = document.getElementsByClassName("experimentalDetail");
    for (var n = 0; n < options.length; ++n) {
        if (document.querySelector("#experimentalMode").checked) {
            options[n].style.display = "table-row";
        } else {
            options[n].style.display = "none";
        }
    }
}
/* Attach events */
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("change", saveOptions);
document.querySelector("#experimentalMode").addEventListener("change", enableOptions);