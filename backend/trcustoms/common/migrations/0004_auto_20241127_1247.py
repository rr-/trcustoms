# Generated by Django 4.2.3 on 2024-11-27 12:47

from datetime import timedelta

from django.db import migrations
from django.db.models import DurationField, ExpressionWrapper, F


def forward_func(apps, schema_editor):
    model_names = [
        ("ratings", "Rating"),
        ("reviews", "Review"),
        ("walkthroughs", "Walkthrough"),
    ]

    for app_name, model_name in model_names:
        model = apps.get_model(app_name, model_name)

        model.objects.filter(
            last_user_content_updated__isnull=False,
            created__isnull=False,
            last_user_content_updated__lte=ExpressionWrapper(
                F("created") + timedelta(hours=24),
                output_field=DurationField(),
            ),
        ).update(last_user_content_updated=None)


class Migration(migrations.Migration):

    dependencies = [
        ("common", "0003_alter_ratingclass_target"),
        ("ratings", "0005_auto_20241116_1651"),
        ("reviews", "0007_auto_20241112_1216"),
        ("walkthroughs", "0008_auto_20241112_1209"),
    ]

    operations = [
        migrations.RunPython(forward_func, migrations.RunPython.noop),
    ]
