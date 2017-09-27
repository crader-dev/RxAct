'use strict';

document.getElementById('addDrugButton').addEventListener('click', addDrugListEntry);
document.getElementById('drugListSaveButton').addEventListener('click', saveDrugList);
document.getElementById('drugListCancelButton').addEventListener('click', restoreDrugList);

Router.listen();