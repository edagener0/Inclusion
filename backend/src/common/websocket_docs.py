from drf_spectacular.utils import OpenApiExample, OpenApiResponse, extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


websocket_upgrade_serializer = inline_serializer(
    name="WebSocketUpgradeInfo",
    fields={
        "detail": serializers.CharField(),
    },
)


@extend_schema(
    tags=["DMs"],
    summary="DM conversation WebSocket",
    description=(
        "WebSocket upgrade endpoint for a direct-message conversation.\n\n"
        "Auth: send the `access_token` cookie during the handshake.\n\n"
        "Server events:\n"
        "- `dm.message.created`\n"
        "- `dm.message.updated`\n"
        "- `dm.message.deleted`\n"
    ),
    responses={
        101: OpenApiResponse(description="Switching Protocols after a successful WebSocket upgrade."),
        426: websocket_upgrade_serializer,
    },
    examples=[
        OpenApiExample(
            "Created Event",
            value={
                "type": "dm.message.created",
                "message": {
                    "id": 1,
                    "content": "Hello",
                    "senderId": 10,
                    "receiverId": 20,
                    "createdAt": "2026-03-19T10:00:00Z",
                    "updatedAt": "2026-03-19T10:00:00Z",
                },
            },
            response_only=True,
        ),
    ],
)
class DMConversationWebSocketDocView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, user_id):
        return Response(
            {"detail": "Use a WebSocket client on this endpoint."},
            status=status.HTTP_426_UPGRADE_REQUIRED,
        )


@extend_schema(
    tags=["DMs"],
    summary="DM inbox WebSocket",
    description=(
        "WebSocket upgrade endpoint for realtime DM inbox updates.\n\n"
        "Auth: send the `access_token` cookie during the handshake.\n\n"
        "Server events:\n"
        "- `dm.inbox.updated`\n"
        "- `dm.inbox.removed`\n"
    ),
    responses={
        101: OpenApiResponse(description="Switching Protocols after a successful WebSocket upgrade."),
        426: websocket_upgrade_serializer,
    },
    examples=[
        OpenApiExample(
            "Inbox Update Event",
            value={
                "type": "dm.inbox.updated",
                "inboxItem": {
                    "id": 1,
                    "user": {
                        "id": 20,
                        "username": "bob",
                        "firstName": "Bob",
                        "lastName": "Builder",
                        "avatar": "http://localhost:8000/media/avatars/default.webp",
                    },
                    "lastMessage": "Hello",
                    "createdAt": "2026-03-19T10:00:00Z",
                },
            },
            response_only=True,
        ),
    ],
)
class DMInboxWebSocketDocView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response(
            {"detail": "Use a WebSocket client on this endpoint."},
            status=status.HTTP_426_UPGRADE_REQUIRED,
        )


@extend_schema(
    tags=["Groups"],
    summary="Group conversation WebSocket",
    description=(
        "WebSocket upgrade endpoint for realtime group-message events.\n\n"
        "Auth: send the `access_token` cookie during the handshake.\n\n"
        "Server events:\n"
        "- `group.message.created`\n"
        "- `group.message.updated`\n"
        "- `group.message.deleted`\n"
    ),
    responses={
        101: OpenApiResponse(description="Switching Protocols after a successful WebSocket upgrade."),
        426: websocket_upgrade_serializer,
    },
    examples=[
        OpenApiExample(
            "Group Message Event",
            value={
                "type": "group.message.created",
                "message": {
                    "id": 1,
                    "groupId": 99,
                    "content": "Hello group",
                    "senderId": 10,
                    "createdAt": "2026-03-19T10:00:00Z",
                    "updatedAt": "2026-03-19T10:00:00Z",
                },
            },
            response_only=True,
        ),
    ],
)
class GroupConversationWebSocketDocView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, group_id):
        return Response(
            {"detail": "Use a WebSocket client on this endpoint."},
            status=status.HTTP_426_UPGRADE_REQUIRED,
        )


@extend_schema(
    tags=["Groups"],
    summary="Group inbox WebSocket",
    description=(
        "WebSocket upgrade endpoint for realtime group-list updates.\n\n"
        "Auth: send the `access_token` cookie during the handshake.\n\n"
        "Server events:\n"
        "- `group.inbox.updated`\n"
        "- `group.inbox.removed`\n"
    ),
    responses={
        101: OpenApiResponse(description="Switching Protocols after a successful WebSocket upgrade."),
        426: websocket_upgrade_serializer,
    },
    examples=[
        OpenApiExample(
            "Group List Update Event",
            value={
                "type": "group.inbox.updated",
                "groupItem": {
                    "id": 99,
                    "name": "Study Group",
                    "lastMessage": "Hello group",
                },
            },
            response_only=True,
        ),
    ],
)
class GroupInboxWebSocketDocView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response(
            {"detail": "Use a WebSocket client on this endpoint."},
            status=status.HTTP_426_UPGRADE_REQUIRED,
        )
