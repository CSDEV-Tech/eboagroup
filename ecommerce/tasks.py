from django.conf import settings
from background_task import background
from django.template.loader import render_to_string
from django.utils.html import escape
from django.core.mail import send_mail
import logging

import sys

# if sys.platform == "win32":
#     logging.basicConfig(filename='log/mylog.log', filemode="a", level=logging.DEBUG)
# else:
#     logging.basicConfig(filename='/var/www/html/boagroup_services/log/mylog.log', filemode="a", level=logging.DEBUG)

@background(schedule=5)
def hello():
        print("Hello World!")

@background(schedule=1)
def send_token_mail(subject: str, title: str, url: str, receiver: str):
    msg = render_to_string("ecommerce/mail/token_mail.html", context={"title": title, "url": url},
                           # request=request
                           )
    if settings.DEBUG:
        logging.debug(msg)
    logging.debug(msg)
    n = send_mail(
        subject=subject,
        html_message=msg,
        message="",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[receiver, ],
        fail_silently=True,
    )
    if settings.DEBUG:
       logging.debug(f"{n} Emails sent")


@background(schedule=2)
def send_contact_mail(name: str, email: str, phone: str, message: str):
    msg = render_to_string("ecommerce/mail/contact_mail.html", context={
       "email": email,
        "phone": phone.replace(" ", ""),
        "message": str(escape(message)).replace(" ", "&nbsp;").replace("\n", "<br/>"),
        "name": name
    })

    if settings.DEBUG:
        logging.debug(msg)
    
    # logging.debug(msg)
    n = send_mail(
        subject=f"Contact sur BoaGroUp' de la part de {name}",
        html_message=msg,
        message="",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=["boagroup01@gmail.com", ],
        fail_silently=True,
    )
    if settings.DEBUG:
       logging.debug(f"{n} Emails sent")

    #return n == 1


@background(schedule=1)
def send_report_mail(url: str,
                     command_ref, command_created_at, command_date, command_total,
                     name, email, contact1):
    """ Send Mail after a command has been done """
    # host = f"{request.META['HTTP_HOST']}"
    # if settings.DEBUG:
    #     url = f"{request.scheme}://{host}/admin/ecommerce/command/{command.id}/"
    # else:
    #     url = f"{request.scheme}://admin.{host}/ecommerce/command/{command.id}/"

    msg = render_to_string("ecommerce/mail/command_report_mail.html", context={
        # "buyer": buyer,
        "url": url,
        "name": name,
        "email": email,
        "contact1": contact1,
        # "command": command
        "command_ref": command_ref,
        "command_created_at": command_created_at,
        "command_date": command_date,
        "command_total": command_total,
    })

    if settings.DEBUG:
        logging.debug(msg)

    n = send_mail(
        subject=f"Nouvel achat sur BoaGrouUp'",
        html_message=msg,
        message="",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=["boagroup01@gmail.com", ],
        fail_silently=True,
    )
    #return n == 1
    if settings.DEBUG:
       logging.debug(f"{n} Emails sent")



