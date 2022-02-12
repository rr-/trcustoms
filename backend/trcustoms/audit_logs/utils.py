import contextlib

from django.contrib.contenttypes.models import ContentType
from django.db import models
from rest_framework.request import Request

from trcustoms.audit_logs.registry import get_registered_model_info
from trcustoms.models.audit_log import AuditLog


def make_audit_log(
    obj: models.Model,
    request: Request | None,
    change_type: AuditLog.ChangeType,
    changes: list[str],
) -> AuditLog | None:
    info = get_registered_model_info(obj)
    object_id = obj.pk
    object_name = info.name_getter(obj)
    object_type = ContentType.objects.get_for_model(obj)

    last_audit_log = (
        AuditLog.objects.filter(object_id=object_id, object_type=object_type)
        .order_by("-created")
        .first()
    )

    if not changes:
        return last_audit_log

    audit_log = AuditLog.objects.create(
        object_id=object_id,
        object_name=object_name,
        object_type=object_type,
        change_type=change_type,
        change_author=request.user if request else None,
        is_reviewed=False,
        reviewer=None,
        previous=last_audit_log,
        changes=changes,
    )

    return audit_log


def track_model_creation(obj: models.Model, request: Request | None):
    make_audit_log(
        obj=obj,
        request=request,
        change_type=AuditLog.ChangeType.CREATE,
        changes=["Created"],
    )


@contextlib.contextmanager
def track_model_update(obj: models.Model, request: Request | None):
    # TODO: track more detailed changes
    yield
    make_audit_log(
        obj=obj,
        request=request,
        change_type=AuditLog.ChangeType.UPDATE,
        changes=["Updated"],
    )


def track_model_deletion(obj: models.Model, request: Request | None):
    make_audit_log(
        obj=obj,
        request=request,
        change_type=AuditLog.ChangeType.DELETE,
        changes=["Deleted"],
    )
