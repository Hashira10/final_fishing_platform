# Generated by Django 5.1.3 on 2025-02-28 05:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0012_message_recipients'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='recipients',
        ),
    ]
