# Generated by Django 4.2.3 on 2024-11-16 16:44

from django.db import migrations

MAPPING = [
    (0, 0, "engagement"),
    (1, 1, "engagement"),
    (6, 2, "engagement"),
    (8, 3, "engagement"),
    (3, 4, "uniqueness"),
    (2, 5, "quality"),
    (4, 6, "quality"),
    (5, 7, "quality"),
    (7, 8, "enjoyment"),
    (9, 9, "enjoyment"),
    (10, 10, "enjoyment"),
    (11, 11, "stability"),
    (12, 12, "stability"),
    (13, 13, "stability"),
    (14, 14, "stability"),
]


def forward_func(apps, schema_editor):
    RatingTemplateQuestion = apps.get_model(
        "ratings", "RatingTemplateQuestion"
    )
    for old_position, new_position, category in MAPPING:
        RatingTemplateQuestion.objects.filter(
            position=old_position, category__isnull=True
        ).update(position=new_position, category=category)


def reverse_func(apps, schema_editor):
    RatingTemplateQuestion = apps.get_model(
        "ratings", "RatingTemplateQuestion"
    )
    for old_position, new_position, _category in MAPPING:
        RatingTemplateQuestion.objects.filter(
            position=new_position, category__isnull=False
        ).update(position=old_position, category=None)


class Migration(migrations.Migration):

    dependencies = [
        ("ratings", "0004_ratingtemplatequestion_category"),
    ]

    operations = [
        migrations.RunPython(forward_func, reverse_func),
    ]
