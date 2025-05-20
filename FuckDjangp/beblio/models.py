from django.db import models
from django.contrib.auth.hashers import make_password, check_password

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

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Using 128 for hashed password
    created_at = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Hash password before saving
        if self._state.adding or self.password.startswith('pbkdf2_sha256$'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        """
        Verify if the given raw password matches the hashed password in database.
        
        Args:
            raw_password (str): The password to check
            
        Returns:
            bool: True if password matches, False otherwise
        """
        if not self.password or not raw_password:
            return False
            
        try:
            return check_password(raw_password, self.password)
        except ValueError:
            return False

    def __str__(self):
        return f"{self.firstname} {self.lastname}"

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'


