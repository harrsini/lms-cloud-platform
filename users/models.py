from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):

    ROLE_CHOICES = (
        ("student", "Student"),
        ("faculty", "Faculty"),
        ("admin", "Admin"),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    # Student / Faculty semester
    semester = models.ForeignKey(
        "academics.Semester",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="students"
    )

    def __str__(self):
        return f"{self.username} - {self.role}"