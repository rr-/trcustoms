# Generated by Django 4.0 on 2022-01-18 23:09

import django.db.models.expressions
import django.db.models.functions.text
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("trcustoms", "0044_auto_20220118_1124"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="leveldownload",
            name="level",
        ),
        migrations.AddConstraint(
            model_name="leveldifficulty",
            constraint=models.UniqueConstraint(
                django.db.models.functions.text.Lower("name"),
                name="difficulty_name_unique",
            ),
        ),
        migrations.AddConstraint(
            model_name="levelduration",
            constraint=models.UniqueConstraint(
                django.db.models.functions.text.Lower("name"),
                name="duration_name_unique",
            ),
        ),
        migrations.AddConstraint(
            model_name="levelengine",
            constraint=models.UniqueConstraint(
                django.db.models.functions.text.Lower("name"),
                name="engine_name_unique",
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
            model_name="levelgenre",
            constraint=models.UniqueConstraint(
                django.db.models.functions.text.Lower("name"),
                name="genre_name_unique",
            ),
        ),
        migrations.AddConstraint(
            model_name="levellegacyreview",
            constraint=models.UniqueConstraint(
                django.db.models.expressions.F("level"),
                django.db.models.expressions.F("author"),
                name="review_level_author_unique",
            ),
        ),
        migrations.AddConstraint(
            model_name="leveltag",
            constraint=models.UniqueConstraint(
                django.db.models.functions.text.Lower("name"),
                name="tag_name_unique",
            ),
        ),
        migrations.AddConstraint(
            model_name="user",
            constraint=models.UniqueConstraint(
                django.db.models.functions.text.Lower("username"),
                name="user_username_unique",
            ),
        ),
        migrations.DeleteModel(
            name="LevelDownload",
        ),
    ]
