# Generated by Django 5.1.3 on 2024-12-01 20:13

import django.db.models.deletion
import django.utils.timezone
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='OrderModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(default=django.utils.timezone.now)),
                ('paid', models.BooleanField(default=False)),
                ('subtotal', models.FloatField(default=0.0)),
                ('taxes', models.FloatField(default=0.0)),
                ('discounts', models.FloatField(default=0.0)),
            ],
        ),
        migrations.CreateModel(
            name='RoundModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rounds', to='orders.ordermodel')),
            ],
        ),
        migrations.CreateModel(
            name='RoundItemModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('quantity', models.PositiveIntegerField()),
                ('round', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='orders.roundmodel')),
            ],
        ),
    ]
