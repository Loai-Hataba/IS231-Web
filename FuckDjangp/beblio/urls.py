# from django.urls import path
# from .views import books


# urlpatterns = [
#     path('books/',books, name='books'),
# ]

# Abdallah : 
from django.urls import path
from . import views

urlpatterns = [
    path('' , views.index , name='index'),
    path('bookList/', views.book_list, name='book_list'),
    path('bookDetail/<int:book_id>/', views.book_detail, name='book_detail'),
    path('adminPanel/', views.admin_panel, name='admin_panel'),
    path('userProfile/', views.user_profile, name='user_profile'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('aboutUs/', views.aboutUs, name='aboutUs'),
    path('contactUs/', views.contactUs, name='contactUs'),
    path('privacyPolicy/', views.privacyPolicy, name='privacyPolicy'),
    path('termsOfUse/', views.termsOfUse, name='termsOfUse'),
    path('help/', views.help, name='help'),
]