"""RxAct-Core GraphQL Schema
"""

from graphene import ObjectType, Schema

import Server_Modules.drug_interaction.schema as drug_interaction_schema


class Query(drug_interaction_schema.Query, ObjectType):
    # This class simply inherits functionality from its parent Queries
    pass


schema = Schema(query=Query)
