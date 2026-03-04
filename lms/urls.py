from django.urls import path
from .views import (
    MaterialListView,
    AssignmentListView,
    SubmissionCreateView,
    SubmissionListView,
    SubjectListView
)

urlpatterns = [
    path('materials/<int:subject_id>/', MaterialListView.as_view()),
    path('assignments/<int:subject_id>/', AssignmentListView.as_view()),
    path('submit/<int:assignment_id>/', SubmissionCreateView.as_view()),
    path('submissions/<int:assignment_id>/', SubmissionListView.as_view()),
    path('subjects/', SubjectListView.as_view(), name='subject-list')
]
