'use strict';

const RXACT_GRAPHQL_URL = location.href.indexOf('/index') + '/graphql';


function getDrugInteractions(drugList, callback) {

}

function makeRxActInteractionCall(requestJson, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            callback(xhttp.responseText);
        }
    }
    xhttp.open("GET", RXACT_GRAPHQL_URL, true);
    xhttp.send(null);
}
