import pytest
from django.core import mail
from mimesis import Generic
from rest_framework import status
from rest_framework.test import APIClient

from trcustoms.conftest import UserFactory

VALID_PASSWORD = "Test123!"


@pytest.mark.django_db
def test_user_request_password_reset(
    user_factory: UserFactory,
    api_client: APIClient,
    fake: Generic,
) -> None:
    user = user_factory(email=fake.person.email())
    response = api_client.post(
        "/api/users/request_password_reset/",
        data={"email": user.email},
    )
    assert response.status_code == status.HTTP_200_OK, response.content
    assert len(mail.outbox) == 1
    assert mail.outbox[0].subject == "[TRCustoms] Password reset"


@pytest.mark.django_db
def test_user_complete_password_reset(
    user_factory: UserFactory,
    api_client: APIClient,
    fake: Generic,
) -> None:
    user = user_factory(email=fake.person.email())
    response = api_client.post(
        "/api/users/complete_password_reset/",
        data={
            "token": user.generate_password_reset_token(),
            "password": VALID_PASSWORD,
        },
    )
    assert response.status_code == status.HTTP_200_OK, response.content
    assert len(mail.outbox) == 0
    user.refresh_from_db()
    assert user.check_password(VALID_PASSWORD)


@pytest.mark.django_db
def test_user_complete_password_reset_invalid_token(
    user_factory: UserFactory,
    api_client: APIClient,
    fake: Generic,
) -> None:
    old_password = f"{VALID_PASSWORD}1"
    new_password = f"{VALID_PASSWORD}2"

    user = user_factory(email=fake.person.email())
    user.set_password(old_password)
    user.save()

    response = api_client.post(
        "/api/users/complete_password_reset/",
        data={
            "token": "bad",
            "password": new_password,
        },
    )
    assert (
        response.status_code == status.HTTP_400_BAD_REQUEST
    ), response.content
    assert len(mail.outbox) == 0
    user.refresh_from_db()
    assert user.check_password(old_password)
    assert not user.check_password(new_password)
