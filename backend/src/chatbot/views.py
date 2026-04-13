from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .client import GEMINI_CLIENT
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .serializers import ChatBotSerializer, ChatBotResponseSerializer

class ChatBotView(APIView):
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        request=ChatBotSerializer,
        responses={
            200: ChatBotResponseSerializer,
            400: OpenApiResponse(description="Prompt is missing."),
            500: OpenApiResponse(description="Internal Server Error."),
        }
    )
    def post(self, request, *args, **kwargs):
        prompt = request.data.get("prompt", None)

        if not prompt:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            response = GEMINI_CLIENT.models.generate_content(
                model="gemini-3-flash-preview", 
                contents=[
                            {
                                "role": "system",
                                "parts": [{"text": "You are a text-only assistant. Never generate or describe images."}]
                            },
                            {
                                "role": "user",
                                "parts": [{"text": prompt}]
                            }
                        ]
            )
        except:
            return Response(
                status = status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

        return Response(
            {
                "response": response.text
            },
            status=status.HTTP_200_OK
        )