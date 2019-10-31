    var x = document.getElementById("languages");
    var voices = speechSynthesis.getVoices();
    for (var n = 0;n<voices.length;++n) {
        x.options[x.options.length] = new Option(voices[n].name, n);
    }