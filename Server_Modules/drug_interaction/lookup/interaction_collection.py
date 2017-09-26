"""Interaction Collection

Gathering functionality for drug interactions. Checks (first) available models, and (second,
if necessary) a drug interaction API.
"""

import re
import requests

from .rxnorm_translation import name_to_rxcui

from drug_interaction.models import Drug, DrugInteraction


INTERACTION_API_URL = 'https://rxnav.nlm.nih.gov/REST/interaction'
INTERACTION_API_INTERACTION_RES = '/interaction.json'
INTERACTION_API_LIST_RES = '/list.json'
INTERACTION_API_RXCUI_QUERY = '?rxcui='
INTERACTION_API_RXCUIS_QUERY = '?rxcuis='
INTERACTION_API_RXCUIS_QUERY_DELIM = '+'

# TODO: Use existing interaction models
def gather_interaction_list(drug_list, list_of_names=True):
    """

    :param drug_list: List of drug names/RxCUIs to lookup interactions for.
    :param list_of_names: True if the list contains all names, False if it contains all RxCUIs.
    :return: List of all interactions between the given drugs.
    """
    if list_of_names:
        rxcui_set = set()
        for name in drug_list:
            # TODO: verify name is valid string
            rxcui_set.add(name_to_rxcui(name))
    else:
        rxcui_set = set(drug_list)

    # Contruct API call
    call_url = INTERACTION_API_URL + INTERACTION_API_LIST_RES + INTERACTION_API_RXCUIS_QUERY
    for rxcui in rxcui_set:
        call_url += '{0}{1}'.format(str(rxcui), INTERACTION_API_RXCUIS_QUERY_DELIM)

    try:
        resp = requests.get(call_url)
    except Exception:
        raise Exception('Could not reach external drug interaction database. '
                        'Please try again later.')

    interaction_list = []
    if resp.status_code == 200:
        resp_json = resp.json()
        if resp_json.get('fullInteractionTypeGroup'):
            interaction_list = process_interaction_json(resp_json)

    return interaction_list

# TODO: Can do alias switching/assignment here
def process_interaction_json(json):
    interaction_list = []
    for group in json.get('fullInteractionTypeGroup'):
        for fullType in group.get('fullInteractionType'):
            alias_map = process_alias_resolution_section(fullType['comment'], fullType['minConcept'])
            for pair in fullType.get('interactionPair'):
                concept = pair['interactionConcept']

                drug_1_name = concept[0]['minConceptItem']['name'].lower()
                drug_2_name = concept[1]['minConceptItem']['name'].lower()

                resolved_drug_1 = Drug.objects.filter(rxcui=alias_map[drug_1_name]).first()
                resolved_drug_2 = Drug.objects.filter(rxcui=alias_map[drug_2_name]).first()

                interaction = DrugInteraction.objects.filter(to_drug=resolved_drug_1).first()
                if not interaction:
                    interaction = resolved_drug_1.add_interaction(resolved_drug_2,
                                                                  pair.get('description'))
                interaction_list.append(interaction)

    return interaction_list


def process_alias_resolution_section(comment, minConceptList):
    original_rxcuis = re.findall(r'rxcui = ([^,]*)', comment)
    resolved_names = re.findall(r'resolved to ([^,| ]*)', comment)

    return {resolved_names[0].lower(): original_rxcuis[0],
            resolved_names[1].lower(): original_rxcuis[1]}
