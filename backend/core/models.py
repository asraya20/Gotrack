from django.db import models
from django.contrib.auth.models import User

class Trip(models.Model):
    owner = models.ForeignKey(User, related_name='trips', on_delete=models.CASCADE)
    trip_name = models.CharField(max_length=200)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.trip_name

class Accommodation(models.Model):
    trip = models.ForeignKey(Trip, related_name='accommodations', on_delete=models.CASCADE)
    property_name = models.CharField(max_length=255)
    address = models.TextField(blank=True)
    confirmation_code = models.CharField(max_length=100, blank=True)
    check_in_time = models.DateTimeField(null=True, blank=True)
    check_out_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.property_name

class Transportation(models.Model):
    trip = models.ForeignKey(Trip, related_name='transportations', on_delete=models.CASCADE)
    transport_mode = models.CharField(max_length=100)
    provider = models.CharField(max_length=100, blank=True)
    booking_ref = models.CharField(max_length=100, blank=True)
    departure_location = models.CharField(max_length=255)
    arrival_location = models.CharField(max_length=255)
    departure_time_utc = models.DateTimeField()
    arrival_time_utc = models.DateTimeField()

    def __str__(self):
        return f"{self.transport_mode} from {self.departure_location} to {self.arrival_location}"

class ItineraryItem(models.Model):
    trip = models.ForeignKey(Trip, related_name='itinerary_items', on_delete=models.CASCADE)
    accommodation = models.ForeignKey(Accommodation, on_delete=models.SET_NULL, null=True, blank=True)
    transport = models.ForeignKey(Transportation, on_delete=models.SET_NULL, null=True, blank=True)
    item_type = models.CharField(max_length=100)
    title = models.CharField(max_length=255)
    start_time_utc = models.DateTimeField()
    end_time_utc = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title

class Checklist(models.Model):
    trip = models.ForeignKey(Trip, related_name='checklists', on_delete=models.CASCADE)
    task_description = models.TextField()
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.task_description

class Expense(models.Model):
    trip = models.ForeignKey(Trip, related_name='expenses', on_delete=models.CASCADE)
    payer = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    category = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')
    expense_date = models.DateField()

    # This method is now correctly indented
    def __str__(self):
        return f"{self.description} - {self.amount} {self.currency}"

