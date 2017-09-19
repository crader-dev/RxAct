"""Drug Interaction Models
"""

from django.db import models


class Drug(models.Model):
    """
    Represents a generic (unique) drug identified by a RxNorm RxCUI. A drug can have a Many-to-Many
    relationship with other Drugs that it can interact with when ingested together; this is related
    through the DrugInteraction model.

    More RxNorm info: https://www.nlm.nih.gov/research/umls/rxnorm/overview.html
    """
    name = models.CharField(max_length=100)
    rxcui = models.IntegerField(primary_key=True)
    interactions = models.ManyToManyField('self', through='DrugInteraction', symmetrical=False,
                                          related_name='interacts_with+')
    drug_details_url = models.URLField(default='', blank=True)

    def add_interaction(self, drug, description, symmetric=True):
        """
        Add a new interaction between this drug and the given drug.
        :param drug: The drug that interacts with this one.
        :param description: The interaction description.
        :param symmetric: Whether or not the relationship is symmetric.
        """
        DrugInteraction.objects.create(from_drug=self, to_drug=drug, description=description)

        if symmetric:
            # Pass symmetric=False since we just made the other half of the
            # relationship.
            drug.add_interaction(self, description, False)

    def delete_interaction(self, drug, symmetric=True):
        """
        Delete an existing interaction between this drug and the given drug.
        :param drug: The drug that interacts with this one.
        :param symmetric: Whether or not the relationship is symmetric.
        """
        DrugInteraction.objects.filter(from_drug=self, to_drug=drug).delete()

        if symmetric:
            # Pass symmetric=False since we just deleted the other half of the
            # relationship.
            drug.add_interaction(self, False)

    def __str__(self):
        return self.name

# TODO: This model (along with the required functionality to go alongside it) could be used to limit
# TODO: the amount of repeated drugs (because Advil = Ibuprofen), but that is currently beyond the
# TODO: scope of this simple project.
# class DrugAlias(models.Model):
#     """
#     Represents an alternate name for a drug (identified by a RxNorm RxCUI).
#
#     In other words, a single drug can have multiple names
#     (e.g. Ibuprofen = Advil = Motrin IB = etc.).
#     """
#     name = models.CharField(max_length=120)
#     drug = models.ForeignKey(Drug, related_name='alias', on_delete=models.CASCADE)
#
#     def __str__(self):
#         return self.name


class DrugInteraction(models.Model):
    """
    Holds detailed information about the interaction between two drugs. Used as the intermediary
    relationship between the Many-to-Many relationship between Drugs.
    """
    last_update_timestamp = models.DateTimeField(auto_now=True)
    from_drug = models.ForeignKey(Drug, null=True, related_name='from_drugs',
                                  on_delete=models.CASCADE)
    to_drug = models.ForeignKey(Drug, null=True, related_name='to_drugs', on_delete=models.CASCADE)
    description = models.TextField(blank=True)

    def __str__(self):
        return str(self.from_drug) + ' interacts with ' + str(self.to_drug)
