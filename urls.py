#coding: utf-8
from django.conf.urls import patterns, url

urlpatterns = patterns('rutoken.views',
    url(r'^pem_request_popup/$', 'pem_request_popup'),
    url(r'^pem_cert_popup/$', 'pem_cert_popup'),
    url(r'^get_user_by_cert_request/$', 'get_user_by_cert_request')
)