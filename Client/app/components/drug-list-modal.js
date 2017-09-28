'use strict';

let drugList = [];

let entriesElem = document.getElementById('drugListEntries');
const DRUG_FIELD_CLASS_NAME = 'drugField';

let unsavedDrugListAdds = [];
let unsavedDrugListDeletes = [];

function addDrugListEntry() {
    let drugInput = document.createElement('input');
    drugInput.setAttribute('type', 'text');
    drugInput.setAttribute('class', DRUG_FIELD_CLASS_NAME);

    let deleteButton = document.createElement('button');
    deleteButton.setAttribute('type', 'button');
    deleteButton.setAttribute('class', 'btn btn-danger btn-sm btn-circle');
    deleteButton.innerHTML = 'X';
    deleteButton.setAttribute('title', 'Delete');
    deleteButton.addEventListener('click', deleteDrugListEntry);

    let entryDiv = document.createElement('div');
    entryDiv.appendChild(drugInput);
    entryDiv.appendChild(deleteButton);

    unsavedDrugListAdds.push(entryDiv)
    entriesElem.appendChild(entryDiv);
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
    let fields = entriesElem.getElementsByClassName(DRUG_FIELD_CLASS_NAME);
    Array.prototype.forEach.call(fields, function(field) {
        drugList.push(field.value);
    });

    // Commit the new adds/deletes
    unsavedDrugListDeletes.forEach(function(entry) {
        entry.remove();
    }, this);

    unsavedDrugListAdds = [];
    unsavedDrugListDeletes = [];
}

function restoreDrugList() {
    // Undo the new adds/deletes
    unsavedDrugListAdds.forEach(function(entry) {
        entry.remove();
    }, this);

    unsavedDrugListDeletes.forEach(function(entry) {
        entry.removeAttribute('hidden');
    }, this);

    unsavedDrugListAdds = [];
    unsavedDrugListDeletes = [];
}