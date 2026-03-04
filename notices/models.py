from django.db import models
from users.models import CustomUser


class Notice(models.Model):

    TARGET_CHOICES = [
    ("all", "All"),
    ("student", "Students"),
    ("faculty", "Faculty"),
    ("admin", "Admins"),
]

    title = models.CharField(max_length=255)
    message = models.TextField()
    target = models.CharField(max_length=20, choices=TARGET_CHOICES, default="all")

    created_by = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title