from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from newsletter.forms import SubscribeForm
from newsletter.models import Subscriber


class ContextAPIView:
    def set_data(self, data=None, error=False, msg=""):
        if data is None:
            data = {}
        return {"error": error, "msg": msg, **data}


class SubscribeView(APIView, ContextAPIView):
    def post(self, request: Request, token=None):
        form = SubscribeForm(request.data)

        try:
            get_object_or_404(Subscriber, email=request.data.get("email"))
        except Http404:
            pass
        else:
            return Response(
                self.set_data(
                    error=True,
                    msg="Vous êtes déjà abonné à la newsletter",
                ),
                status=status.HTTP_400_BAD_REQUEST
            )

        if form.is_valid():
            form.save()
            return Response(
                self.set_data(
                    msg="Vous vous êtes abonné à notre newsletter avec succès !\nSoyez prêts à recevoir de nos nouvelles"
                )
            )
        else:
            return Response(
                self.set_data(
                    error=True,
                    msg=form.errors,
                ),
                status=status.HTTP_400_BAD_REQUEST
            )

    def delete(self, request: Request, token: str):
        try:
            subscriber = get_object_or_404(Subscriber, token=token)
        except Http404:
            return Response(
                self.set_data(
                    error=True,
                    msg="Désolé, Vous n'êtes pas abonné à la newsletter",
                ),
                status=status.HTTP_404_NOT_FOUND
            )
        else:
            subscriber.delete()

            return Response(
                self.set_data(
                    msg="Vous vous êtes désabonné de la newsletter avec succès",
                ),
            )
