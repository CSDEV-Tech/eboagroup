import django.forms as forms
from blog.models import Comment


class CommentForm(forms.ModelForm):
    parent = forms.ModelChoiceField(queryset=Comment.objects.all(), required=False)

    class Meta:
        model = Comment
        fields = [
            'content',
            'subject',
            'author',
            'parent',
        ]


class CommentEditForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = [
            'content',
        ]


class SearchForm(forms.Form):
    query = forms.CharField(required=False, initial="")
    tags = forms.CharField(required=False, initial="")
    category = forms.CharField(required=False, initial="")
    page = forms.IntegerField(min_value=1, initial=1, required=False)
