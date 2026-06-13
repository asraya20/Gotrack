from rest_framework import serializers
from .models import Trip, Accommodation, Transportation, ItineraryItem, Checklist, Expense
from django.contrib.auth.models import User
# --- Child Serializers ---

class AccommodationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accommodation
        fields = ['id', 'property_name', 'address', 'confirmation_code', 'check_in_time', 'check_out_time']

class TransportationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transportation
        fields = ['id', 'transport_mode', 'provider', 'booking_ref', 'departure_location', 'arrival_location', 'departure_time_utc', 'arrival_time_utc']

class ItineraryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryItem
        fields = ['id','trip', 'item_type', 'title', 'start_time_utc', 'end_time_utc', 'accommodation', 'transport']


class ChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checklist
        # --- THIS IS THE FIX ---
        # We've added 'trip' to the list of fields. Now the serializer
        # will correctly accept the trip ID from the front-end request.
        fields = ['id', 'trip', 'task_description', 'is_completed']


class ExpenseSerializer(serializers.ModelSerializer):
    payer_username = serializers.ReadOnlyField(source='payer.username')
    class Meta:
        model = Expense
        fields = [
            'id', 'trip', 'payer', 'payer_username', 'description', 
            'category', 'amount', 'currency', 'expense_date'
        ]
        read_only_fields = ['payer']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # We only expose the fields that are safe for a user to change
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        # The username should not be changeable after creation
        read_only_fields = ['username']

# --- Main Parent Serializer ---

class TripSerializer(serializers.ModelSerializer):
    accommodations = AccommodationSerializer(many=True, read_only=True)
    transportation = TransportationSerializer(many=True, read_only=True)
    itinerary_items = ItineraryItemSerializer(many=True, read_only=True)
    checklists = ChecklistSerializer(many=True, read_only=True)
    expenses = ExpenseSerializer(many=True, read_only=True)
    owner_username = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Trip
        fields = [
            'id', 'owner_username', 'trip_name', 'start_date', 'end_date',
            'accommodations', 'transportation', 'itinerary_items', 
            'checklists', 'expenses'
        ]