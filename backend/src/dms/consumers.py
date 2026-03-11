from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth import get_user_model

from .realtime import build_dm_conversation_group, build_dm_user_group

User = get_user_model()


class AuthenticatedDMConsumer(AsyncJsonWebsocketConsumer):
    async def _get_authenticated_user(self):
        user = self.scope.get("user")

        if not user or user.is_anonymous:
            await self.close(code=4401)
            return None

        return user


class DMConsumer(AuthenticatedDMConsumer):
    async def connect(self):
        user = await self._get_authenticated_user()
        if user is None:
            return

        try:
            other_user_id = int(self.scope["url_route"]["kwargs"]["user_id"])
        except (KeyError, TypeError, ValueError):
            await self.close(code=4400)
            return

        if other_user_id == user.id:
            await self.close(code=4400)
            return

        if not await self._user_exists(other_user_id):
            await self.close(code=4404)
            return

        self.group_name = build_dm_conversation_group(user.id, other_user_id)
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def dm_message(self, event):
        await self.send_json({
            "type": "dm.message",
            "message": event["message"],
        })

    @database_sync_to_async
    def _user_exists(self, user_id):
        return User.objects.filter(id=user_id).exists()


class DMInboxConsumer(AuthenticatedDMConsumer):
    async def connect(self):
        user = await self._get_authenticated_user()
        if user is None:
            return

        self.group_name = build_dm_user_group(user.id)
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def dm_inbox(self, event):
        await self.send_json({
            "type": "dm.inbox",
            "inboxItem": event["inbox_item"],
        })
