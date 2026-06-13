from django.contrib import admin
from .models import Trip, Accommodation, Transportation, ItineraryItem, Checklist, Expense

admin.site.register(Trip)
admin.site.register(Accommodation)
admin.site.register(Transportation)
admin.site.register(ItineraryItem)
admin.site.register(Checklist)
admin.site.register(Expense)
    
