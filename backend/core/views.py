from rest_framework import viewsets
from rest_framework import generics # Import generics
from django.contrib.auth.models import User # Import User model
from .serializers import UserProfileSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Trip, Accommodation, Transportation, ItineraryItem, Checklist, Expense
from .serializers import (
    TripSerializer, AccommodationSerializer, TransportationSerializer, 
    ItineraryItemSerializer, ChecklistSerializer, ExpenseSerializer
)

# This viewset will handle the main trip data
class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # This ensures that users can only see their own trips
        return Trip.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # When a new trip is created, automatically assign the logged-in user as the owner
        serializer.save(owner=self.request.user)


# This viewset handles all expense-related actions
class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return expenses for trips owned by the current user
        return Expense.objects.filter(trip__owner=self.request.user)

    # --- THIS IS THE FIX ---
    # When a new expense is created via the API, this method is called.
    # It automatically sets the 'payer' to the user who made the request.
    def perform_create(self, serializer):
        serializer.save(payer=self.request.user)


# --- Viewsets for all other models ---

class AccommodationViewSet(viewsets.ModelViewSet):
    queryset = Accommodation.objects.all()
    serializer_class = AccommodationSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Accommodation.objects.filter(trip__owner=self.request.user)

class TransportationViewSet(viewsets.ModelViewSet):
    queryset = Transportation.objects.all()
    serializer_class = TransportationSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Transportation.objects.filter(trip__owner=self.request.user)

class ItineraryItemViewSet(viewsets.ModelViewSet):
    queryset = ItineraryItem.objects.all()
    serializer_class = ItineraryItemSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return ItineraryItem.objects.filter(trip__owner=self.request.user)

class ChecklistViewSet(viewsets.ModelViewSet):
    queryset = Checklist.objects.all()
    serializer_class = ChecklistSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Checklist.objects.filter(trip__owner=self.request.user)
    
class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    View to retrieve or update the profile of the currently authenticated user.
    """
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # This method ensures that the user can only ever see their own profile
        return self.request.user