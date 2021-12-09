# Generated by Django 3.2.6 on 2021-12-09 20:42

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("trcustoms", "0009_alter_levelfile_version"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="level",
            name="author_name",
        ),
        migrations.RemoveField(
            model_name="level",
            name="author_user",
        ),
        migrations.CreateModel(
            name="LevelAuthor",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    models.DateTimeField(auto_now_add=True, null=True),
                ),
                (
                    "last_updated",
                    models.DateTimeField(
                        auto_now=True, db_index=True, null=True
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="authors",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.AddField(
            model_name="level",
            name="authors",
            field=models.ManyToManyField(
                related_name="levels", to="trcustoms.LevelAuthor"
            ),
        ),
    ]
