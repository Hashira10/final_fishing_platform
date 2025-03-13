# Generated by Django 5.1.3 on 2025-02-06 14:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0003_recipientgroup_recipient'),
    ]

    operations = [
        migrations.RenameField(
            model_name='recipient',
            old_name='name',
            new_name='first_name',
        ),
        migrations.AddField(
            model_name='recipient',
            name='last_name',
            field=models.CharField(default='Unknown', max_length=255),
        ),
        migrations.AddField(
            model_name='recipient',
            name='position',
            field=models.CharField(default='Unknown', max_length=255),
        ),
    ]
