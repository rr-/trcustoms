# Generated by Django 4.2.3 on 2025-01-04 17:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("levels", "0019_auto_20241118_2129"),
    ]

    operations = [
        migrations.AlterField(
            model_name="level",
            name="last_user_content_updated",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
