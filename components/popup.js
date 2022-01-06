
let form_filler_info = document.getElementById("formFillerInfo")
var elements_under_form = form_filler_info.querySelectorAll('*[id]')
let form_value_dict = {}
elements_under_form.forEach(element => {
    form_value_dict[element.id] = ""
    element.addEventListener("input", () => {
        console.log(element.value);
        form_value_dict[element.id] = element.value;
    })
});
var save_button = document.getElementById("save")
save_button.addEventListener("click", () => {
    console.log(form_value_dict)
    chrome.storage.sync.set({ form_value_dict });

})
var send_button = document.getElementById("send");
send_button.addEventListener("click", () => {
    console.log("syncing")
    chrome.runtime.sendMessage(form_value_dict)
})