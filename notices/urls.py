from django.urls import path
from .views import NoticeListView, NoticeCreateView, NoticeDeleteView

urlpatterns = [
    path("", NoticeListView.as_view()),
    path("create/", NoticeCreateView.as_view()),
    path("delete/<int:id>/", NoticeDeleteView.as_view()),
]