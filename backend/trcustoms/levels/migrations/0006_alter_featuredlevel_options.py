# Generated by Django 4.0 on 2022-03-25 16:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("levels", "0005_alter_level_is_pending_approval"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="featuredlevel",
            options={"default_permissions": []},
        ),
    ]
