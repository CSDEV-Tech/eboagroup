# coding=utf-8
import os
from datetime import datetime, timedelta
from io import BytesIO
import rest_framework.permissions as permissions
from PIL import Image
from algoliasearch_django import raw_search
# from background_task import background
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
# from django.core.mail import send_mail
from django.core.paginator import Paginator
from django.db.models import Q, Min
from django.http import HttpRequest, Http404
from django.shortcuts import get_object_or_404
from django.utils.dateformat import DateFormat
from django.utils.formats import get_format
from rest_framework import generics
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from ecommerce.api.serializers import (
    ArticleSerializer, SlideSerializer, CategorySerializer, PromotionSerializer,
    CartSerializer, AccountSerializer, CommandSerializer, WishListSerializer,
    TagSerializer, MunicipalitySerializer, TownSerializer)
from ecommerce.models import (
    CartLine, Account, User,
    WishList, Command, CommandLine, Tag, Evaluation,
    Article,
    Slide, Category, Promotion, Cart, VerifiyEmailTokens,
    ResetPasswordTokens,
    Address, Commune, Town, PromoCart, PromoCommand, Contact)
from ecommerce.tasks import send_token_mail, send_contact_mail, send_report_mail
from newsletter.models import Subscriber


class ContextAPIView:
    def set_data(self, data=None, error=False, msg=""):
        if data is None:
            data = {}
        return {"error": error, "msg": msg, **data}


class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer


