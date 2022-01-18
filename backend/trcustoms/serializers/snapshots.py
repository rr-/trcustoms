from rest_framework import serializers

from trcustoms.models import Snapshot
from trcustoms.serializers.users import UserNestedSerializer


class SnapshotListingSerializer(serializers.ModelSerializer):
    object_type = serializers.SerializerMethodField(read_only=True)
    change_author = UserNestedSerializer(read_only=True)
    reviewer = UserNestedSerializer(read_only=True)

    class Meta:
        model = Snapshot
        fields = [
            "id",
            "created",
            "object_id",
            "object_name",
            "object_type",
            "object_desc",
            "change_type",
            "change_author",
            "is_reviewed",
            "reviewer",
            "diff",
        ]

    def get_object_type(self, instance: Snapshot) -> str:
        return instance.object_type.model
