from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import (
    LoginSerializer,
    get_tokens_for_user,
    StudentDashboardSerializer,
    FacultyDashboardSerializer,
    AdminDashboardSerializer
)

from .models import CustomUser
from academics.models import Program, Semester, Subject


# ======================
# STUDENT LOGIN
# ======================
class StudentLoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            if user.role != "student":
                return Response(
                    {"error": "Not a student account"},
                    status=status.HTTP_403_FORBIDDEN
                )

            tokens = get_tokens_for_user(user)

            return Response({
                "message": "Student login successful",
                "tokens": tokens
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ======================
# FACULTY LOGIN
# ======================
class FacultyLoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            if user.role != "faculty":
                return Response(
                    {"error": "Not a faculty account"},
                    status=status.HTTP_403_FORBIDDEN
                )

            tokens = get_tokens_for_user(user)

            return Response({
                "message": "Faculty login successful",
                "tokens": tokens
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ======================
# ADMIN LOGIN
# ======================
class AdminLoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            if user.role != "admin":
                return Response(
                    {"error": "Not an admin account"},
                    status=status.HTTP_403_FORBIDDEN
                )

            tokens = get_tokens_for_user(user)

            return Response({
                "message": "Admin login successful",
                "tokens": tokens
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ======================
# ADMIN PROGRAM CRUD
# ======================
class AdminProgramView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if request.user.role != "admin":
            return Response({"error": "Only admin allowed"}, status=403)

        if pk:
            try:
                program = Program.objects.get(pk=pk)
            except Program.DoesNotExist:
                return Response({"error": "Not found"}, status=404)

            return Response({
                "id": program.id,
                "name": program.name,
                "duration_years": program.duration_years
            })

        programs = Program.objects.all()
        data = [
            {
                "id": p.id,
                "name": p.name,
                "duration_years": p.duration_years
            }
            for p in programs
        ]
        return Response(data)

    def post(self, request):
        if request.user.role != "admin":
            return Response({"error": "Only admin allowed"}, status=403)

        name = request.data.get("name")
        duration_years = request.data.get("duration_years")

        if not name or not duration_years:
            return Response(
                {"error": "Program name and duration_years required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        program = Program.objects.create(
            name=name,
            duration_years=duration_years
        )

        return Response({
            "id": program.id,
            "name": program.name,
            "duration_years": program.duration_years
        }, status=201)
    def put(self, request, pk=None):
        if request.user.role != "admin":
            return Response({"error": "Only admin allowed"}, status=403)

        try:
            program = Program.objects.get(pk=pk)
        except Program.DoesNotExist:
            return Response({"error": "Program not found"}, status=404)

        program.name = request.data.get("name", program.name)
        program.duration_years = request.data.get("duration_years", program.duration_years)
        program.save()

        return Response({
            "id": program.id,
            "name": program.name,
            "duration_years": program.duration_years
        })

# ======================
# DASHBOARD VIEW
# ======================
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # STUDENT DASHBOARD
        if user.role == "student":
            semester = user.semester

            if not semester:
                return Response({"error": "Student not assigned to any semester"})

            subjects = semester.subjects.all()
            total_subjects = subjects.count()

            from lms.models import Assignment, Submission

            total_assignments = Assignment.objects.filter(subject__semester=semester).count()

            submitted_assignments = Submission.objects.filter(student=user).count()

            pending_assignments = total_assignments - submitted_assignments


            data = {
                "role": "student",
                "id": user.id,
                "name": user.username,
                "email": user.email,
                "program": semester.program.name,
                "semester": f"Semester {semester.semester_number}",
                "total_subjects": total_subjects,
                "total_assignments": total_assignments,
                "submitted_assignments": submitted_assignments,
                "pending_assignments": pending_assignments,
                "subjects": [
                    {
                        "id": sub.id,
                        "subject_name": sub.subject_name,
                        "subject_code": sub.subject_code
                    }
                    for sub in subjects
                ]
            }

            serializer = StudentDashboardSerializer(data)
            return Response(serializer.data)

        # FACULTY DASHBOARD
        elif user.role == "faculty":

            subjects = user.subject_set.all()
            subject_data = []

            for sub in subjects:
                semester = sub.semester
                student_count = semester.students.count()

                subject_data.append({
                    "id": sub.id,
                    "subject_code": sub.subject_code,
                    "subject_name": sub.subject_name,
                    "program": semester.program.name,
                    "semester": f"Semester {semester.semester_number}",
                    "student_count": student_count
                })
            from lms.models import Assignment, Submission

            subjects = user.subject_set.all()

            subjects_handled = subjects.count()

            assignments_created = Assignment.objects.filter(created_by=user).count()

            total_submissions = Submission.objects.filter(
                assignment__subject__faculty=user
            ).count()
            data = {
                "role": "faculty",
                "id": user.id,
                "name": user.username,
                "email": user.email,

                "subjects_handled": subjects_handled,
                "assignments_created": assignments_created,
                "total_submissions": total_submissions,

                "subjects": subject_data
            }


            serializer = FacultyDashboardSerializer(data)
            return Response(serializer.data)

        # ADMIN DASHBOARD
        elif user.role == "admin":
            data = {
                "role": "admin",  # 🔥 THIS WAS MISSING
                "total_students": CustomUser.objects.filter(role="student").count(),
                "total_faculty": CustomUser.objects.filter(role="faculty").count(),
                "total_programs": Program.objects.count(),
                "total_subjects": Subject.objects.count(),
            }

            return Response(data)
        

        return Response({"error": "Invalid role"}, status=400)


# ======================
# PROFILE VIEW
# ======================
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "username": user.username,
            "email": user.email,
            "role": user.role
        })
# ======================
# ADMIN SEMESTER CRUD
# ======================
class AdminSemesterView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if request.user.role != "admin":
            return Response({"error": "Only admin allowed"}, status=403)

        # If single semester requested
        if pk:
            try:
                semester = Semester.objects.select_related("program").get(pk=pk)
            except Semester.DoesNotExist:
                return Response({"error": "Not found"}, status=404)

            return Response({
                "id": semester.id,
                "semester_number": semester.semester_number,
                "program_id": semester.program.id,
                "program_name": semester.program.name
            })

        # Otherwise return all semesters
        semesters = Semester.objects.select_related("program").all()

        data = [
            {
                "id": s.id,
                "semester_number": s.semester_number,
                "program_id": s.program.id,
                "program_name": s.program.name
            }
            for s in semesters
        ]

        return Response(data)

    def post(self, request):
        if request.user.role != "admin":
            return Response({"error": "Only admin allowed"}, status=403)

        semester_number = request.data.get("semester_number")
        program_id = request.data.get("program_id")

        if not semester_number or not program_id:
            return Response(
                {"error": "semester_number and program_id required"},
                status=400
            )

        try:
            program = Program.objects.get(id=program_id)
        except Program.DoesNotExist:
            return Response({"error": "Invalid program"}, status=400)

        semester = Semester.objects.create(
            semester_number=semester_number,
            program=program
        )

        return Response({
            "id": semester.id,
            "semester_number": semester.semester_number,
            "program": semester.program.name
        }, status=201)
    def put(self, request, pk=None):
        if request.user.role != "admin":
            return Response({"error": "Only admin allowed"}, status=403)

        try:
            semester = Semester.objects.get(pk=pk)
        except Semester.DoesNotExist:
            return Response({"error": "Semester not found"}, status=404)

        semester.semester_number = request.data.get(
            "semester_number", semester.semester_number
    )

        program_id = request.data.get("program_id")
        if program_id:
                semester.program = Program.objects.get(pk=program_id)

        semester.save()

        return Response({
            "id": semester.id,
            "semester_number": semester.semester_number,
            "program": semester.program.id
        })
    
    def delete(self, request, pk=None):
        if request.user.role != "admin":
            return Response({"error": "Only admin allowed"}, status=403)
        try:
            semester = Semester.objects.get(pk=pk)
            semester.delete()
            return Response({"message": "Deleted"}, status=200)
        except Semester.DoesNotExist:
            return Response({"error": "Not found"}, status=404)


# ======================
# ADMIN SUBJECT CRUD
# ======================
class AdminSubjectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "admin":
            return Response({"error": "Only admin allowed"}, status=403)

        subjects = Subject.objects.select_related("semester", "faculty").all()

        data = [
            {
                "id": s.id,
                "subject_code": s.subject_code,
                "subject_name": s.subject_name,
                "semester": s.semester.id,
                "semester_number": s.semester.semester_number,
                "faculty": s.faculty.id if s.faculty else None,
                "faculty_name": s.faculty.username if s.faculty else None
            }
            for s in subjects
        ]

        return Response(data)


    def post(self, request):

        if request.user.role != "admin":
            return Response({"error": "Only admin allowed"}, status=403)

        subject_code = request.data.get("subject_code")
        subject_name = request.data.get("subject_name")
        program_id = request.data.get("program")
        semester_id = request.data.get("semester")
        faculty_id = request.data.get("faculty")

        if not subject_code or not subject_name or not program_id or not semester_id:
            return Response({"error": "Missing fields"}, status=400)

        try:
            program = Program.objects.get(id=program_id)
            semester = Semester.objects.get(id=semester_id)
        except:
            return Response({"error": "Invalid program or semester"}, status=400)

        faculty = None
        if faculty_id:
            faculty = CustomUser.objects.filter(id=faculty_id, role="faculty").first()

        subject = Subject.objects.create(
            program=program,
            semester=semester,
            subject_code=subject_code,
            subject_name=subject_name,
            faculty=faculty
        )

        return Response({
            "id": subject.id,
            "subject_code": subject.subject_code,
            "subject_name": subject.subject_name
        }, status=201)


    def delete(self, request, pk):

        if request.user.role != "admin":
            return Response({"error": "Only admin allowed"}, status=403)

        try:
            subject = Subject.objects.get(id=pk)
            subject.delete()
            return Response({"message": "Subject deleted"})
        except Subject.DoesNotExist:
            return Response({"error": "Subject not found"}, status=404)
# ======================
# ADMIN USER CREATE
# ======================

class AdminUserView(APIView):
    permission_classes = [IsAuthenticated]

    # ================= GET USERS =================
    def get(self, request):

        if request.user.role != "admin":
            return Response({"error": "Only admin allowed"}, status=403)

        users = CustomUser.objects.select_related("semester").all()

        data = []

        for u in users:

            subject = Subject.objects.filter(faculty=u).select_related("semester__program").first()

            program = None
            semester = None
            subject_name = None

            if u.role == "student" and u.semester:
                program = u.semester.program.name
                semester = u.semester.semester_number

            if subject:
                subject_name = subject.subject_name
                program = subject.semester.program.name
                semester = subject.semester.semester_number

            data.append({
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "role": u.role,
                "program": program,
                "semester": semester,
                "subject": subject_name
            })

        return Response(data)


    # ================= CREATE USER =================
    def post(self, request):

        if request.user.role != "admin":
            return Response({"error": "Only admin allowed"}, status=403)

        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        role = request.data.get("role")

        semester_id = request.data.get("semester")
        subject_id = request.data.get("subject")

        if not username or not email or not password or not role:
            return Response({"error": "Missing required fields"}, status=400)

        semester = None
        if semester_id:
            semester = Semester.objects.filter(id=semester_id).first()

        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role,
            semester=semester
        )

        # Assign subject to faculty
        if role == "faculty" and subject_id:
            subject = Subject.objects.filter(id=subject_id).first()

            if subject:
                subject.faculty = user
                subject.save()

        return Response({
            "message": "User created successfully",
            "id": user.id,
            "username": user.username,
            "role": user.role
        }, status=201)


    # ================= DELETE USER =================
    def delete(self, request, pk=None):

        if request.user.role != "admin":
            return Response({"error": "Only admin allowed"}, status=403)

        try:
            user = CustomUser.objects.get(pk=pk)
            user.delete()
            return Response({"message": "User deleted"})
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)