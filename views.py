# coding: utf-8
from django.http import HttpResponseRedirect
from django.conf import settings
from django.shortcuts import render
from django.template.response import TemplateResponse
# from django.utils.http import is_safe_url
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters
from django.contrib.auth import REDIRECT_FIELD_NAME, login as auth_login
from django.contrib.sites.models import get_current_site

from rutoken.forms import Login as LoginForm

@sensitive_post_parameters()
@csrf_protect
@never_cache
def login(request, template_name='rutoken/login.html',
          redirect_field_name=REDIRECT_FIELD_NAME,
          authentication_form=LoginForm,
          current_app=None, extra_context=None,
          logger=None
          ):

    """
        Почти полный копипаст django.contrib.auth.views.login.
        Главное дополнение касаются генерации случайной строки для аутентификации.

        Displays the login form and handles the login action.
    """
    context = {}

    redirect_to = request.REQUEST.get(redirect_field_name, '')

    if request.method == "POST":
        form = authentication_form(data=request.POST, request=request)
        if form.is_valid():
            # Ensure the user-originating redirection url is safe.
            # if not is_safe_url(url=redirect_to, host=request.get_host()):
            #     redirect_to = settings.LOGIN_REDIRECT_URL

            # Okay, security check complete. Log the user in.
            auth_login(request, form.get_user())

            if request.session.test_cookie_worked():
                request.session.delete_test_cookie()

            if logger:
                logger.info(u'User "%s" login.' % request.user)

            return HttpResponseRedirect(redirect_to)
    else:
        form = authentication_form(request)

    request.session.set_test_cookie()

    current_site = get_current_site(request)

    form.gen_server_auth_random()

    context['form'] = form
    context[redirect_field_name] = redirect_to
    context['site'] = current_site
    context['site_name'] = current_site.name

    if extra_context is not None:
        context.update(extra_context)

    return TemplateResponse(request, template_name, context, current_app=current_app)


def pem_request_popup(request):
    c = {
        'form': LoginForm()
    }
    return render(request, 'rutoken/pem_request_popup.html', c)

def pem_cert_popup(request):
    return render(request, 'rutoken/pem_cert_popup.html')