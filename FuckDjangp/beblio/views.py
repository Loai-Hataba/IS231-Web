from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from .models import Book, tags, review, User
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
import json
# Create your views here.
@csrf_exempt
def books(request: HttpRequest) -> HttpResponse:
    if request.method == 'GET':
        books_data = Book.objects.all()
        books_json = serialize('json', books_data)
        response = HttpResponse(books_json, content_type='application/json')
        return response
    elif request.method == 'POST':
        # Handle POST request to add a new book
        books_json = json.loads(request.body)
        book = Book(
            title=books_json.get('title'),
            author=books_json.get('author'),
            published_date=books_json.get('published_date'),
            isbn=books_json.get('isbn'),
            pages=books_json.get('pages'),
            cover_image=books_json.get('cover_image'),
            language=books_json.get('language'),
            description=books_json.get('description'),
            rating=books_json.get('rating'),
            publisher=books_json.get('publisher'),
            in_stock=books_json.get('in_stock', True),
            quote=books_json.get('quote'),
            details=books_json.get('details')
        )
        book.save()
        tags_list = books_json.get('tags', [])
        for tag_name in tags_list:
            tag, created = tags.objects.get_or_create(name=tag_name)
            book.tags.add(tag)
        review_list = books_json.get('review', [])
        for review_data in review_list:
            review_obj = review(
                user=review_data.get('user'),
                rating=review_data.get('rating'),
                comment=review_data.get('comment')
            )
            review_obj.save()
            book.review.add(review_obj)
        return HttpResponse(status=201)



## Abdallah :

def index (request ) :
    return render(request, 'beblio/index.html')

def book_list(request):
    return render(request, 'beblio/booklist.html')

def book_detail(request):
    return render(request, 'beblio/bookDetails.html')

def admin_panel(request):
    return render(request, 'beblio/AdminPanel.html')

def user_profile(request):
    return render(request, 'beblio/UserProfile.html')

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Check if email already exists
            if User.objects.filter(email=data['email']).exists():
                return JsonResponse({
                    'error': 'Email already registered',
                    'field': 'email'
                }, status=400)

            # Create new user using our custom User model
            user = User.objects.create(
                firstname=data.get('firstname'),
                lastname=data.get('lastname'),
                email=data.get('email'),
                password=data.get('password'),
                is_admin=data.get('is_admin', False)
            )
            
            return JsonResponse({'message': 'User created successfully'}, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return render(request, 'beblio/signup.html')

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            try:
                user = User.objects.get(email=email)
                if user.check_password(password):  # This uses Django's password verification
                    request.session['user_id'] = user.user_id
                    return JsonResponse({'message': 'Login successful'}, status=200)
                else:
                    return JsonResponse({
                        'error': 'Invalid password',
                        'field': 'password'
                    }, status=400)
            except User.DoesNotExist:
                return JsonResponse({
                    'error': 'Email not found',
                    'field': 'email'
                }, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return render(request, 'beblio/login.html')

def forgotPassword(request):
    return render(request, 'beblio/forgot_password.html')

def resetPassword(request):
    return render(request, 'beblio/reset_password.html')

def aboutUs(request):
    return render(request, 'beblio/aboutUs.html')

def contactUs(request):
    return render(request, 'beblio/contactUs.html')

def privacyPolicy(request):
    return render(request, 'beblio/privacy.html')

def termsOfUse(request):
    return render(request, 'beblio/terms.html')

def  help(request):
    return render(request, 'beblio/help.html')

def paymentMethod(request):
    return render(request, 'beblio/PaymentMethod.html')

def cart(request):
    return render(request, 'beblio/Cart.html')

def orderSuccess(request):
    return render(request, 'beblio/OrderSuccessful.html')

## the third var context  for loading book details

