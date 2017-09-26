"""Drug Interaction GraphQL Schema
"""

import graphene
from graphene import AbstractType, List, Field, Int, String

from graphene_django import DjangoObjectType

from .models import Drug, DrugInteraction
from .lookup.interaction_collection import gather_interaction_list


class DrugType(DjangoObjectType):
    class Meta:
        model = Drug


class DrugInteractionType(DjangoObjectType):
    class Meta:
        model = DrugInteraction


class Query(AbstractType):
    drug = Field(DrugType, rxcui=Int(), name=String())
    all_drugs = List(DrugType)

    drug_interactions = List(DrugInteractionType, drugs=List(String))
    all_drug_interactions = List(DrugInteractionType)

    @graphene.resolve_only_args
    def resolve_all_drugs(self):
        return Drug.objects.all()

    def resolve_drug(self, args, context, info):
        name = args.get('name')
        rxcui = args.get('rxcui')

        if name is not None:
            return Drug.objects.get(name=name)
        elif rxcui is not None:
            return Drug.objects.get(rxcui=rxcui)

        return None

    @graphene.resolve_only_args
    def resolve_all_drug_interactions(self):
        return DrugInteraction.objects.all()

    def resolve_drug_interactions(self, args, context, info):
        drugs = [drug.lower() for drug in args.get('drugs')]
        return gather_interaction_list(drugs)
