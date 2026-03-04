from django.urls import path
from .views import (
    StudentLoginView,
    FacultyLoginView,
    ProfileView,
    DashboardView,   
    AdminLoginView,
    AdminProgramView,
    AdminSemesterView,
    AdminSubjectView,
    AdminUserView
)


urlpatterns = [
    path('student/login/', StudentLoginView.as_view()),
    path('faculty/login/', FacultyLoginView.as_view()),
     path("admin/login/", AdminLoginView.as_view()),
    path('dashboard/', DashboardView.as_view()),
    path('profile/', ProfileView.as_view()),
    path("admin/programs/", AdminProgramView.as_view()),
    path("admin/programs/<int:pk>/", AdminProgramView.as_view()),
    path("admin/semesters/", AdminSemesterView.as_view()),
    path("admin/semesters/<int:pk>/", AdminSemesterView.as_view()),
    path("admin/subjects/", AdminSubjectView.as_view()),
    path("admin/subjects/<int:pk>/", AdminSubjectView.as_view()),
    path("admin/users/", AdminUserView.as_view()),
    path("admin/users/<int:pk>/", AdminUserView.as_view()),
    
    
]
