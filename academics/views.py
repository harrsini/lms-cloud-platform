from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Program, Semester, Subject
from .serializers import ProgramSerializer, SemesterSerializer, SubjectSerializer
from django.contrib.auth import get_user_model


class ProgramListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        programs = Program.objects.all()
        serializer = ProgramSerializer(programs, many=True)
        return Response(serializer.data)


class SemesterSubjectsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, semester_id):
        semester = Semester.objects.get(id=semester_id)
        serializer = SemesterSerializer(semester)
        return Response(serializer.data)


# ✅ THIS IS THE MISSING API
class SubjectListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        subjects = Subject.objects.select_related("program", "semester", "faculty").all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)


class AdminAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        User = get_user_model()

        total_students = User.objects.filter(role="student").count()
        total_faculty = User.objects.filter(role="faculty").count()

        total_programs = Program.objects.count()
        total_semesters = Semester.objects.count()
        total_subjects = Subject.objects.count()

        return Response({
            "students": total_students,
            "faculty": total_faculty,
            "programs": total_programs,
            "semesters": total_semesters,
            "subjects": total_subjects,
        })


class StudentsPerProgramView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):

        User = get_user_model()

        data = []

        programs = Program.objects.all()

        for program in programs:

            semesters = Semester.objects.filter(program=program)

            student_count = User.objects.filter(
                role="student",
                semester__in=semesters
            ).count()

            data.append({
                "program": program.name,
                "students": student_count
            })

        return Response(data)