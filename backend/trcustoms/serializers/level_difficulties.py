from rest_framework import serializers

from trcustoms.models import LevelDifficulty


class LevelDifficultyNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelDifficulty
        fields = ["id", "name"]


class LevelDifficultyListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelDifficulty
        fields = ["id", "name"]
