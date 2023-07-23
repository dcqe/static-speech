let cocktail_matrix;
let latest_order_result = "";
const engageString = "engage";
let orderFinalized = false;

// Create a SpeechRecognition object
const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition ||
    window.oSpeechRecognition)();

// Set parameters for the recognition
recognition.lang = "en-US";
recognition.continuous = true;
recognition.interimResults = true;
//recognition.maxAlternatives = 5;

/*const grammar =
    "#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;";
const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
//recognition.continuous = false;
*/


recognition.onresult = event => {
    if (!orderFinalized) {
        let interimTranscript = "";
        let finalTranscript = "";
        let entireTranscript;

        for (let i = 0; i < event.results.length; ++i) {
            const result = event.results[i];
            const text = result[0].transcript;

            if (result.isFinal) {
                finalTranscript += text;
            } else {
                interimTranscript += text;
            }
        }
        entireTranscript = finalTranscript + interimTranscript;
        console.log(entireTranscript);

        let orderResultPair = onTextChange(entireTranscript);
        let orderIndex = orderResultPair[0];
        let orderResult = orderResultPair[1][0];
        console.log(orderResult);

        //const logElem = document.getElementById("log");
        //logElem.innerHTML = orderResult;
        if (orderIndex !== -1) {
            latest_order_result = orderResult;
            console.log(latest_order_result);
            orderResultDetected(orderResult);
            checkForConfirmation(entireTranscript, orderIndex);
        }
    }
    return 0;
};

recognition.onend = () => {
    // Restart the recognition when it ends
    // recognition.start();
};

recognition.start();

recognition.onstart = () => {
    setGlobalCocktailMatrix().then();
};


async function setGlobalCocktailMatrix() {
    try {
        cocktail_matrix = await get_all_cocktails_strings();
    } catch (error) {
        console.error(error);
    }
}

function onTextChange(entireText) {
    //returns cocktail name and last index of detection
    const normalizedText = normalizeText(entireText);
    let allOccurrences = findIndexOfOccurrence(cocktail_matrix, normalizedText);
    if (allOccurrences.length === 0) {
        return [-1, [""]];
    } else {
        return findPairWithHighestNumber(allOccurrences);
    }
}

function orderResultDetected(orderResult) {
    const order_result_element = document.getElementById("order-result-text");
    order_result_element.innerHTML = `<div id="order-result-text" style="color: black">${orderResult}</div>`;

    //ask for confirmation
    const confirmationElement = document.getElementById("confirm-order");
    confirmationElement.innerHTML = `<div id="confirm-order" style="font-size: 16px">Order detected! To receive your drink please confirm your order by saying: </div>`;
    const confirmButton = document.getElementById("order-now-button");
    confirmButton.style.display = 'inline';
    const engageElement = document.getElementById("engage-container");
    engageElement.innerHTML = `<div id="engage-container" style="font-size: 22px; font-weight: bold;">${engageString}</div>`;
}

function checkForConfirmation(entireTranscript, orderIndex) {
    let normalizedTranscript = normalizeText(entireTranscript);
    //check if engage was mentioned after latest cocktail
    if (normalizedTranscript.lastIndexOf(normalizeText(engageString)) > orderIndex) {
        finalizeOrder();
    }
}

function finalizeOrder() {
    console.assert(latest_order_result !== "")
    orderFinalized = true;

    //remove asking for confirmation html
    const confirmationElement = document.getElementById("confirm-order");
    confirmationElement.innerHTML = `<div id="confirm-order" style="font-size: 16px"></div>`;
    const engageElement = document.getElementById("engage-container");
    engageElement.innerHTML = `<div id="engage-container" style="font-size: 22px; font-weight: bold;"></div>`;
    const confirmButton = document.getElementById("order-now-button");
    confirmButton.style.display = 'none';

    //notify process engine by calling engage.php
    console.log("sending: " + latest_order_result)
    /*$.ajax({
        type: "GET",
        url: "engage.php",
        data: {cocktailname: latest_order_result},
        success: function (response) {
            // here is the code that will run on client side after running clear.php on server
            console.log(response);
            // function below reloads current page
            location.reload();
        }
    });*/

    //reload and the notify of success
    alert("Thank you for your order. Your " + latest_order_result + " should be ready soon.\n" + "Page will now be reloaded.");
    window.location.reload();

    //display order success
    //const successElement = document.getElementById("success-container");
    //successElement.innerHTML = `<div id="success-container" style="font-size: 14px">You successfully ordered your drink. It should be ready shortly.</div>`;
}

function onOrderConfirmPress() {
    finalizeOrder();
}
