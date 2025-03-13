# Generated by Django 5.1.3 on 2025-02-06 14:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0004_rename_name_recipient_first_name_recipient_last_name_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='target',
            name='campaign',
        ),
        migrations.RemoveField(
            model_name='recipient',
            name='group',
        ),
        migrations.RemoveField(
            model_name='report',
            name='target',
        ),
        migrations.RenameField(
            model_name='sender',
            old_name='name',
            new_name='smtp_host',
        ),
        migrations.RemoveField(
            model_name='sender',
            name='smtp_server',
        ),
        migrations.RemoveField(
            model_name='sender',
            name='use_ssl',
        ),
        migrations.RemoveField(
            model_name='sender',
            name='use_tls',
        ),
        migrations.AlterField(
            model_name='sender',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name='sender',
            name='smtp_port',
            field=models.IntegerField(),
        ),
        migrations.DeleteModel(
            name='Campaign',
        ),
        migrations.DeleteModel(
            name='Recipient',
        ),
        migrations.DeleteModel(
            name='RecipientGroup',
        ),
        migrations.DeleteModel(
            name='Report',
        ),
        migrations.DeleteModel(
            name='Target',
        ),
    ]
