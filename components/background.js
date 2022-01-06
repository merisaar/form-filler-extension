
chrome.runtime.onMessage.addListener(async (request) => {
    console.log(request)
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setValueToInputElements,
    });
});
function setValueToInputElements() {
    var elements = document.getElementsByTagName("label"),

        chosenEl = {}
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].innerText.toLowerCase().includes("työnantaja")) {
            chosenEl = getNextInputSibling(elements[i]); break;
        }
    }
    changeElementValue(chosenEl, "test")
    function changeElementValue(element, value) {
        element.value = value;
        const event = new Event('change');
        element.dispatchEvent(event);
    }
    function getNextInputSibling(el) {
        elementAcc = { ...el }
        for (let i = 0; i < 10; i++) {
            el = el.nextElementSibling
            if (el.tagName.toLowerCase() == "input") {
                return el;
            }
        }
        return null;
    }
}

