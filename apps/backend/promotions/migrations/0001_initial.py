# Generated by Django 5.1.3 on 2024-12-01 20:13

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PromotionModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('item_name', models.CharField(max_length=100)),
                ('discount_percentage', models.FloatField()),
                ('start', models.DateTimeField()),
                ('end', models.DateTimeField()),
            ],
        ),
    ]
