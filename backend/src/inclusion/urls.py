from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.conf import settings
from django.conf.urls.static import static

from common.websocket_docs import (
    DMConversationWebSocketDocView,
    DMInboxWebSocketDocView,
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
    path("chatbot", include("chatbot.urls")),
    path("ws/dms/inbox", DMInboxWebSocketDocView.as_view(), name="dm-websocket-inbox-doc"),
    path("ws/dms/<int:user_id>", DMConversationWebSocketDocView.as_view(), name="dm-websocket-conversation-doc"),
    path("wordle", include("wordle.urls")),
    path("schema", SpectacularAPIView.as_view(), name="schema"),
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
