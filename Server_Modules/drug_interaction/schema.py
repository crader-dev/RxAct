"""Drug Interaction GraphQL Schema
"""

from graphene import AbstractType, List, Field, Int, String

from graphene_django import DjangoObjectType

from .models import Drug


class DrugType(DjangoObjectType):
    class Meta:
        model = Drug


class Query(AbstractType):
    drug = Field(DrugType, id=Int(), name=String())
    all_drugs = List(DrugType)

    def resolve_all_drugs(self, info, **kwargs):
        return Drug.objects.all()

    def resolve_drug(self, info, **kwargs):
        name = kwargs.get('name')
        rxnorm_id = kwargs.get('rxnorm_id')

        if name is not None:
            return Drug.objects.get(name=name)
        elif rxnorm_id is not None:
            return Drug.objects.get(rxnorm_id=rxnorm_id)

        return None

