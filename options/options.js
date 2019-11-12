/**
 * This method saves the user's chosen properties of the voice to sync storage.
 * @param {*} e The event arguments
 */
function saveOptions(e) {
    var api = chrome || browser;
    api.storage.sync.set({
        experimentalMode: document.querySelector("#experimentalMode").checked,
        indefiniteArticleCheck: document.querySelector("#indefiniteArticleCheck").checked,
        indefiniteArticleColor: document.querySelector("#indefiniteArticleColor").value,
        definiteArticleCheck: document.querySelector("#definiteArticleCheck").checked,
        definiteArticleColor: document.querySelector("#definiteArticleColor").value,
        eclipseMode: document.querySelector("#eclipseMode").checked
    });
    e.preventDefault();
}
/**
 * Restores voice options from sync storage.
 */
function restoreOptions() {
    try {
        var api = chrome || browser;
        api.storage.sync.get(null, res => {
            document.querySelector("#experimentalMode").checked = res.experimentalMode || false;
            document.querySelector("#indefiniteArticleCheck").checked = res.indefiniteArticleCheck || false;
            document.querySelector("#indefiniteArticleColor").value = res.indefiniteArticleColor || "#575757";
            document.querySelector("#definiteArticleCheck").checked = res.definiteArticleCheck || false;
            document.querySelector("#definiteArticleColor").value = res.definiteArticleColor || "#575757";
            document.querySelector("#eclipseMode").checked = res.eclipseMode || false;
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