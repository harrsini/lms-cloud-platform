from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Notice
from .serializers import NoticeSerializer


# ==========================
# LIST NOTICES
# ==========================
class NoticeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        if user.role == "student":
            notices = Notice.objects.filter(target__in=["student", "all"])

        elif user.role == "faculty":
            notices = Notice.objects.filter(target__in=["faculty", "all"])

        elif user.role == "admin":
            notices = Notice.objects.all()

        else:
            notices = Notice.objects.filter(target="all")

        notices = notices.order_by("-created_at")

        serializer = NoticeSerializer(notices, many=True)
        return Response(serializer.data)


# ==========================
# CREATE NOTICE
# ==========================
class NoticeCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = NoticeSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==========================
# DELETE NOTICE
# ==========================
class NoticeDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            notice = Notice.objects.get(id=id)
        except Notice.DoesNotExist:
            return Response({"error": "Notice not found"}, status=404)

        notice.delete()
        return Response({"message": "Notice deleted successfully"})