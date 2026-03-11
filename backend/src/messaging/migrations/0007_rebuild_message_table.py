from django.db import migrations


class Migration(migrations.Migration):
    atomic = False

    dependencies = [
        ("messaging", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                PRAGMA foreign_keys = OFF;
                DROP TABLE IF EXISTS messaging_message;
                CREATE TABLE messaging_message (
                    id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
                    created_at datetime NOT NULL,
                    updated_at datetime NOT NULL,
                    content varchar(255) NOT NULL,
                    sender_id bigint NOT NULL
                        REFERENCES authentication_user (id)
                        DEFERRABLE INITIALLY DEFERRED
                );
                CREATE INDEX messaging_message_sender_id_72a54f_idx
                    ON messaging_message (sender_id);
                PRAGMA foreign_keys = ON;
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
