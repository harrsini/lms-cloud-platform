from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser


# 🔐 LOGIN SERIALIZER
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        data["user"] = user
        return data


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# 📊 DASHBOARD SERIALIZERS
class StudentDashboardSerializer(serializers.Serializer):
    role = serializers.CharField()
    id = serializers.IntegerField()
    name = serializers.CharField()
    email = serializers.EmailField()
    program = serializers.CharField()
    semester = serializers.CharField()

    total_subjects = serializers.IntegerField()
    total_assignments = serializers.IntegerField()
    submitted_assignments = serializers.IntegerField()
    pending_assignments = serializers.IntegerField()

    subjects = serializers.ListField()



class FacultyDashboardSerializer(serializers.Serializer):
    role = serializers.CharField()
    id = serializers.IntegerField()
    name = serializers.CharField()
    email = serializers.EmailField()

    subjects_handled = serializers.IntegerField()
    assignments_created = serializers.IntegerField()
    total_submissions = serializers.IntegerField()

    subjects = serializers.ListField()


class AdminDashboardSerializer(serializers.Serializer):
    total_students = serializers.IntegerField()
    total_faculty = serializers.IntegerField()
    total_programs = serializers.IntegerField()
    total_subjects = serializers.IntegerField()


class UserSerializer(serializers.ModelSerializer):
    semester = serializers.SerializerMethodField()
    program_name = serializers.CharField(source="program.name", read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "role", "program_name", "subject_name","semester",]

    def get_semester(self, obj):
        if obj.semester:
            return obj.semester.id
        return None
