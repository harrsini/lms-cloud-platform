from django.db import models
from users.models import CustomUser


class Program(models.Model):
    name = models.CharField(max_length=100)
    degree_type = models.CharField(max_length=50)  # e.g., BSc, MSc
    duration_years = models.IntegerField()

    def __str__(self):
        return f"{self.degree_type} - {self.name}"


class Semester(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="semesters")
    semester_number = models.IntegerField()

    def __str__(self):
        return f"{self.program} - Semester {self.semester_number}"


class Subject(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name="subjects")
    subject_code = models.CharField(max_length=20)
    subject_name = models.CharField(max_length=100)
    faculty = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={'role': 'faculty'}
    )

    def __str__(self):
        return f"{self.subject_code} - {self.subject_name}"
