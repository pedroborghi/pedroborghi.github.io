let recognition;
let isRecognizing = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
        isRecognizing = true;
    };

    recognition.onerror = function(event) {
        console.log('Recognition error: ', event.error);
    };

    recognition.onend = function() {
        isRecognizing = false;
    };

    recognition.onresult = function(event) {
        let interim_transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                document.getElementById('transcription').innerText += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        document.getElementById('transcription').innerText = interim_transcript;
    };
} else {
    alert("Your browser does not support speech recognition.");
}

document.getElementById('startButton').onclick = function() {
    if (isRecognizing) {
        recognition.stop();
        return;
    }
    recognition.start();
};

document.getElementById('stopButton').onclick = function() {
    recognition.stop();
};