class ArticleDetailView(generics.RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer


class LatestArticlesListView(generics.ListAPIView):
    queryset = Article.objects.filter(~Q(reduction=0))
    serializer_class = ArticleSerializer


class PromotionListView(generics.ListAPIView):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer


class PromotionDetailView(generics.RetrieveAPIView):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer


class SlideListView(generics.ListAPIView):
    queryset = Slide.objects.filter(Q(show=True))
    serializer_class = SlideSerializer


class CategoryListView(generics.ListAPIView):
    """
    List of categories
    """
    queryset = Category.objects.filter()
    serializer_class = CategorySerializer


class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class IndexView(APIView, ContextAPIView):
    """
    Index of our API
    """

    def get(self, request: Request):
        # interval
        # is_new_interval = datetime.today() - timedelta(days=30)

        # new articles
        # new_articles = Article.objects.filter(Q(created_at__gte=is_new_interval))
        #
        # # articles that have one or more commands
        # command_articles = Article.objects.annotate(commands_count=Count("commands")).filter(
        #     commands_count__gte=1)  # .order_by("-commands_count")

        # get all articles
        articles = ArticleSerializer(
            # new_articles | command_articles,
            Article.objects.all().prefetch_related('category', 'tags'),
            many=True, read_only=True)

        # get all visible slides
        slides = SlideSerializer(Slide.objects.filter(Q(show=True)), many=True)

        # get all categories
        categories = CategorySerializer(Category.objects.all(), many=True)

        # get all promotions
        promotions = PromotionSerializer(
            Promotion.objects.filter(Q(dateBegin__lte=datetime.today()) & Q(dateEnd__gte=datetime.today())), many=True)

        # get all tags
        tags = TagSerializer(Tag.objects.all(), many=True)

        # get all municipalities & towns
        municipalities = MunicipalitySerializer(
            Commune.objects.all(), many=True)
        towns = TownSerializer(Town.objects.all(), many=True)

        return Response(self.set_data(data={
            "articles": articles.data,
            "slides": slides.data,
            "categories": categories.data,
            "promotions": promotions.data,
            "tags": tags.data,
            "municipalities": municipalities.data,
            'towns': towns.data,
        }))


class CartView(APIView, ContextAPIView):
    """
    Shopping Basket View
    """

    def get(self, request: Request, ref=None):
        """
        Get cart
        :param request:
        :param id:
        :return:
        """
        if ref is None:
            return Response(self.set_data(error=True, msg="you must provide the cart reference"),
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = CartSerializer(Cart.objects.get(ref=ref))
        except Cart.DoesNotExist as e:
            return Response(self.set_data(error=True, msg=str(e)),
                            status=status.HTTP_404_NOT_FOUND)
        return Response(self.set_data(data={"cart": cart.data}))

    def post(self, request: HttpRequest):
        """
        Create cart
        :param request:
        :return:
        """
        # x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        # if x_forwarded_for:
        #     ip = x_forwarded_for.split(',')[0]
        # else:
        #     ip = request.META.get('REMOTE_ADDR')

        cart = CartSerializer(Cart.objects.create())
        return Response({"cart": cart.data})

    def put(self, request: Request, ref=None):
        """
        Update cart
        :param request:
        :return:
        """
        if ref is None:
            return Response(self.set_data(error=True, msg="you must provide the cart reference"),
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            action = request.data["action"]
            cart = Cart.objects.get(ref=ref)
            assert (action in ["update", "delete"])
        except Cart.DoesNotExist as e:
            return Response(self.set_data(error=True, msg=str(e)), status=status.HTTP_404_NOT_FOUND)
        except KeyError:
            return Response(self.set_data(error=True, msg="Please provide action ('update' or 'delete')"),
                            status=status.HTTP_400_BAD_REQUEST)
        except AssertionError:
            return Response(self.set_data(error=True, msg="action must be one of ('update', 'delete')"),
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                type = request.data["type"]
                assert (type in ["article", "promotion"])
            except KeyError:
                return Response(self.set_data(error=True, msg="Must provide type of product first"),
                                status=status.HTTP_400_BAD_REQUEST)
            except AssertionError:
                return Response(
                    self.set_data(
                        error=True, msg="'type' argument must be either 'article' or 'promotion'"),
                    status=status.HTTP_400_BAD_REQUEST)
            else:
                if type == "article":
                    if action == "update":  # update or add item to cart
                        try:
                            article_id = int(request.data["article_id"])
                            count = int(request.data["count"])
                            assert (count > 0)
                        except KeyError:
                            return Response(self.set_data(error=True, msg="Must provide article id and count"),
                                            status=status.HTTP_400_BAD_REQUEST)
                        except AssertionError:
                            return Response(self.set_data(error=True, msg="count must be greater than zero"),
                                            status=status.HTTP_400_BAD_REQUEST)
                        except ValueError as e:
                            return Response(self.set_data(error=True, msg=str(e)),
                                            status=status.HTTP_400_BAD_REQUEST)
                        else:
                            try:
                                article = Article.objects.get(pk=article_id)
                                assert (count <= article.stock)
                            except AssertionError:
                                return Response(
                                    self.set_data(
                                        error=True, msg="count must be lower or equal to the stock left"),
                                    status=status.HTTP_400_BAD_REQUEST)
                            except Article.DoesNotExist as e:
                                return Response(self.set_data(error=True, msg=str(e)), status=status.HTTP_404_NOT_FOUND)
                            else:
                                item, _ = cart.cartline_set.get_or_create(
                                    article_related=article)  # type: CartLine
                                item.article_count = count
                                item.save()
                    else:  # delete item from cart
                        try:
                            article_id = int(request.data["article_id"])
                        except KeyError:
                            return Response(self.set_data(error=True, msg="Must provide article id"),
                                            status=status.HTTP_400_BAD_REQUEST)
                        except ValueError as e:
                            return Response(self.set_data(error=True, msg=str(e)),
                                            status=status.HTTP_400_BAD_REQUEST)
                        else:
                            try:
                                article = Article.objects.get(pk=article_id)
                            except AssertionError:
                                return Response(
                                    self.set_data(error=True,
                                                  msg="La quantité doit être inférieure ou égale au stock restant"),
                                    status=status.HTTP_400_BAD_REQUEST)
                            except Article.DoesNotExist as e:
                                return Response(self.set_data(error=True, msg=str(e)), status=status.HTTP_404_NOT_FOUND)
                            else:
                                try:
                                    item = get_object_or_404(cart.cartline_set,
                                                             article_related=article)  # type: CartLine
                                except Http404:
                                    return Response(self.set_data(error=True, msg="This article is not in this cart"),
                                                    status=status.HTTP_404_NOT_FOUND)
                                else:
                                    item.delete()
                else:
                    if action == "update":  # update or add promotion to cart
                        try:
                            promo_id = int(request.data["promo_id"])
                        except KeyError:
                            return Response(self.set_data(error=True, msg="Must provide promo id "),
                                            status=status.HTTP_400_BAD_REQUEST)
                        except ValueError as e:
                            return Response(self.set_data(error=True, msg=str(e)),
                                            status=status.HTTP_400_BAD_REQUEST)
                        else:
                            try:
                                promo = get_object_or_404(
                                    Promotion, pk=promo_id)
                            except Http404 as e:
                                return Response(self.set_data(error=True, msg=str(e)), status=status.HTTP_404_NOT_FOUND)
                            else:
                                # get or create this line
                                PromoCart.objects.get_or_create(
                                    cart_related=cart, promotion_related=promo)
                    else:  # delete promo from cart
                        try:
                            promo_id = int(request.data["promo_id"])
                        except KeyError:
                            return Response(self.set_data(error=True, msg="Must provide promo id"),
                                            status=status.HTTP_400_BAD_REQUEST)
                        except ValueError as e:
                            return Response(self.set_data(error=True, msg=str(e)),
                                            status=status.HTTP_400_BAD_REQUEST)
                        else:
                            try:
                                promo = get_object_or_404(
                                    Promotion, pk=promo_id)
                            except Http404 as e:
                                return Response(self.set_data(error=True, msg=str(e)), status=status.HTTP_404_NOT_FOUND)
                            else:
                                try:
                                    promo = get_object_or_404(
                                        cart.promotions, pk=promo.pk)  # type: Promotion
                                except Http404:
                                    return Response(self.set_data(error=True, msg="This article is not in this cart"),
                                                    status=status.HTTP_404_NOT_FOUND)
                                else:
                                    try:
                                        promo_cart = get_object_or_404(PromoCart, cart_related=cart,
                                                                       promotion_related=promo)
                                        promo_cart.delete()
                                    except Http404 as e:
                                        return Response(self.set_data(error=True, msg=str(e)),
                                                        status=status.HTTP_404_NOT_FOUND)
                                    # cart.promotions.remove(promo)

                # cart returned
                cart = CartSerializer(cart)

                return Response(self.set_data(data={
                    "cart": cart.data
                }))


# User Management
class UserDetailView(APIView, ContextAPIView):
    """
    Retrieve one user (account)
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request):
        try:
            account = AccountSerializer(request.user.account)
            return Response(self.set_data({"account": account.data}))
        except Exception as e:
            return Response(self.set_data(error=True, msg=str(e)))


class ChangePasswordView(APIView, ContextAPIView):
    """ Change password """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request):
        try:
            old_pass = request.data["old_password"]
            new_pass = request.data["new_password"]
            new_pass_confirm = request.data["new_password_confirmation"]
            assert (new_pass == new_pass_confirm)
        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data=self.set_data(error=True, msg="Veuillez remplir tous les champs."))
        except AssertionError:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data=self.set_data(error=True, msg="Les mots de passe ne correspondent pas."))
        else:
            # verify old password
            user = authenticate(email=request.user.email, password=old_pass)
            if not user:
                return Response(self.set_data(error=True, msg="Identifiant ou Mot de passe incorrect."),
                                status=status.HTTP_401_UNAUTHORIZED)

            # validate new password
            try:
                validate_password(new_pass)
            except ValidationError as e:
                return Response(status=status.HTTP_400_BAD_REQUEST,
                                data=self.set_data(error=True, msg=str(e)))
            else:
                # then change the password
                request.user.set_password(new_pass)
                request.user.save()
                return Response(self.set_data({"msg": "Mot de passe modifié avec succès."}))


class EditUserView(APIView, ContextAPIView):
    """ Edit or delete user profile """
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request: Request):
        """ Edit user's profile """
        try:
            fname = request.data["first_name"]
            lname = request.data["last_name"]
            email = request.data["email"]

            # get image
            image = request.FILES.get("image", None)

            contact1 = request.data["contact1"]
            # Contact 2 is optional
            contact2 = request.data.get("contact2")
            # shipping
            town = request.data["town"]
            commune = request.data["commune"]
            address = request.data["address"]

            # get municipality
            c = get_object_or_404(Commune, name=commune, zone__town__name=town)

            trial_image = None
            if image is not None:
                trial_image = Image.open(image)
                trial_image.verify()

            print(type(image), image)
        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data=self.set_data(error=True, msg="Should provide all arguments"))
        except Http404 as e:
            return Response(status=status.HTTP_404_NOT_FOUND,
                            data=self.set_data(error=True, msg=str(e)))
        except OSError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data=self.set_data(error=True, msg=str(e)))
        else:
            try:
                assert (len(fname) > 0 and len(lname) > 0 and len(contact1) > 0 and len(address) > 0
                        # and len(country) > 0
                        and len(town) > 0)

                # Check if this email or this username his already in the database
                user = User.objects.filter(
                    Q(email=email) & ~Q(email=request.user.email))
                if user:
                    raise Exception(
                        "Un autre utilisateur ayant cet email existe déjà !")

                # edit user & account
                request.user.email = email
                request.user.account.contact1 = contact1
                request.user.account.contact2 = contact2
                account = request.user.account
                # Change account address
                account.address.commune = c
                account.address.address = address

                print(trial_image)
                if trial_image is not None:
                    trial_image = Image.open(image)
                    w, h = trial_image.size
                    # print(w, h, trial_image, type(trial_image))

                    MAX_HEIGT = 1200
                    MAX_WIDTH = 900

                    # No more than 900x1200 px
                    if w > MAX_WIDTH or h > MAX_HEIGT:
                        # Find correct size
                        if max(w, h) == h:
                            hr = MAX_HEIGT
                            wr = int((w * hr) / h)
                        else:
                            wr = MAX_WIDTH
                            hr = int((wr * h) / w)

                        # resize the image
                        trial_image = trial_image.resize((wr, hr))

                    # save bytes of image
                    img_io = BytesIO()
                    # print(img_io, type(img_io), trial_image)

                    format = image.name.split(".").pop()

                    if format.upper() in ["PNG"]:
                        trial_image.save(img_io, format='PNG', quality=100)
                    else:
                        trial_image.save(img_io, format='JPEG', quality=100)

                    # if account.avatar is not
                    # print(repr(account.avatar))
                    img_content = ContentFile(
                        img_io.getvalue(), f'{fname}-{lname}.jpg')

                    if account.avatar:
                        # Remove Avatar File
                        os.remove(os.path.abspath(os.path.join(
                            settings.MEDIA_ROOT, account.avatar.name)))

                    account.avatar = img_content
                    print(account.avatar)

                request.user.first_name = fname
                request.user.last_name = lname
                request.user.save()
                account.address.save()
                account.save()

            except AssertionError:
                return Response(status=status.HTTP_400_BAD_REQUEST,
                                data=self.set_data(error=True, msg="Veuillez remplir tous les champs"))
            # except Exception as e:
            #     return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            #                     data=self.set_data(error=True, msg=str(e)))
            else:
                account = AccountSerializer(account)
                return Response(self.set_data(data={"account": account.data}))

    # def delete(self, request: Request):
    #     """
    #     Delete user
    #     :return:
    #     """
    #     try:
    #         user = request.user
    #         account = user.account
    #
    #         # Retrieve and delete user token
    #         token = Token.objects.get(user=user)
    #         token.delete()
    #
    #         # Delete user and account
    #         account.delete()
    #         user.delete()
    #     except Exception as e:
    #         return Response(self.set_data(error=True, msg=str(e)))
    #     else:
    #         return Response(self.set_data(data={"msg": "user successfully deleted !"}))


class LoginView(APIView, ContextAPIView):
    """
    View for login users
    """

    def post(self, request: Request):
        try:
            email = request.data["email"]
            password = request.data["password"]
        except KeyError:
            return Response(self.set_data(error=True, msg="Must Provide email and password"),
                            status.HTTP_400_BAD_REQUEST)
        else:
            try:
                u = User.objects.get(email=email)
                a = u.account
            except User.DoesNotExist:
                return Response(self.set_data(error=True, msg="Cet utilisateur est inexistant"),
                                status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response(self.set_data(error=True, msg=str(e)), status=status.HTTP_400_BAD_REQUEST)
            else:
                user = authenticate(email=email, password=password)
                if not user:
                    return Response(self.set_data(error=True, msg="Identifiant ou Mot de passe incorrect !"),
                                    status=status.HTTP_401_UNAUTHORIZED)

                token, _ = Token.objects.get_or_create(user=user)
                account = AccountSerializer(user.account)
                return Response(self.set_data(data={"token": token.key, "account": account.data}))


class RegisterView(APIView, ContextAPIView):
    """
    View for registering users
    """

    def post(self, request: Request):
        """
        Register user
        """
        # print(request.data)
        try:
            fname = request.data["first_name"]
            lname = request.data["last_name"]
            email = request.data["email"]

            contact1 = request.data["contact1"]
            # Contact 2 is optional
            contact2 = request.data.get("contact2")
            # shipping
            town = request.data["town"]
            commune = request.data["commune"]
            address = request.data["address"]

            # password
            password1 = request.data["password1"]
            password2 = request.data["password2"]

            # receive news for newsletter
            receive_news = request.data.get("receive_news", False)

            # Check if passwords are same
            assert (password1 == password2)

            # Validate password
            validate_password(password1)

            # get municipality
            c = get_object_or_404(Commune, name=commune, zone__town__name=town)
        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data=self.set_data(error=True, msg="Should provide all arguments"))
        except AssertionError:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data=self.set_data(error=True, msg="Les mots de passe ne correspondent pas"))
        except ValidationError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data=self.set_data(error=True, msg=str(e)))
        except Http404 as e:
            return Response(status=status.HTTP_404_NOT_FOUND,
                            data=self.set_data(error=True, msg=str(e)))
        else:
            try:
                assert (len(fname) > 0 and len(lname) > 0 and len(
                    contact1) > 0 and len(address) > 0)

                # Check if this email or this username his already in the database
                user = User.objects.filter(Q(email=email))
                if user:
                    raise Exception(
                        "Un utilisateur ayant cet email existe déjà !")

                # create user
                user = User.objects.create(first_name=fname, last_name=lname, email=email,
                                           username=f'{fname}-{email}')
                user.set_password(password1)
                user.save()

                # create account and an address for him
                a = Address.objects.create(address=address, commune=c)

                # print(a, c)
                account = Account.objects.create(contact1=contact1, contact2=contact2, user_related=user,
                                                 address=a, )

                # create wish list for user
                WishList.objects.create(owner=account)

                # create verify Token for the user
                token = VerifiyEmailTokens.objects.create(user=user)
                account = AccountSerializer(account)

                # Create subscription
                if receive_news:
                    Subscriber.objects.get_or_create(email=email)

                if not send_token_mail("Vérifier votre adresse email",
                                       "Voici le lien de confirmation de votre email : ",
                                       f"//eboagroup.com/email-confirm/{token.key}",
                                       email):
                    return Response(data=self.set_data({
                        "account": account.data,
                    }, error=True, msg="Votre email de confirmation n'a pas pu être envoyé"), )

            except AssertionError:
                return Response(status=status.HTTP_400_BAD_REQUEST,
                                data=self.set_data(error=True, msg="Veuillez remplir tous les champs"))
            except Exception as e:
                import traceback
                traceback.print_exc()
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                data=self.set_data(error=True, msg=str(e)))
            else:
                return Response(self.set_data(data={"account": account.data}))


