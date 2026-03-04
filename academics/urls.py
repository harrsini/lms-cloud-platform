from django.urls import path
from .views import ProgramListView, SemesterSubjectsView, AdminAnalyticsView,StudentsPerProgramView, SubjectListView

urlpatterns = [
    path('programs/', ProgramListView.as_view()),
    path('semesters/<int:semester_id>/', SemesterSubjectsView.as_view()),
    path("admin/analytics/", AdminAnalyticsView.as_view()),
    path("admin/subjects/", SubjectListView.as_view()),
    path("admin/students-per-program/", StudentsPerProgramView.as_view()),
]
