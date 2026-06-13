from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TripViewSet, 
    AccommodationViewSet, 
    TransportationViewSet, 
    ItineraryItemViewSet, 
    ChecklistViewSet, 
    ExpenseViewSet
)

# This sets up the router for all our API endpoints
router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'accommodations', AccommodationViewSet)
router.register(r'transportation', TransportationViewSet)
router.register(r'itinerary-items', ItineraryItemViewSet)
router.register(r'checklists', ChecklistViewSet)
router.register(r'expenses', ExpenseViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]