from django.db import models
from django.contrib.auth.models import User
from core.models import TimeStampedModel, Company

class Category(TimeStampedModel):
    """
    Product categories
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"

class Supplier(TimeStampedModel):
    """
    Suppliers/Vendors
    """
    name = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=100, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    
    def __str__(self):
        return self.name

class Product(TimeStampedModel):
    """
    Products/Items in inventory
    """
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, unique=True)  # Stock Keeping Unit
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    minimum_stock = models.IntegerField(default=10)  # Reorder level
    unit_of_measure = models.CharField(max_length=20, default='pcs')  # pieces, kg, liter, etc.
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} ({self.sku})"
    
    @property
    def is_low_stock(self):
        return self.stock_quantity <= self.minimum_stock

class StockMovement(TimeStampedModel):
    """
    Track inventory movements
    """
    MOVEMENT_TYPES = [
        ('in', 'Stock In'),
        ('out', 'Stock Out'),
        ('adjustment', 'Adjustment'),
        ('return', 'Return'),
    ]
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    movement_type = models.CharField(max_length=15, choices=MOVEMENT_TYPES)
    quantity = models.IntegerField()
    reference = models.CharField(max_length=100, blank=True)  # PO number, invoice, etc.
    notes = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.product.name} - {self.movement_type}: {self.quantity}"
    
    class Meta:
        ordering = ['-created_at']

# Create your models here.
