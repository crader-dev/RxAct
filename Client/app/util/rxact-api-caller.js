'use strict';

const RXACT_GRAPHQL_URL = location.href + '/graphql';

const RXACT_INTERACTION_QUERY_TEMPLATE = `query { \
    drugInteractions(drugs: $drugList) {
        description
        from_drug {
            name
        }
        to_drug {
            name
        }
    }
 }`;

function getDrugInteractions(drugList, callback) {
    makeRxActInteractionCall({
        query: RXACT_INTERACTION_QUERY_TEMPLATE,
        variables: {drugList: drugList}
    },
    callback);
}

function makeRxActInteractionCall(requestJson, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.responseType = 'json';
    xhttp.open("POST", RXACT_GRAPHQL_URL, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Accept', 'application/json');
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            callback(xhttp.responseText);
        }
    }
    xhttp.send(JSON.stringify(requestJson));
}
