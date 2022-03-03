from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from premailer import transform

from trcustoms.models import User

FROM = "admin@trcustoms.org"
PREFIX = "[TRCustoms]"


def send_email(
    template_name: str,
    subject: str,
    recipients: list[str],
    context: dict[str, str],
) -> None:
    plaintext = get_template(f"{template_name}.txt")
    html = get_template(f"{template_name}.html")

    text_content = plaintext.render(context)
    html_content = transform(html.render(context))
    msg = EmailMultiAlternatives(subject, text_content, FROM, recipients)
    msg.attach_alternative(html_content, "text/html")
    msg.send()


def send_email_confirmation_mail(user: User) -> None:
    token = user.generate_email_token()
    link = (
        f"{settings.HOST_SITE}/api/users/{user.id}/confirm_email?token={token}"
    )
    send_email(
        template_name="email_confirmation",
        subject=f"{PREFIX} Confirm your registration",
        recipients=[user.email],
        context={
            "username": user.username,
            "link": link,
        },
    )
