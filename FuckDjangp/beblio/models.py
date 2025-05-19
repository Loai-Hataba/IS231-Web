from django.db import models

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=200, null=True)
    author = models.CharField(max_length=100)
    published_date = models.DateField()
    isbn = models.CharField(max_length=13, unique=True)
    pages = models.IntegerField()
    cover_image = models.URLField(blank=True, null=True)
    language = models.CharField(max_length=30)
    tags = models.ManyToManyField('tags', blank=True)
    description = models.TextField(blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    publisher = models.CharField(max_length=100, blank=True, null=True)
    published_date = models.DateField(blank=True, null=True)
    in_stock = models.BooleanField(default=True)
    review = models.ManyToManyField('review', blank=True)
    quote = models.TextField(blank=True, null=True)
    details = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

class tags(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class review(models.Model):
    user = models.CharField(max_length=100)
    rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    comment = models.TextField()

    def __str__(self):
        return f"{self.user} - {self.book.title}"