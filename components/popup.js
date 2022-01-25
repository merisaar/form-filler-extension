var storage_work_place_place_number = "";
chrome.storage.sync.get(['work_place_number'], function (result) {
    storage_work_place_place_number = result["work_place_number"];
    for (var i = 1; i <= parseInt(storage_work_place_place_number); i++) {
        addWorkplaceBlock(i.toString());
    }
});

var storage_education_place_number = "";
chrome.storage.sync.get(['education_place_number'], function (result) {
    storage_education_place_number = result["education_place_number"];
    for (var i = 1; i <= parseInt(storage_education_place_number); i++) {
        addEducationBlock(i.toString());
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

var createInput = (id, label_text, type, place_number) => {
    var tag = document.createElement("label");
    tag.innerText = label_text;

    var input = document.createElement("input");
    input.id = id + place_number;
    input.type = type;
    tag.appendChild(input)
    return tag;
}
var addInputBlock = (input_obj_list, block_id, block_text, place_number) => {
    var div = document.createElement("div");
    div.id = block_id + place_number;
    var label = document.createElement("label");
    label.innerText = block_text + " " + place_number;
    document.getElementById(block_id).appendChild(div)
    div.appendChild(label)
    div.appendChild(document.createElement("br"))
    for (var i = 0; i < input_obj_list.length; i++) {
        var input_obj = input_obj_list[i];
        div.appendChild(
            createInput(input_obj.id, input_obj.label_text, input_obj.type, place_number));
        div.appendChild(document.createElement("br"))
    }
    div.appendChild(document.createElement("br"))
}
var addEducationBlock = (place_number) => {
    var education_block_list = [
        { id: "education_place_", label_text: "Education place", type: "text" },
        { id: "education_degree_", label_text: "Degree", type: "text" },
        { id: "education_", label_text: "Education", type: "text" },
        { id: "education_enddate_", label_text: "End date", type: "date" },
    ]

    addInputBlock(education_block_list, "education_block_", "Education", place_number)
}

var addWorkplaceBlock = (place_number) => {
    var work_place_block_list = [
        { id: "work_place_", label_text: "Work place", type: "text" },
        { id: "work_position_", label_text: "Position", type: "text" },
        { id: "work_startdate_", label_text: "Start date", type: "date" },
        { id: "work_enddate_", label_text: "End date", type: "date" },
        { id: "position_description_", label_text: "Position description", type: "text" }
    ]
    addInputBlock(work_place_block_list, "work_experience_block_", "Work experience", place_number)
}

var removeBlock = (id, place_number) => {
    document.getElementById(id + place_number).remove();
}

var getNumber = (place_number) => {
    return isNaN(parseInt(place_number)) ? 0 : parseInt(place_number);
}
var parsePlaceNumber = (place_number) => {
    return (place_number - 1 > 0) ? (place_number - 1).toString() : "1"
}

var add_workplace = document.getElementById("add_workplace");
add_workplace.addEventListener("click", () => {
    var place_number = getNumber(storage_work_place_place_number);
    var work_place_number = (place_number + 1).toString();
    addWorkplaceBlock(work_place_number);

    chrome.storage.sync.set({ work_place_number });
    storage_work_place_place_number = work_place_number;
})
var remove_workplace = document.getElementById("remove_workplace");
remove_workplace.addEventListener("click", () => {
    var place_number = getNumber(storage_work_place_place_number);
    removeBlock("work_experience_block_", place_number.toString());

    var work_place_number = parsePlaceNumber(place_number);
    chrome.storage.sync.set({ work_place_number });
    storage_work_place_place_number = work_place_number;
})

var add_education = document.getElementById("add_education");
add_education.addEventListener("click", () => {
    var place_number = getNumber(storage_education_place_number);
    var education_place_number = (place_number + 1).toString();
    addEducationBlock(education_place_number);

    chrome.storage.sync.set({ education_place_number });
    storage_education_place_number = education_place_number;
})
var remove_education = document.getElementById("remove_education");
remove_education.addEventListener("click", () => {
    var place_number = getNumber(storage_education_place_number);
    removeBlock("education_block_", place_number.toString());

    var education_place_number = parsePlaceNumber(place_number);
    chrome.storage.sync.set({ education_place_number });
    storage_education_place_number = education_place_number;
})
