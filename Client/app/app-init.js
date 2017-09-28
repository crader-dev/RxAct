'use strict';

Logger.setLevel(Logger.DEBUG);

document.getElementById('addDrugButton').addEventListener('click', addDrugListEntry);
document.getElementById('drugListSaveButton').addEventListener('click', function() {
    saveDrugList();
    if (drugList.length > 0) {
        getDrugInteractions(drugList, (interactions) => {
            if (interactions.length != 0) {
                InteractionGraph.loadData(interactions);
            } else {
                // TODO: use a modal for this
                alert('We did not find any interactions between the drugs you provided.');
            }
        });
    }
});
document.getElementById('drugListCancelButton').addEventListener('click', restoreDrugList);

Router.listen();

InteractionGraph.init('visSvg');