"""Drug Interaction Models
"""

from django.db import models


class Drug(models.Model):
    name = models.CharField(max_length=80)
    rxnorm_id = models.IntegerField(unique=True)
    last_update_occurrence = models.DateTimeField()


class DrugInteraction(models.Model):

