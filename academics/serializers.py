from rest_framework import serializers
from .models import Program, Semester, Subject


class SubjectSerializer(serializers.ModelSerializer):
    semester_number = serializers.IntegerField(
        source="semester.semester_number", read_only=True
    )
    faculty_name = serializers.CharField(
        source="faculty.username", read_only=True
    )

    class Meta:
        model = Subject
        fields = [
            "id",
            "subject_code",
            "subject_name",
            "semester",
            "semester_number",
            "faculty",
            "faculty_name",
        ]


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = [
            "id",
            "program",
            "semester_number"
        ]


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = [
            "id",
            "name",
            "degree_type",
            "duration_years"
        ]