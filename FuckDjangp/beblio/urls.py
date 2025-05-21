# Abdallah : 
from django.urls import path
from . import views

urlpatterns = [
    path('' , views.index , name='index'),
    path('index.html', views.index, name='index_html'),
    path('bookList/', views.book_list, name='book_list'),
    path('getBooks/', views.get_books, name='get_books'),
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
    path('forgotPassword/', views.forgotPassword, name='forgotPassword'),
    path('resetPassword/', views.resetPassword, name='resetPassword'),
    path('books/', views.books, name='books'),
    path('paymentMethod/', views.paymentMethod, name='paymentMethod'),
    path('cart/', views.cart, name='cart'),
    path('orderSuccessful/', views.orderSuccess, name='orderSuccessful'),
    path('books/<int:book_id>/delete/', views.delete_book, name='delete_book'),
    path('add-admin/', views.add_admin_page, name='add_admin_page'),  # Update this URL
    path('logout/', views.logout, name='logout'),
    path('book/add/', views.book_form, name='add_book'),
    path('book/edit/<int:book_id>/', views.book_form, name='edit_book'),
]