# Generated by Django 3.2.6 on 2021-12-09 22:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("trcustoms", "0010_auto_20211209_2042"),
    ]

    operations = [
        migrations.AlterField(
            model_name="levelfile",
            name="file",
            field=models.FileField(blank=True, null=True, upload_to="levels/"),
        ),
    ]
