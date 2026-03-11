from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Material, Assignment, Submission, Subject
from .serializers import (
    MaterialSerializer,
    AssignmentSerializer,
    SubmissionSerializer,
    SubjectSerializer
)


# ======================
# MATERIAL LIST VIEW
# ======================
class MaterialListView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, subject_id):
        materials = Material.objects.filter(subject_id=subject_id)
        serializer = MaterialSerializer(materials, many=True)
        return Response(serializer.data)

    def post(self, request, subject_id):
        if request.user.role != "faculty":
            return Response(
                {"error": "Only faculty can upload materials"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = MaterialSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(
                subject_id=subject_id,
                uploaded_by=request.user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ======================
# ASSIGNMENT LIST VIEW
# ======================
class AssignmentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, subject_id):
        assignments = Assignment.objects.filter(subject_id=subject_id)
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    def post(self, request, subject_id):
        if request.user.role != "faculty":
            return Response(
                {"error": "Only faculty can create assignments"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = AssignmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(
                subject_id=subject_id,
                created_by=request.user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ======================
# SUBMISSION CREATE VIEW
# ======================
class SubmissionCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, assignment_id):

        if request.user.role != "student":
            return Response(
                {"error": "Only students can submit assignments"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = SubmissionSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(
                assignment_id=assignment_id,
                student=request.user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ======================
# SUBMISSION LIST VIEW
# ======================
class SubmissionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assignment_id):

        if request.user.role != "faculty":
            return Response(
                {"error": "Only faculty can view submissions"},
                status=status.HTTP_403_FORBIDDEN
            )

        submissions = Submission.objects.filter(assignment_id=assignment_id)
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)


# ======================
# SUBJECT LIST VIEW
# ======================
class SubjectListView(generics.ListAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "faculty":
            return Subject.objects.filter(faculty=user)

        elif user.role == "student":
            return Subject.objects.filter(semester=user.semester)

        return Subject.objects.all()