from django.urls import reverse
from rest_framework.test import APITestCase


class SchemaDocumentationTests(APITestCase):
    def test_schema_includes_websocket_paths_and_omits_is_mine(self):
        response = self.client.get(reverse("schema"), {"format": "json"})

        self.assertEqual(response.status_code, 200)
        schema = response.content.decode("utf-8")
        self.assertIn("/ws/dms/inbox", schema)
        self.assertIn("/ws/dms/{userId}", schema)
        self.assertNotIn("/ws/groups/inbox", schema)
        self.assertNotIn("/ws/groups/{groupId}", schema)
        self.assertNotIn("isMine", schema)
