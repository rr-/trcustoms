import pytest
from django.core import mail
from django.db.models import QuerySet
from rest_framework import status
from rest_framework.test import APIClient

from trcustoms.levels.tests.factories import LevelFactory
from trcustoms.reviews.models import Review
from trcustoms.reviews.tests.factories import (
    ReviewFactory,
    ReviewTemplateAnswerFactory,
    ReviewTemplateQuestionFactory,
)
from trcustoms.users.tests.factories import UserFactory


@pytest.mark.django_db
def test_review_creation_missing_fields(auth_api_client: APIClient) -> None:
    response = auth_api_client.post("/api/reviews/", json={})
    data = response.json()

    assert response.status_code == status.HTTP_400_BAD_REQUEST, data
    assert data == {
        "level_id": ["This field is required."],
        "text": ["This field is required."],
        "answer_ids": ["This field is required."],
    }


@pytest.mark.django_db
def test_review_creation_success(
    any_object,
    any_integer,
    any_datetime,
    auth_api_client: APIClient,
) -> None:
    level = LevelFactory(authors=[UserFactory(username="example")])

    questions = [
        ReviewTemplateQuestionFactory(),
        ReviewTemplateQuestionFactory(),
    ]
    answers = [
        ReviewTemplateAnswerFactory(question=questions[0]),
        ReviewTemplateAnswerFactory(question=questions[0]),
        ReviewTemplateAnswerFactory(question=questions[1]),
    ]

    response = auth_api_client.post(
        "/api/reviews/",
        format="json",
        data={
            "level_id": level.id,
            "text": "test",
            "answer_ids": [answers[0].id, answers[2].id],
        },
    )
    review = Review.objects.first()

    assert response.status_code == status.HTTP_201_CREATED, response.content
    assert response.json() == {
        "id": any_integer(),
        "created": any_datetime(allow_strings=True),
        "last_updated": any_datetime(allow_strings=True),
        "last_user_content_updated": any_datetime(allow_strings=True),
        "level": {"id": level.id, "name": level.name, "cover": any_object()},
        "author": {
            "id": auth_api_client.user.id,
            "username": auth_api_client.user.username,
            "first_name": auth_api_client.user.first_name,
            "last_name": auth_api_client.user.last_name,
            "picture": None,
            "reviewed_level_count": 1,
        },
        "text": "test",
        "answers": [answers[0].id, answers[2].id],
        "rating_class": None,
    }

    assert review
    assert review.last_user_content_updated == review.created
    assert review.last_user_content_updated is not None

    assert len(mail.outbox) == 1
    assert mail.outbox[0].subject == "[TRCustoms] New review"


@pytest.mark.django_db
def test_review_creation_rating_classes(
    any_integer,
    any_datetime,
    review_rating_classes: QuerySet,
    auth_api_client: APIClient,
) -> None:
    level = LevelFactory(authors=[UserFactory(username="example")])

    question = ReviewTemplateQuestionFactory()
    answers = [
        ReviewTemplateAnswerFactory(question=question, points=0),
        ReviewTemplateAnswerFactory(question=question, points=10),
    ]

    response = auth_api_client.post(
        "/api/reviews/",
        format="json",
        data={
            "level_id": level.id,
            "text": "test",
            "answer_ids": [answers[1].id],
        },
    )
    data = response.json()
    review = Review.objects.get(pk=data["id"])

    assert review.answers.count() == 1
    assert review.answers.first().points == 10
    assert review.rating_class is not None
    assert review.rating_class.name == "Positive"


@pytest.mark.django_db
def test_review_creation_fails_when_reviewing_own_level(
    any_integer,
    any_datetime,
    auth_api_client: APIClient,
) -> None:
    level = LevelFactory(authors=[auth_api_client.user])

    response = auth_api_client.post(
        "/api/reviews/",
        format="json",
        data={
            "level_id": level.id,
            "text": "test",
            "answer_ids": [],
        },
    )
    data = response.json()

    assert response.status_code == status.HTTP_400_BAD_REQUEST, data
    assert data == {"detail": ["Cannot review own level."]}


@pytest.mark.django_db
def test_review_creation_fails_if_too_many_answers_for_single_question(
    auth_api_client: APIClient,
) -> None:
    level = LevelFactory()

    questions = [
        ReviewTemplateQuestionFactory(),
        ReviewTemplateQuestionFactory(),
    ]
    answers = [
        ReviewTemplateAnswerFactory(question=questions[0]),
        ReviewTemplateAnswerFactory(question=questions[0]),
        ReviewTemplateAnswerFactory(question=questions[1]),
    ]

    response = auth_api_client.post(
        "/api/reviews/",
        format="json",
        data={
            "level_id": level.id,
            "text": "test",
            "answer_ids": [answers[0].id, answers[1].id, answers[2].id],
        },
    )
    data = response.json()

    assert response.status_code == status.HTTP_400_BAD_REQUEST, data
    assert data == {"answer_ids": ["Malformed answers."]}


@pytest.mark.django_db
def test_review_creation_fails_if_question_has_no_answer(
    auth_api_client: APIClient,
) -> None:
    level = LevelFactory()

    questions = [
        ReviewTemplateQuestionFactory(),
        ReviewTemplateQuestionFactory(),
    ]
    answers = [
        ReviewTemplateAnswerFactory(question=questions[0]),
        ReviewTemplateAnswerFactory(question=questions[0]),
        ReviewTemplateAnswerFactory(question=questions[1]),
    ]

    response = auth_api_client.post(
        "/api/reviews/",
        format="json",
        data={
            "level_id": level.id,
            "text": "test",
            "answer_ids": [answers[0].id],
        },
    )
    data = response.json()

    assert response.status_code == status.HTTP_400_BAD_REQUEST, data
    assert data == {"answer_ids": ["Malformed answers."]}


@pytest.mark.django_db
def test_review_creation_fails_if_already_reviewed(
    auth_api_client: APIClient,
) -> None:
    level = LevelFactory()
    ReviewFactory(level=level, author=auth_api_client.user)

    response = auth_api_client.post(
        "/api/reviews/",
        format="json",
        data={
            "level_id": level.id,
            "text": "test",
            "answer_ids": [],
        },
    )
    data = response.json()

    assert response.status_code == status.HTTP_400_BAD_REQUEST, data
    assert data == {"detail": ["This user has already reviewed this level."]}


@pytest.mark.django_db
def test_review_creation_updates_level_review_count(
    auth_api_client: APIClient,
) -> None:
    level = LevelFactory()

    response = auth_api_client.post(
        "/api/reviews/",
        format="json",
        data={
            "level_id": level.id,
            "text": "test",
            "answer_ids": [],
        },
    )
    data = response.json()
    level.refresh_from_db()

    assert response.status_code == status.HTTP_201_CREATED, data
    assert level.reviews.count() == 1  # pylint: disable=no-member
    assert level.review_count == 1


@pytest.mark.django_db
def test_review_creation_updates_position(
    auth_api_client: APIClient,
) -> None:
    level = LevelFactory()
    review1 = ReviewFactory(
        level=level, author=UserFactory(username="foo"), position=1
    )
    review1_last_updated = review1.last_updated

    response = auth_api_client.post(
        "/api/reviews/",
        format="json",
        data={
            "level_id": level.id,
            "text": "test",
            "answer_ids": [],
        },
    )
    data = response.json()
    review1.refresh_from_db()
    review2 = Review.objects.get(pk=data["id"])

    assert response.status_code == status.HTTP_201_CREATED, data
    assert review1.position == 1
    assert review2.position == 2
    assert review1.last_updated == review1_last_updated
