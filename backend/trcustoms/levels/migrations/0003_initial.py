# Generated by Django 4.0 on 2022-03-05 22:53

import django.db.models.deletion
import django.db.models.expressions
import django.db.models.functions.text
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("genres", "0001_initial"),
        ("tags", "0001_initial"),
        ("levels", "0002_initial"),
        ("engines", "0001_initial"),
        ("users", "0001_initial"),
        ("uploads", "0001_initial"),
        ("common", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="level",
            name="authors",
            field=models.ManyToManyField(
                related_name="authored_levels", to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddField(
            model_name="level",
            name="cover",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="uploads.uploadedfile",
            ),
        ),
        migrations.AddField(
            model_name="level",
            name="difficulty",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="levels.leveldifficulty",
            ),
        ),
        migrations.AddField(
            model_name="level",
            name="duration",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="levels.levelduration",
            ),
        ),
        migrations.AddField(
            model_name="level",
            name="engine",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                to="engines.engine",
            ),
        ),
        migrations.AddField(
            model_name="level",
            name="genres",
            field=models.ManyToManyField(to="genres.LevelGenre"),
        ),
        migrations.AddField(
            model_name="level",
            name="last_file",
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="levels.levelfile",
            ),
        ),
        migrations.AddField(
            model_name="level",
            name="rating_class",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="common.ratingclass",
            ),
        ),
        migrations.AddField(
            model_name="level",
            name="tags",
            field=models.ManyToManyField(to="tags.LevelTag"),
        ),
        migrations.AddField(
            model_name="level",
            name="uploader",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="uploaded_levels",
                to="users.user",
            ),
        ),
        migrations.AddField(
            model_name="featuredlevel",
            name="chosen_genre",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="+",
                to="genres.levelgenre",
            ),
        ),
        migrations.AddField(
            model_name="featuredlevel",
            name="level",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="+",
                to="levels.level",
            ),
        ),
        migrations.AddConstraint(
            model_name="levelfile",
            constraint=models.UniqueConstraint(
                django.db.models.expressions.F("level"),
                django.db.models.expressions.F("version"),
                name="level_file_version_unique",
            ),
        ),
        migrations.AddConstraint(
            model_name="levelexternallink",
            constraint=models.UniqueConstraint(
                django.db.models.expressions.F("level"),
                django.db.models.functions.text.Lower("url"),
                name="level_external_link_unique",
            ),
        ),
    ]
