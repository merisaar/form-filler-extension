
chrome.runtime.onMessage.addListener(async (request) => {
    var label_text_dict = await readLabelJson();
    checkIfAllTranslationsFound(request, label_text_dict)
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setValueToInputElements,
        args: [request, label_text_dict]
    });
});
function setValueToInputElements(request, label_text_dict) {
    var labels = document.getElementsByTagName("label");

    var keys = Object.keys(request);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = request[key]
        if (value == "") { continue; }
        var chosenEl = getInputThatMatchesLabel(labels, key, label_text_dict)

        if (chosenEl != null) {
            changeElementValue(chosenEl, value)
        }
    }
    function getInputThatMatchesLabel(labels, key, label_text_dict) {
        var input = null;
        var number = getNumberFromText(key);
        var count = 1;
        for (let idx = 0; idx < labels.length; idx++) {
            if (elementContainsLabelText(labels[idx], key, label_text_dict)) {
                console.log("found key", key, "with value", value)
                input = getNextInputSibling(labels[idx]);
                if (number == count) {
                    console.log("key", key, "input", input)
                    break;
                }
                count++;
            }
        }
        return input;
    }
    function elementContainsLabelText(element, id, label_text_dict) {
        return getLabelNameList(id, label_text_dict).some(label => element.innerText.toLowerCase().includes(label))
    }
    function changeElementValue(element, value) {
        element.value = value;
        const event = new Event('change');
        element.dispatchEvent(event);
    }
    function getNextInputSibling(el) {
        for (let i = 0; i < 10; i++) {
            el = el?.nextElementSibling
            if (el?.tagName.toLowerCase() == "input" || el?.tagName.toLowerCase() == "textarea") {
                return el;
            } else if (el?.getElementsByTagName("input").length > 0) {
                return el?.getElementsByTagName("input")[0];
            } else if (el?.getElementsByTagName("textarea").length > 0) {
                return el?.getElementsByTagName("textarea")[0];
            }
        }
        return null
    };

    function getLabelNameList(id, label_text_dict) {
        var key = id.match(/(\D+)/)[0]
        if (!label_text_dict.hasOwnProperty(key)) {
            return ["Not found."];
        }
        return label_text_dict[key].split(",");
    }
    function getNumberFromText(text) {
        var data = text.match(/[(\d+)]/)
        if (data == null) {
            return 1;
        }
        return parseInt(data[0]);
    }
}
function checkIfAllTranslationsFound(request, translation_dict) {
    var keys = Object.keys(request);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (translation_dict.hasOwnProperty(key)) {
            continue;
        }
        var translation_keys = Object.keys(translation_dict);
        for (var j = 0; j < translation_keys.length; j++) {
            var translation_key = translation_keys[j];
            if (translation_key.includes(key)) {
                continue;
            }
        }
        console.warn(`Not all required keys were found in translations. Missing key: ${key}`)
    }
}
function readLabelJson() {
    var url = chrome.runtime.getURL("/resources/label_text_fi.json").toString()
    return fetch(url)
        .then((response) => response.json())
        .then(r => r["labelText"]);
}
