/*
 */

var li = 0;
var recognition;
var accounts = [
    ["expenses"],
    ["income"],
    ["cash"],
    ["holiday"],
    ["wages"],
    ["car", "ka"],
    ["travel"],
    ["utilities"]
];
var CODE_WORDS = ["code", "cody", "todd", "cod", "card"];
var BACK_WORDS = ["back", "backpack"];
var NEXT_WORDS = ["next", "knicks", "neck", "nick"];

//      chrome.tts.speak('Hello, Bank Link');

function init() {
    recognition = new webkitSpeechRecognition();
    setLine(0);
    recognition.continuous = true;
    recognition.interimResults = true;  
    recognition.start();
    recognition.onresult = iHeardSomething;
}


function iHeardSomething(event) {
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        var state = false;
        if (event.results[i].isFinal) {
            state = true;
        }
        var final = (state == true)? "Final": "Interim";
        console.log("Sentence (" + event.results[i][0].confidence + "): " + event.results[i][0].transcript + " >> " + final);
        processWord(event.results[i][0].transcript, state);

    }
}

function prevLine() {
    unSetLine(li);
    li--;
    setLine(li);
}

function nextLine() {
    unSetLine(li);
    li++;
    setLine(li);
}

function setLine(lineNumber) {
    $($(".line")[lineNumber]).addClass("highlight");
}

function unSetLine(lineNumber) {
    $($(".line")[lineNumber]).removeClass("highlight");
}

var found = false;

var nextsFound = 0;
var backsFound = 0;

var inCoding = false;
var finishedCoding = false;

function processWord(sentence, final) {
    var nextsInSentence = 0;
    var backsInSentence = 0;

    var words = sentence.split(" ");
    var word;

    for (word in words) {
        word = words[word].trim().toLowerCase();
        console.log("WORD: >"  + word + "<");

        if (inCoding && !finishedCoding) {
            console.log("this is the account code: " + word);
            if (matchCode(word)) {
                nextLine();
                finishedCoding = true;
            }
            inCoding = false;
        } else if (NEXT_WORDS.indexOf(word) > -1) {
            nextsInSentence++;
        } else if (BACK_WORDS.indexOf(word) > -1) {
            backsInSentence++
        } else if (CODE_WORDS.indexOf(word) > -1) {
            console.log("Next is account code");
            inCoding = true;
        } 
    }

    if (nextsInSentence > nextsFound) {
        for (var i = 0; i < nextsInSentence - nextsFound ; i++) {
            nextLine();
        }
        nextsFound = nextsInSentence;
    }

    if (backsInSentence > backsFound) {
        for (var i = 0; i < backsInSentence - backsFound ; i++) {
            prevLine();
        }
        backsFound = backsInSentence;
    }

    if (final == true) {
        backsInSentence = 0;
        backsFound = 0;
        nextsInSentence = 0;
        nextsFound = 0;
        finishedCoding = false;
    }
}

function matchCode(code) {
    for (account in accounts) {
        if (accounts[account].indexOf(code) > -1) {
            $(".code", $(".txns .line")[li]).text(accounts[account][0]);
            return true;
        } else {
            $(".code", $(".txns .line")[li]).text("?");
        }
        console.log("code? " + accounts.indexOf(code));
    }
}
