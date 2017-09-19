from django.contrib import admin

from .models import Drug, DrugInteraction


class DrugInteractionInline(admin.StackedInline):
    model = DrugInteraction
    fk_name = 'from_drug'


class DrugAdmin(admin.ModelAdmin):
    inlines = [DrugInteractionInline]


admin.site.register(Drug, DrugAdmin)
