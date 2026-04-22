import io
from contextlib import redirect_stderr

from django.urls import reverse
from drf_spectacular.drainage import GENERATOR_STATS
from rest_framework.test import APITestCase


class SchemaDocumentationTests(APITestCase):
    def test_schema_includes_websocket_paths_and_omits_is_mine(self):
        GENERATOR_STATS.reset()
        stderr = io.StringIO()

        with redirect_stderr(stderr):
            response = self.client.get(reverse("schema"), {"format": "json"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(stderr.getvalue(), "")
        self.assertFalse(GENERATOR_STATS)
        schema = response.content.decode("utf-8")
        self.assertIn("/ws/dms/inbox", schema)
        self.assertIn("/ws/dms/{userId}", schema)
        self.assertNotIn("isMine", schema)
