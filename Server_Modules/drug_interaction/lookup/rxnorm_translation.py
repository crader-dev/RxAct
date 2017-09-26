"""RxNorm Translation

Translation logic for RxNorm identifiers (e.g. RxCUI).
"""


import requests

from drug_interaction.models import Drug


RXNORM_API_URL = 'https://rxnav.nlm.nih.gov/REST'
RXNORM_RXCUI_RES = '/rxcui.json'
RXNORM_RXCUI_NAME_QUERY = '?name='


def name_to_rxcui(name):
    drug = Drug.objects.filter(name=name).first()
    if drug:
        # If the drug already exists in our database, then just return its RxCUI
        rxcui = drug.rxcui
    else:
        # Otherwise, look it up in with RxNorm API
        call_url = RXNORM_API_URL + RXNORM_RXCUI_RES + RXNORM_RXCUI_NAME_QUERY + name
        try:
            resp = requests.get(call_url)
        except Exception:
            raise Exception('Could not reach external RxNorm drug database. '
                            'Please try again later.')

        if resp.status_code == 200:
            resp_json = resp.json()
            rxcui = int(resp_json['idGroup']['rxnormId'][0])
            Drug.objects.create(name=name, rxcui=rxcui)
        else:
            # TODO: Better error handling
            rxcui = -1

    return rxcui
