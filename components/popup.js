var placeNumber = "";
chrome.storage.sync.get(['work_place_number'], function (result) {
    placeNumber = result["work_place_number"];
    for (var i = 1; i <= parseInt(placeNumber); i++) {
        addWorkplaceBlock(i.toString());
    }
});

form_value_dict = {}
chrome.storage.sync.get(['form_value_dict'], function (result) {
    console.log('Value currently is ' + result["form_value_dict"]["address"]);
    let form_filler_info_saved = result["form_value_dict"];

    let form_filler_info = document.getElementById("formFillerInfo")
    var elements_under_form = form_filler_info.querySelectorAll('*[id]')
    elements_under_form.forEach(element => {
        if (element.tagName.toLowerCase() == "input" && !(element.getAttribute('type').toLowerCase() == "button")) {
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
    chrome.storage.sync.set({ form_value_dict }, function () {
        console.log('Form was saved.');
    });
})

var send_button = document.getElementById("send");
send_button.addEventListener("click", () => {
    chrome.runtime.sendMessage(form_value_dict)
})

var createInput = (id, label_text, type, placeNumber) => {
    var tag = document.createElement("label");
    tag.innerText = label_text;

    var input = document.createElement("input");
    input.id = id + placeNumber;
    input.type = type;
    tag.appendChild(input)
    return tag;
}

var addWorkplaceBlock = (placeNumber) => {
    var work_place_block_list = [
        { id: "work_place_", label_text: "Work place", type: "text" },
        { id: "work_position_", label_text: "Position", type: "text" },
        { id: "work_startdate_", label_text: "Start date", type: "date" },
        { id: "work_enddate_", label_text: "End date", type: "date" },
        { id: "position_description_", label_text: "Position description", type: "text" }
    ]
    var div = document.createElement("div");
    div.id = "work_experience_block_" + placeNumber;
    var label = document.createElement("label");
    label.innerText = "Work experience " + placeNumber;
    document.getElementById('work_experience_block').appendChild(div)
    div.appendChild(label)
    div.appendChild(document.createElement("br"))
    for (var i = 0; i < work_place_block_list.length; i++) {
        var work_place_block = work_place_block_list[i];
        div.appendChild(
            createInput(work_place_block.id, work_place_block.label_text, work_place_block.type, placeNumber));
        div.appendChild(document.createElement("br"))
    }
    div.appendChild(document.createElement("br"))
}

var removeWorkplaceBlock = (placeNumber) => {
    document.getElementById("work_experience_block_" + placeNumber).remove();
}

var add_workplace = document.getElementById("add_workplace");
add_workplace.addEventListener("click", () => {
    var place_number = isNaN(parseInt(placeNumber)) ? 0 : parseInt(placeNumber);
    var work_place_number = (place_number + 1).toString();
    console.log(work_place_number)
    addWorkplaceBlock(work_place_number);

    chrome.storage.sync.set({ work_place_number });
})
var remove_workplace = document.getElementById("remove_workplace");
remove_workplace.addEventListener("click", () => {
    var place_number = isNaN(parseInt(placeNumber)) ? 0 : parseInt(placeNumber);
    removeWorkplaceBlock(place_number.toString());

    var work_place_number = (place_number - 1 > 0) ? (place_number - 1).toString() : "1";
    chrome.storage.sync.set({ work_place_number });
})