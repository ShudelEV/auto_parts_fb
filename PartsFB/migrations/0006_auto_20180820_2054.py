# Generated by Django 2.1 on 2018-08-20 17:54

import PartsFB.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('PartsFB', '0005_auto_20180717_2013'),
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(max_length=255, upload_to=PartsFB.models.fb_images_path)),
                ('description', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.AlterModelOptions(
            name='feedback',
            options={'ordering': ['-created']},
        ),
        migrations.RemoveField(
            model_name='feedback',
            name='images',
        ),
        migrations.AddField(
            model_name='carbrand',
            name='site_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='partbrand',
            name='site_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='partbrand',
            name='specialization',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
        migrations.AlterUniqueTogether(
            name='carmodel',
            unique_together={('name', 'brand')},
        ),
        migrations.AddField(
            model_name='image',
            name='feedback',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='PartsFB.FeedBack'),
        ),
    ]