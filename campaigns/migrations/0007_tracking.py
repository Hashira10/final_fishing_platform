# Generated by Django 5.1.3 on 2025-02-12 15:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0006_recipient_remove_sender_email_recipientgroup'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tracking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tracking_id', models.CharField(max_length=50, unique=True)),
                ('opened', models.BooleanField(default=False)),
                ('submitted', models.BooleanField(default=False)),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='campaigns.recipient')),
            ],
        ),
    ]
