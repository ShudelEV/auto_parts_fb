# Generated by Django 2.0.6 on 2018-07-15 14:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('PartsFB', '0003_remove_carmodel_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='car',
            name='body_style',
            field=models.IntegerField(blank=True, choices=[(1, 'sedan'), (2, 'coupe'), (3, 'wagon'), (4, 'Minivan'), (5, 'SUV/Crossover'), (6, 'convertible'), (7, 'hatchback'), (8, 'van')], max_length=1, null=True),
        ),
        migrations.AddField(
            model_name='car',
            name='engine_type',
            field=models.IntegerField(blank=True, choices=[(1, 'benzine'), (2, 'diesel'), (3, 'gas-benzine'), (4, 'electric'), (5, 'hybrid')], max_length=1, null=True),
        ),
        migrations.AddField(
            model_name='car',
            name='engine_volume',
            field=models.IntegerField(max_length=4, null=True),
        ),
        migrations.AddField(
            model_name='car',
            name='gear',
            field=models.IntegerField(blank=True, choices=[(1, 'manual'), (2, 'automatic'), (3, 'semi-automatic'), (4, 'CVT')], max_length=1, null=True),
        ),
    ]