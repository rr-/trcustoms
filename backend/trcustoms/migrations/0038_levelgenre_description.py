# Generated by Django 3.2.6 on 2022-01-04 20:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("trcustoms", "0037_level_banner"),
    ]

    operations = [
        migrations.AddField(
            model_name="levelgenre",
            name="description",
            field=models.TextField(blank=True, max_length=500, null=True),
        ),
    ]
