from rest_framework import serializers
from .models import Material, Assignment, Submission, Subject


# -----------------------------
# SUBJECT SERIALIZER (NEW)
# -----------------------------

class SubjectSerializer(serializers.ModelSerializer):
    total_assignments = serializers.SerializerMethodField()
    total_materials = serializers.SerializerMethodField()
    faculty_name = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = [
            'id',
            'subject_code',
            'subject_name',
            'semester',
            'faculty_name',
            'total_assignments',
            'total_materials',
        ]

    def get_total_assignments(self, obj):
        return obj.assignments.count()

    def get_total_materials(self, obj):
        return obj.materials.count()

    def get_faculty_name(self, obj):
        return obj.faculty.username if obj.faculty else None


# -----------------------------
# MATERIAL SERIALIZER
# -----------------------------

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = ['id', 'title', 'file', 'uploaded_at']


# -----------------------------
# ASSIGNMENT SERIALIZER
# -----------------------------

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'title', 'description', 'due_date']


# -----------------------------
# SUBMISSION SERIALIZER
# -----------------------------

class SubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.username", read_only=True)

    class Meta:
        model = Submission
        fields = ['id', 'student_name', 'file', 'submitted_at']
