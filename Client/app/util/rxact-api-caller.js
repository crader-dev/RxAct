'use strict';

const RXACT_GRAPHQL_URL = location.href + '/graphql/';

const RXACT_INTERACTION_QUERY_TEMPLATE = `query ($drugs: [String]!) { \
    drugInteractions(drugs: $drugs) {
        description
        fromDrug {
            name
        }
        toDrug {
            name
        }
    }
 }`;

function getDrugInteractions(drugs, callback) {
    let requestJson = JSON.stringify({
        query: RXACT_INTERACTION_QUERY_TEMPLATE,
        variables: {drugs: drugs}
    });
    makeRxActInteractionCall(requestJson, callback);
}

function makeRxActInteractionCall(requestJson, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', RXACT_GRAPHQL_URL, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Accept', 'application/json');
    xhttp.setRequestHeader('X-CSRFToken', getCSRFToken());
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let jsonResp = JSON.parse(xhttp.responseText)
            if (jsonResp.data != undefined && jsonResp.errors == undefined) {
                callback(jsonResp.data.drugInteractions);
            } else if (jsonResp.errors != undefined) {
                let fullError = [
                    'An error occurred while querying the RxAct interaction API:\n'
                ];
                Array.prototype.forEach.call(jsonResp.errors, function(error) {
                    fullError.push(error['message'] + '\n');
                });

                Logger.error(fullError.join(''));
            }
        }
    }
    xhttp.send(requestJson);
}

function getCSRFToken() {
    let tokenMatch = document.cookie.match(/csrftoken=(.*)/);
    let token = null;
    if (tokenMatch.length <= 1) {
        Logger.error('Could not find RxAct API CSRF token.');
    } else {
        // Get first group (the token without the 'csrftoken=' prefix)
        token = tokenMatch[1];
    }

    return token;
}
