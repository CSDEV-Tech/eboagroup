from PIL import Image
from django.core.files.storage import FileSystemStorage
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import HttpRequest
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import generic
from django.views.decorators.csrf import csrf_exempt


class UploadView(generic.View):
    @method_decorator(csrf_exempt)
    def post(self, request: HttpRequest):
        try:
            f = request.FILES['file']  # type: InMemoryUploadedFile

            # Verifier que l'image est valide
            if f is not None:
                trial_image = Image.open(f)
                trial_image.verify()

        except KeyError:
            return HttpResponse("Aucun Fichier envoyé", status=400)
        except OSError:
            return HttpResponse("Image Invalide", status=400)
        else:
            fs = FileSystemStorage()
            filename = fs.save(f'uploads/{f.name}', f)
            uploaded_file_url = fs.url(filename)

            # Close file
            f.close()

            # {request.scheme}://{request.META["HTTP_HOST"]}

            return JsonResponse(
                {
                    "location": f'{uploaded_file_url}'
                }
            )


# Create your views here.
def index(request: HttpRequest, token=None):
    return render(request, "ecommerce/index.html")


# Create your views here.
def analytics(request: HttpRequest):
    return render(request, "ecommerce/base.html")


# Create your views here.
def invoice(request: HttpRequest):
    return render(request, "ecommerce/invoice.html")


def mail(request: HttpRequest):
    return render(request, "ecommerce/mail/base_mail.html")
