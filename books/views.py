from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Book, UserProfile, RentedBook
from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm

def home(request):
    books = Book.objects.all()[:6]
    return render(request, 'books/index.html', {'books': books})
def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'books/signup.html', {'form': form})
@login_required
def user_profile(request):
    profile = UserProfile.objects.get(user=request.user)
    rented_books = RentedBook.objects.filter(user=request.user)
    wishlist = request.user.wishlist.all()[:4]
    return render(request, 'books/userprofile.html', {
        'profile': profile,
        'rented_books': rented_books,
        'wishlist': wishlist,
    })

def book_list(request):
    books = Book.objects.all()
    return render(request, 'books/booklist.html', {'books': books})

def about(request):
    return render(request, 'books/aboutUs.html')

def help_page(request):
    return render(request, 'books/footers/help.html')

def privacy(request):
    return render(request, 'books/footers/privacy.html')

def terms(request):
    return render(request, 'books/footers/terms.html')

def contact(request):
    return render(request, 'books/footers/contact.html')