from django.db import models
from django.db.models import UniqueConstraint
from django.db.models.functions import Lower

from trcustoms.audit_logs import registry
from trcustoms.models.util import DatesInfo


@registry.register_model(name_getter=lambda instance: instance.name)
class LevelDifficulty(DatesInfo):
    name = models.CharField(max_length=100)
    position = models.IntegerField()

    class Meta:
        verbose_name_plural = "Level difficulties"
        ordering = ["position"]
        constraints = [
            UniqueConstraint(Lower("name"), name="difficulty_name_unique"),
        ]
        default_permissions = []

    def __str__(self) -> str:
        return f"{self.name} (id={self.pk})"
