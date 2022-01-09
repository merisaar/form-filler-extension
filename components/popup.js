
form_value_dict = {}
chrome.storage.sync.get(['form_value_dict'], function (result) {
    console.log('Value currently is ' + result["form_value_dict"]["address"]);
    let form_filler_info_saved = result["form_value_dict"];

    let form_filler_info = document.getElementById("formFillerInfo")
    var elements_under_form = form_filler_info.querySelectorAll('*[id]')
    elements_under_form.forEach(element => {
        if (element.tagName.toLowerCase() == "input") {
            form_value_dict[element.id] = form_filler_info_saved[element.id] ?? ""
            element.value = form_filler_info_saved[element.id] ?? ""
            element.addEventListener("input", () => {
                form_value_dict[element.id] = element.value;
            })
        }
    });
});

var save_button = document.getElementById("save")
save_button.addEventListener("click", () => {
    console.log(form_value_dict)
    chrome.storage.sync.set({ form_value_dict }, function () {
        console.log('Form was saved.');
    });

})
var send_button = document.getElementById("send");
send_button.addEventListener("click", () => {
    chrome.runtime.sendMessage(form_value_dict)
})