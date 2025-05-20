from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from .models import Book, tags, review, User, Admin
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
import json
# Create your views here.
@csrf_exempt
def books(request: HttpRequest) -> HttpResponse:
    if request.method == 'GET':
        # Check if we're filtering by tags
        tag_names = request.GET.get('tags', '').split(',')
        if tag_names and tag_names[0]:  # If we have tags to filter by
            books_data = Book.objects.filter(tags__name__in=tag_names).distinct()
        else:
            books_data = Book.objects.all()
        
        # Convert to list of dictionaries for JSON serialization
        books_list = []
        for book in books_data:
            book_dict = {
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'published_date': book.published_date.strftime('%Y-%m-%d') if book.published_date else None,
                'isbn': book.isbn,
                'pages': book.pages,
                'cover_image': book.cover_image,
                'language': book.language,
                'description': book.description,
                'rating': float(book.rating) if book.rating else 0,
                'publisher': book.publisher,
                'in_stock': book.in_stock,
                'quote': book.quote,
                'tags': list(book.tags.values_list('name', flat=True)),
                'genre' : book.genre 
            }
            books_list.append(book_dict)
        
        return JsonResponse(books_list, safe=False)
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
            genre=books_json.get('genre')
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

def book_detail(request, book_id):
    try:
        print(f"Attempting to load book with ID: {book_id}")
        # Get the specific book by ID
        book = Book.objects.select_related().prefetch_related('tags', 'review').get(id=book_id)
        
        # Convert book data into a format matching our JavaScript structure
        book_data = {
            'title': book.title,
            'author': book.author,
            'rating': float(book.rating) if book.rating else 0,
            'publisher': book.publisher,
            'publishDate': book.published_date.strftime('%Y-%m-%d') if book.published_date else '',
            'pages': book.pages,
            'language': book.language,
            'isbn': book.isbn,
            'tags': list(book.tags.values_list('name', flat=True)),
            'description': book.description,
            'inStock': book.in_stock,
            'imagePath': book.cover_image if book.cover_image else '',
            'reviews': [{
                'reviewer': review.user,
                'rating': float(review.rating) if review.rating else 0,
                'text': review.comment,
                'date': '2023-01-01'  # You might want to add a date field to your review model
            } for review in book.review.all()],
            'quotes': [book.quote] if book.quote else [],
        }
        
        context = {
            'book': book_data,
            'book_json': json.dumps(book_data)
        }
        print(f"finished loading book with ID: {book_id}")
        
        return render(request, 'beblio/bookDetails.html', context)
        
    except Book.DoesNotExist:
        return render(request, 'beblio/bookDetails.html', {
            'error': f'Book with ID {book_id} not found'
        })
    except Exception as e:
        return render(request, 'beblio/bookDetails.html', {
            'error': f'Error loading book details: {str(e)}'
        })

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

            # First check if it's an admin
            try:
                admin = Admin.objects.get(email=email)
                if admin.check_password(password):
                    # If admin credentials are correct, redirect to admin panel
                    return JsonResponse({
                        'message': 'Login successful',
                        'is_admin': True,
                        'redirect': '/adminPanel/'
                    }, status=200)
                else:
                    return JsonResponse({
                        'error': 'Invalid password',
                        'field': 'password'
                    }, status=400)
            except Admin.DoesNotExist:
                # If not admin, check regular users
                try:
                    user = User.objects.get(email=email)
                    if user.check_password(password):
                        return JsonResponse({
                            'message': 'Login successful',
                            'is_admin': False,
                            'redirect': '/bookList/'
                        }, status=200)
                    else:
                        return JsonResponse({
                            'error': 'Invalid password',
                            'field': 'password'
                        }, status=400)
                except User.DoesNotExist:
                    return JsonResponse({
                        'error': 'Account not found',
                        'field': 'email'
                    }, status=400)

        except Exception as e:
            print(f"Login error: {str(e)}")
            return JsonResponse({
                'error': str(e),
                'field': 'email'
            }, status=400)

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

