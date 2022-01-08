
chrome.runtime.onMessage.addListener(async (request) => {
    console.log(request)
    var label_text_dict = await readLabelJson();
    console.log(label_text_dict)

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
        console.log("Value is ", value, "for key", key)
        if (value == "") { continue; }

        var chosenEl = null;
        for (let idx = 0; idx < labels.length; idx++) {
            if (labels[idx].innerText.toLowerCase().includes(getLabelName(key, label_text_dict))) {
                chosenEl = getNextInputSibling(labels[idx]);
                break;
            }
        }
        if (chosenEl != null) {
            changeElementValue(chosenEl, value)
        }
    }
    function changeElementValue(element, value) {
        console.log("element", element, "value", value)
        element.value = value;
        const event = new Event('change');
        element.dispatchEvent(event);
    }
    function getNextInputSibling(el) {
        for (let i = 0; i < 10; i++) {
            el = el?.nextElementSibling
            if (el?.tagName.toLowerCase() == "input") {
                console.log(el)
                return el;
            } else if (el?.getElementsByTagName("input").length > 0) {
                console.log(el?.getElementsByTagName("input")[0])
                return el?.getElementsByTagName("input")[0];
            }
        }
        return {}
    };

    function getLabelName(id, label_text_dict) {
        if (!label_text_dict.hasOwnProperty(id)) {
            return "Not found.";
        }
        return label_text_dict[id];
    }
}
function readLabelJson() {
    var url = chrome.runtime.getURL("/resources/label_text_fi.json").toString()
    console.log(url)
    var fetchResponse = "";
    return fetch(url)
        .then((response) => response.json())
        .then(r => r["labelText"]);
}
