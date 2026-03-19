from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .models import GroupParticipants
from .realtime import build_group_conversation_group, build_group_user_group


class AuthenticatedGroupConsumer(AsyncJsonWebsocketConsumer):
    async def _get_authenticated_user(self):
        user = self.scope.get("user")

        if not user or user.is_anonymous:
            await self.close(code=4401)
            return None

        return user


class GroupConsumer(AuthenticatedGroupConsumer):
    async def connect(self):
        user = await self._get_authenticated_user()
        if user is None:
            return

        try:
            group_id = int(self.scope["url_route"]["kwargs"]["group_id"])
        except (KeyError, TypeError, ValueError):
            await self.close(code=4400)
            return

        if not await self._is_group_member(group_id, user.id):
            await self.close(code=4403)
            return

        self.group_name = build_group_conversation_group(group_id)
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def group_message_created(self, event):
        await self.send_json({
            "type": "group.message.created",
            "message": event["message"],
        })

    async def group_message_updated(self, event):
        await self.send_json({
            "type": "group.message.updated",
            "message": event["message"],
        })

    async def group_message_deleted(self, event):
        await self.send_json({
            "type": "group.message.deleted",
            "message": event["message"],
        })

    @database_sync_to_async
    def _is_group_member(self, group_id, user_id):
        return GroupParticipants.objects.filter(group_id=group_id, user_id=user_id).exists()


class GroupInboxConsumer(AuthenticatedGroupConsumer):
    async def connect(self):
        user = await self._get_authenticated_user()
        if user is None:
            return

        self.group_name = build_group_user_group(user.id)
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def group_inbox_updated(self, event):
        await self.send_json({
            "type": "group.inbox.updated",
            "groupItem": event["group_item"],
        })

    async def group_inbox_removed(self, event):
        await self.send_json({
            "type": "group.inbox.removed",
            "groupItem": event["group_item"],
        })
