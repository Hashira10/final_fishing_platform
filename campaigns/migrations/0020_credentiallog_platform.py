# Generated by Django 5.1.3 on 2025-03-03 05:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0019_delete_template_clicklog_platform'),
    ]

    operations = [
        migrations.AddField(
            model_name='credentiallog',
            name='platform',
            field=models.CharField(default='unknown', max_length=50),
        ),
    ]
