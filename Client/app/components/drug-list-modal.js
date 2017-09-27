'use strict';

let drugList = [];

let entriesElement = document.getElementById('drugListEntries');
const DRUG_FIELD_CLASS_NAME = 'drugField';

let unsavedDrugListAdds = [];
let unsavedDrugListDeletes = [];

function addDrugListEntry() {
    let drugInput = document.createElement('input');
    drugInput.setAttribute('type', 'text');
    drugInput.setAttribute('class', DRUG_FIELD_CLASS_NAME);

    let deleteButton = document.createElement('button');
    deleteButton.setAttribute('type', 'button');
    deleteButton.setAttribute('class', 'btn btn-danger btn-sm');
    deleteButton.innerHTML = 'X';
    deleteButton.setAttribute('title', 'Delete drug');
    deleteButton.addEventListener('click', deleteDrugListEntry);

    let entryDiv = document.createElement('div');
    entryDiv.appendChild(drugInput);
    entryDiv.appendChild(deleteButton);

    unsavedDrugListAdds.push(entryDiv)
    entriesElement.appendChild(entryDiv);
}

function deleteDrugListEntry(event) {
    // Stage for deletion, but don't commit it until the user saves
    let entry = event.target.parentNode;
    entry.setAttribute('hidden', true);
    unsavedDrugListDeletes.push(entry);
}

function saveDrugList() {
    // Repopulate drug list. Can be optimized but little is gained currently.
    drugList = [];
    let fields = entriesElement.getElementsByClassName(DRUG_FIELD_CLASS_NAME);
    Array.prototype.forEach.call(fields, function(field) {
        drugList.push(field.innerHTML);
    });

    // Commit the new adds/deletes
    unsavedDrugListDeletes.forEach(function(entry) {
        entry.remove();
    });

    unsavedDrugListAdds = [];
    unsavedDrugListDeletes = [];
}

function restoreDrugList() {
    // Undo the new adds/deletes
    unsavedDrugListAdds.forEach(function(entry) {
        entry.remove();
    });

    unsavedDrugListDeletes.forEach(function(entry) {
        entry.removeAttribute('hidden');
    });

    unsavedDrugListAdds = [];
    unsavedDrugListDeletes = [];
}