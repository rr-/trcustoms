from django.conf import settings
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from trcustoms.models import (
    LevelDifficulty,
    LevelDuration,
    LevelEngine,
    LevelGenre,
    LevelTag,
)
from trcustoms.serializers import (
    LevelDifficultyListingSerializer,
    LevelDurationListingSerializer,
    LevelEngineListingSerializer,
    LevelGenreListingSerializer,
    LevelTagListingSerializer,
)


class ConfigViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request) -> Response:
        level_tags = LevelTag.objects.with_counts()
        level_genres = LevelGenre.objects.with_counts()
        level_engines = LevelEngine.objects.with_counts()
        level_difficulties = LevelDifficulty.objects.all()
        level_durations = LevelDuration.objects.all()
        return Response(
            {
                "tags": LevelTagListingSerializer(level_tags, many=True).data,
                "genres": LevelGenreListingSerializer(
                    level_genres, many=True
                ).data,
                "engines": LevelEngineListingSerializer(
                    level_engines, many=True
                ).data,
                "difficulties": LevelDifficultyListingSerializer(
                    level_difficulties, many=True
                ).data,
                "durations": LevelDurationListingSerializer(
                    level_durations, many=True
                ).data,
                "limits": {
                    "min_genres": settings.MIN_GENRES,
                    "max_genres": settings.MAX_GENRES,
                    "min_tags": settings.MIN_TAGS,
                    "max_tags": settings.MAX_TAGS,
                    "min_screenshots": settings.MIN_SCREENSHOTS,
                    "max_screenshots": settings.MAX_SCREENSHOTS,
                    "min_authors": settings.MIN_AUTHORS,
                    "max_authors": settings.MAX_AUTHORS,
                },
            },
            status.HTTP_200_OK,
        )