class LogoutView(APIView, ContextAPIView):
    """
    View for signing out users
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request):
        user = request.user

        # Retrieve and delete user token
        token = Token.objects.get(user=user)
        token.delete()

        return Response(self.set_data(data={}))


class CheckoutView(APIView, ContextAPIView):
    """
    Checkout
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request):
        # print(request.data)
        try:
            ref = request.data["cart_ref"]
            fname, lname, contact = request.data["first_name"], request.data["last_name"], request.data["contact"],
            t, ad, com = request.data["town"], request.data["address"], request.data["commune"]
            p_type = int(request.data["payment_type"])
            details = request.data.get("details", "")
        except ValueError as e:
            return Response(self.set_data(error=True, msg=str(e)),
                            status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response(self.set_data(error=True, msg="Please provide all required arguments"),
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(self.set_data(error=True, msg=str(e)),
                            status=status.HTTP_401_UNAUTHORIZED)
        else:
            try:
                cart = Cart.objects.get(ref=ref)  # type: Cart
                print(cart, cart.cartline_set.all(), cart.promocart_set.all())
                assert (len(cart.cartline_set.all()) >
                        0 or len(cart.promocart_set.all()) > 0)
            except AssertionError:
                return Response(self.set_data(error=True, msg="add one or more article in cart before validating it"),
                                status=status.HTTP_400_BAD_REQUEST)
            except Cart.DoesNotExist as e:
                return Response(self.set_data(error=True, msg=str(e)), status=status.HTTP_404_NOT_FOUND)
            else:
                try:
                    assert (1 <= p_type <= 2)
                    commune = Commune.objects.get(name=com)
                    client_zone = commune.zone
                except AssertionError:
                    return Response(
                        self.set_data(error=True, msg="Payment type must be 1 (MOBILE MONEY) or 2 (CASH)"))
                except Commune.DoesNotExist as e:
                    return Response(self.set_data(error=True, msg=str(e)), status=status.HTTP_404_NOT_FOUND)
                else:
                    try:
                        assert (
                            len(ad) > 0
                            and len(t) > 0
                            and len(fname) > 0
                            and len(lname) > 0
                            and len(contact) > 0
                            and len(com) > 0
                        )
                    except AssertionError:
                        return Response(
                            self.set_data(error=True, msg="Veuillez remplir tous les champs."))
                    else:
                        in_2_days = datetime.now() + timedelta(hours=48)

                        # set the address
                        address = Address.objects.create(
                            commune=commune, address=ad)

                        # request.user.account.address.commune.shipping_cost
                        additionnal_costs = commune.shipping_cost

                        command = Command.objects.create(address=address,
                                                         owner=request.user.account,
                                                         date=in_2_days,
                                                         first_name=fname,
                                                         last_name=lname,
                                                         contact=contact,
                                                         payment_modality=p_type,
                                                         details=details,
                                                         shipping_cost=additionnal_costs)

                        # The client zone
                        # get Zone
                        # client_zone = request.user.account.address.commune.zone  # type: Zone

                        # send cart lines to command and empty cart
                        for line in cart.cartline_set.all():
                            furnisher_dedicated = None

                            # Get the client zone furnisher
                            article_furnishers = line.article_related.furnishers
                            furnishers = article_furnishers.filter(
                                zone=client_zone)

                            if not furnishers:
                                # if not, then look for the most prioritized furnisher
                                min_priority = line.article_related.furnishers.aggregate(
                                    Min("zone__priority"))
                                if min_priority:
                                    furnishers = article_furnishers.filter(
                                        zone__priority=min_priority["zone__priority__min"])

                                if not furnishers:
                                    if article_furnishers.all():
                                        # If always not, then look for a random furnisher
                                        furnisher_dedicated = article_furnishers.first()
                                else:
                                    furnisher_dedicated = furnishers[0]
                            else:
                                furnisher_dedicated = furnishers[0]

                            c_line = CommandLine(article_related=line.article_related, article_count=line.article_count,
                                                 command_related=command, furnisher_related=furnisher_dedicated)
                            c_line.save()
                            line.delete()
                            # print(line, c_line)

                        # send promotions to command and do thesame as above
                        for promotion in cart.promotions.all():
                            # add promotion to command
                            PromoCommand.objects.create(
                                promotion_related=promotion, command_related=command)

                            # delete promotion from cart
                            promo_cart = PromoCart.objects.get(
                                cart_related=cart, promotion_related=promotion)
                            promo_cart.delete()

                        command.save()
                        cart.save()
                        commandData = CommandSerializer(command)

                        # send resume mail to the admin
                        host = f"{request.META['HTTP_HOST']}"
                        if settings.DEBUG:
                            url = f"{request.scheme}://{host}/admin/ecommerce/command/{command.id}/"
                        else:
                            url = f"{request.scheme}://admin.{host}/ecommerce/command/{command.id}/"

                        account = request.user.account
                        print("Sending report")

                        # Format Date
                        df1 = DateFormat(command.created_at)
                        df2 = DateFormat(command.date)
                        created = df1.format(get_format('DATE_FORMAT'))
                        date_ = df2.format(get_format('DATE_FORMAT'))

                        send_report_mail(url,
                                         command.ref,
                                         created,
                                         date_,
                                         command.total,
                                         str(account),
                                         account.email,
                                         account.contact1
                                         )

                        return Response(self.set_data(data={"command": commandData.data}))


class CommandListView(generics.ListAPIView):
    """
    Command list view
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommandSerializer

    def get_queryset(self):
        """
        :param
        :return:
        """
        commands = self.request.user.account.command_set
        return commands


class CommandDetailView(APIView, ContextAPIView):
    """
    Retrieve one command
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request, ref):
        try:
            command = request.user.account.command_set.get(ref=ref)
        except Command.DoesNotExist:
            return Response(self.set_data(error=True, msg="This command does not exists in the commands of this user"),
                            status=status.HTTP_404_NOT_FOUND)
        else:
            command = CommandSerializer(command)
            return Response(self.set_data(data={"command": command.data}))


class WishListView(APIView, ContextAPIView):
    """
    Wish list
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request):
        w = WishListSerializer(request.user.account.wishlist)
        return Response(self.set_data({
            "wishlist": w.data
        }))

    def put(self, request: Request):
        """
        :param request:
        :return:
        """
        try:
            action = request.data["action"]
            assert (action in ["update", "delete"])
        except KeyError:
            return Response(self.set_data(error=True, msg="Please provide action ('update' or 'delete')"),
                            status=status.HTTP_400_BAD_REQUEST)
        except AssertionError:
            return Response(self.set_data(error=True, msg="action must be one of ('update', 'delete')"),
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                article_id = int(request.data["article_id"])
            except KeyError:
                return Response(self.set_data(error=True, msg="Must provide article id"),
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                try:
                    article = Article.objects.get(pk=article_id)
                except Article.DoesNotExist as e:
                    return Response(self.set_data(error=True, msg=str(e)), status=status.HTTP_404_NOT_FOUND)
                else:
                    account = request.user.account  # type: Account
                    try:
                        if action == "update":
                            account.wishlist.items.add(article)
                        else:
                            account.wishlist.items.remove(article)
                    except Exception as e:
                        return Response(self.set_data(error=True, msg=str(e)), status=status.HTTP_404_NOT_FOUND)
                    else:
                        # cart returned
                        w = WishListSerializer(account.wishlist)

                        return Response(self.set_data(data={
                            "wishlist": w.data
                        }))


class NoteArticleView(APIView, ContextAPIView):
    """
    Evaluate an article
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request):
        """Add Note"""
        try:
            note = int(request.data["note"])
            article_id = int(request.data["article_id"])
            assert 0 <= note <= 5
        except KeyError:
            return Response(self.set_data(error=True, msg="Please provide note and article id"),
                            status=status.HTTP_400_BAD_REQUEST)
        except AssertionError:
            return Response(self.set_data(error=True, msg="Note must be between 0 and 5"),
                            status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response(self.set_data(error=True, msg="Note must be an integer !"),
                            status=status.HTTP_400_BAD_REQUEST)
        else:

            try:
                article = get_object_or_404(Article, pk=article_id)
            except Http404 as e:
                return Response(self.set_data(error=True, msg=str(e)),
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                ev, _ = Evaluation.objects.get_or_create(
                    article=article, account=request.user.account)
                ev.note = note
                ev.save()
                article = ArticleSerializer(article)
                return Response(self.set_data(data={"msg": "Votre avis a bien été pris en compte avec succès.",
                                                    "product": article.data}))


# class PromotionCheckoutView(APIView, ContextAPIView):
#     """
#     Checkout
#     """
#
#     def post(self, request: Request, pk):
#         try:
#             cart = Cart.objects.get(request.data["cart_ref"])
#             promo = Promotion.objects.get(pk=pk)
#         except Promotion.DoesNotExist as e:
#             return Response(self.set_data(error=True, msg=str(e)), status=status.HTTP_404_NOT_FOUND)
#         except Cart.DoesNotExist as e:
#             return Response(self.set_data(error=True, msg=str(e)), status=status.HTTP_404_NOT_FOUND)
#         except KeyError:
#             return Response(self.set_data(error=True, msg="Please provide cart reference"),
#                             status=status.HTTP_404_NOT_FOUND)
#         else:
#             for article in promo.article_set.all():
#                 if article.stock > 0:
#                     cart.cartline_set.get_or_create(article_related=article, article_count=1)
#             cart = CartSerializer(cart)
#             return Response(self.set_data({"cart": cart.data}))


class SendEmailConfirmView(APIView, ContextAPIView):
    """
    View for sending email confirmation mails
    This work only if connected
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request):
        user = request.user
        try:
            token = get_object_or_404(VerifiyEmailTokens, user=user)
        except Http404:
            pass
        else:
            if user.account is not None:
                # Delete token for the current user then
                token.delete()
            else:
                # If this user has no account associated with, then
                return Response(self.set_data(error=True, msg="Veuillez vous connecter pour confirmer votre email"),
                                status=status.HTTP_401_UNAUTHORIZED)
        finally:
            # create verify Token for the user
            try:
                token = VerifiyEmailTokens.objects.create(user=user)
            except Exception as e:
                return Response(self.set_data(error=True, msg=str(e)),
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                if send_token_mail('Vérifier votre adresse email',
                                   "Voici le lien de confirmation de votre email :",
                                   f"//eboagroup.com/email-confirm/{token.key}",
                                   user.account.email, request):
                    return Response(self.set_data(data={"success": True,
                                                        "msg": "Votre lien d'activation a été envoyé dans votre boîte mail, si vous ne trouvez pas dans votre boîte de réception, vérifier vos spams"}))
                else:
                    return Response(self.set_data(error=True,
                                                  msg="Votre message n'a pas pu être envoyé, \nveuillez signaler cette erreur aux"
                                                      " administrateurs du site."
                                                  ),
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConfirmEmailView(APIView, ContextAPIView):
    """Confirm Email View"""

    def post(self, request: Request):
        try:
            token = request.data["token"]
        except KeyError:
            return Response(
                self.set_data(error=True, msg="You must provide token !"),
                status=status.HTTP_400_BAD_REQUEST
            )
        else:
            msg = ""
            try:
                query = VerifiyEmailTokens.objects.filter(key=token, )
                if len(query) == 0:
                    msg = "Ce lien n'est pas valide"
                    raise Http404
                else:
                    alive = query.filter(expirationDate__gte=datetime.now())

                    if len(alive) == 0:
                        msg = "Ce lien a expiré"

                        # delete all the token stored for this user
                        for key in query.all():
                            key.delete()

                        raise Http404
                    associated = alive[0]
            except Http404:
                return Response(
                    self.set_data(error=True, msg=msg),
                    status=status.HTTP_404_NOT_FOUND
                )
            else:
                account = associated.user.account

                # set email to verified, then delete the associated token
                account.email_verified = True
                account.save()
                associated.delete()
                account = AccountSerializer(account)
                return Response(self.set_data(data={
                    "msg": "Votre email a bien été confirmé avec succès !",
                    "user": account.data
                }))


class ResetPasswordView(APIView, ContextAPIView):
    """ Reset Password View """

    def post(self, request: Request):
        """ Make the reset password request"""
        try:
            print(request.data)
            email = request.data["email"]
        except KeyError:
            return Response(self.set_data(error=True, msg="Veuillez saisir l'email."),
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                account = get_object_or_404(Account, user_related__email=email)
            except Http404:
                return Response(self.set_data(error=True, msg="Il n'existe aucun utilisateur ayant cet email ."),
                                status=status.HTTP_404_NOT_FOUND)
            else:

                try:
                    # Delete previous password reset token for this user
                    previous = get_object_or_404(
                        ResetPasswordTokens, user=account.user_related)
                except Http404:
                    pass
                else:
                    previous.delete()

                finally:
                    # Create reset password token for this user
                    token = ResetPasswordTokens.objects.create(
                        user=account.user_related)

                    if send_token_mail("Réinitialisation du mot de passe",
                                       "Voici le lien de réinitialisation de votre mot de passe :",
                                       f"//eboagroup.com/password-reset/{token.key}",
                                       email):
                        return Response(self.set_data(data={
                            "msg": "Votre demande a bien été envoyée, veuillez vérifier dans votre boite mail, si vous ne trouvez pas dans la boîte de réception, veuillez vérifier votre spam",
                        }))
                    else:
                        return Response(self.set_data(error=True,
                                                      msg="Votre message n'a pas pu être envoyé,\n veuillez signaler cette erreur aux"
                                                          "administrateurs du site."
                                                      ),
                                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request: Request):
        """ Reset Password """
        try:
            key = request.data["token"]
            password1 = request.data["password1"]
            password2 = request.data["password2"]
            assert (password1 == password2)
            validate_password(password1)
        except KeyError:
            return Response(self.set_data(error=True, msg="Veuillez saisir toutes les informations."),
                            status=status.HTTP_400_BAD_REQUEST)
        except AssertionError:
            return Response(self.set_data(error=True, msg="Les mots de passes saisis ne correspondent pas."),
                            status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response(self.set_data(error=True, msg=str(e)), )
        else:
            msg = ""
            try:
                try:
                    token = ResetPasswordTokens.objects.get(key=key)
                except ResetPasswordTokens.DoesNotExist:
                    msg = "Ce lien n'est pas valide"
                    raise Http404
                else:
                    try:
                        token = ResetPasswordTokens.objects.get(
                            key=key, expirationDate__gte=datetime.now())
                    except ResetPasswordTokens.DoesNotExist:
                        # Delete the old token
                        token.delete()
                        msg = "Ce lien a expiré"
                        raise Http404
            except Http404:
                return Response(self.set_data(error=True, msg=msg),
                                status=status.HTTP_404_NOT_FOUND)
            else:
                user = token.user
                # change password

                user.set_password(password1)
                user.save()

                # delete all other sessions for this user
                try:
                    auth_token = get_object_or_404(Token, user=user)
                except Http404:
                    pass
                else:
                    auth_token.delete()
                finally:
                    token.delete()
            return Response(self.set_data(data={
                "msg": "Votre mot de passe a été mis à jour avec succès.",
            }))


class SearchView(APIView, ContextAPIView):
    """ View for search"""

    def post(self, request: Request):
        try:
            category = request.data.get("category", "")
            filters = request.data.get("filters", "")
            query = request.data.get("query", "")
            tags = request.data.get("tags", "")
            page = int(request.data.get("page", 1))

            print(request.data)

            if len(tags.strip()) > 0:
                tags = tags.split(";")

            if len(filters.strip()) > 0:
                filters = filters.split(";")
        except Exception as e:
            return Response(self.set_data(error=True, msg=str(e)),
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            if tags is None:
                tags = []

            if filters is None:
                filters = []

            # total = 0
            # num_pages = 0
            # results = []

            # Make search
            if not settings.DEBUG:
                # On production : launch request on Algolia API server
                re_tags = [f"get_tags.tag:{tag}" for tag in tags]
                re_filters = [
                    f"get_filters.name:{filter}" for filter in filters]

                params = {
                    "facetFilters": [
                        re_tags,
                        [f"category_link:{category}"],
                        re_filters,
                    ],
                    "page": page - 1,
                }

                response = raw_search(Article, query=query, params=params)
                results = response["hits"]
                total = response["nbHits"]
                num_pages = response["nbPages"]
                # print(response["hits"])

            else:
                # On Dev : launch search on DB
                # print(f"'{query}'")
                queries = Q(name__istartswith=query)

                if len(category) > 0:
                    queries = queries & Q(category__slug=category)

                if len(filters) > 0:
                    queries = queries & Q(filters__name__in=filters)

                if len(tags) > 0:
                    queries = queries & Q(tags__tag__in=tags)

                print(queries)

                response = Article.objects.filter(queries).distinct()

                results = ArticleSerializer(response.all(), many=True).data

                total = len(results)
                # Paginate results
                p = Paginator(results, 20)
                if not (page > p.num_pages):
                    results = list(p.get_page(page).object_list)
                else:
                    results = []

                num_pages = p.num_pages
                params = {}

            # print(list(results))
            # print(list(p.get_page(1).object_list))

            """
            print("\n\n\n")
            for res in results:
                print(res["name"])

            print()
            for dt in data:
                print(dt["name"])
            """

        return Response(self.set_data(
            {"msg": "Query finished with success", "results": results, 'total_pages': num_pages, "page": page,
             "total_results": total, "params": params}))


class ContactView(APIView, ContextAPIView):
    def post(self, request: Request):
        """
        Send mail to the admin
        """
        try:
            name = request.data["name"]
            phone = request.data["phone"]
            email = request.data["email"]
            message = request.data["message"]

            assert (len(name) > 0 and len(phone) >
                    0 and len(email) > 0 and len(message) > 0)
        except KeyError:
            return Response(data=self.set_data(error=True, msg="Should provide all arguments"),
                            status=status.HTTP_400_BAD_REQUEST)
        except AssertionError:
            return Response(data=self.set_data(error=True, msg="Veuillez saisir toutes les informations."),
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            # If everything is okay then send the mail
            Contact.objects.create(
                name=name, phone=phone, email=email, message=message)
            if send_contact_mail(name, email, phone, message):
                return Response(
                    data=self.set_data(data={"success": True, "msg": "Votre message a pu être envoyé avec succès."}))
            else:
                Response(data=self.set_data(error=True,
                                            msg="Votre message n'a pas pu être envoyé,"
                                                "<br> veuillez signaler cette erreur aux "
                                                "administrateurs du site."),
                         status=status.HTTP_500_INTERNAL_SERVER_ERROR)
