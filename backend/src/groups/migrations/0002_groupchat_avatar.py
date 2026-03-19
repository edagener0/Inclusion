import authentication.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("groups", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="groupchat",
            name="avatar",
            field=models.ImageField(
                default="avatars/default.webp",
                upload_to="avatars",
                validators=[authentication.validators.validate_avatar],
            ),
        ),
    ]
