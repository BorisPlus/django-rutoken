#coding: utf-8
from django.conf.urls import patterns, url

urlpatterns = patterns('rutoken.views',
    url(r'^pem_request_modal/$', 'pem_request_modal'),
)