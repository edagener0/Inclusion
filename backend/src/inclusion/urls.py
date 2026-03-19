from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.conf import settings
from django.conf.urls.static import static

from common.websocket_docs import (
    DMConversationWebSocketDocView,
    DMInboxWebSocketDocView,
    GroupConversationWebSocketDocView,
    GroupInboxWebSocketDocView,
)

urlpatterns = [
    path("admin", admin.site.urls),
    path("auth", include("authentication.urls")),
    path("users", include("users.urls")),
    path("profiles", include("profiles.urls")),
    path("incs", include("incs.urls")),
    path("posts", include("posts.urls")),
    path("notes", include("notes.urls")),
    path("stories", include("stories.urls")),
    path("comments", include("comments.urls")),
    path("friends", include("friends.urls")),
    path("groups", include("groups.urls")),
    path("ws/dms/inbox", DMInboxWebSocketDocView.as_view(), name="dm-websocket-inbox-doc"),
    path("ws/dms/<int:user_id>", DMConversationWebSocketDocView.as_view(), name="dm-websocket-conversation-doc"),
    path("ws/groups/inbox", GroupInboxWebSocketDocView.as_view(), name="group-websocket-inbox-doc"),
    path("ws/groups/<int:group_id>", GroupConversationWebSocketDocView.as_view(), name="group-websocket-conversation-doc"),
    path("api/schema", SpectacularAPIView.as_view(), name="schema"),
    path(
        "",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("dms", include("dms.urls")),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL, 
        document_root=settings.MEDIA_ROOT
    )
