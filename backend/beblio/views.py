from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse, HttpRequest, JsonResponse
from .models import Book, Tags, Review, User, Admin, Cart
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime
from decimal import Decimal

# Add this constant at the top
TAX_RATE = Decimal('0.08')  # 8% tax rate

@csrf_exempt
def books(request: HttpRequest) -> HttpResponse:
    if request.method == 'GET':
        try:
            books_data = Book.objects.all()
            books_list = []
            for book in books_data:
                try:
                    book_dict = {
                        'id': book.id,
                        'title': book.title,
                        'author': book.author,
                        'isbn': book.isbn,
                        'pages': book.pages,
                        'cover_image': book.cover_image,
                        'language': book.language,
                        'description': book.description,
                        'rating': float(book.rating) if book.rating else 0,
                        'publisher': book.publisher,
                        'published_date': book.published_date.strftime('%Y-%m-%d') if book.published_date else None,
                        'in_stock': book.in_stock,
                        'quote': book.quote,
                        'tags': list(book.tags.values_list('name', flat=True)),
                        'genre': book.genre,
                        'price': float(book.price)
                    }
                    books_list.append(book_dict)
                except Exception as e:
                    print(f"Error processing book {book.id}: {str(e)}")
                    continue
            
            return JsonResponse(books_list, safe=False)
            
        except Exception as e:
            print(f"Error loading books: {str(e)}")  # Add debugging
            return JsonResponse({
                'error': 'Failed to load books',
                'details': str(e)
            }, status=500)
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
            genre=books_json.get('genre'),
            price=books_json.get('price')
        )
        book.save()
        tags_list = books_json.get('tags', [])
        for tag_name in tags_list:
            tag, created = Tags.objects.get_or_create(name=tag_name)
            book.tags.add(tag)
        review_list = books_json.get('review', [])
        for review_data in review_list:
            review_obj = Review(
                user=review_data.get('user'),
                rating=review_data.get('rating'),
                comment=review_data.get('comment')
            )
            review_obj.save()
            book.review.add(review_obj)
        return HttpResponse(status=201)

@csrf_exempt
def get_books(request: HttpRequest) -> HttpResponse:
    books_data = Book.objects.all() 
    
    
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
            'genre' : book.genre,
            'price' : book.price
        }
        books_list.append(book_dict)

        
    return JsonResponse({"books" : books_list})


## Abdallah :

def index (request ) :
    return render(request, 'index.html')

def book_list(request):
    return render(request, 'books/bookList.html')

def book_detail(request, book_id):
    try:
        print(f"Attempting to load book with ID: {book_id}")
        # Get the specific book by ID
        book = Book.objects.select_related().prefetch_related('tags', 'review').get(id=book_id)
        
        # Convert book data into a format matching our JavaScript structure
        book_data = {
            'id': book.id,
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
            'genre': book.genre if book.genre else '',
            'price': float(book.price) if book.price else 4.99,
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
        
        return render(request, 'books/bookDetails.html', context)
        
    except Book.DoesNotExist:
        return render(request, 'books/bookDetails.html', {
            'error': f'Book with ID {book_id} not found'
        })
    except Exception as e:
        return render(request,'books/bookDetails.html', {
            'error': f'Error loading book details: {str(e)}'
        })

def admin_panel(request):
    return render(request, 'admin/adminPanel.html')

def user_profile(request):
    return render(request, 'user/userProfile.html')

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
    
    return render(request, 'auth/signup.html')

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
                    # If admin credentials are correct, set session and redirect to admin panel
                    request.session['user_id'] = admin.admin_id
                    request.session['is_admin'] = True
                    return JsonResponse({
                        'message': 'Login successful',
                        'is_admin': True,
                        'redirect': '/adminPanel/',
                        'user_name': f"{admin.firstname} {admin.lastname}"
                    })
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
                        request.session['user_id'] = user.user_id
                        request.session['is_admin'] = False
                        return JsonResponse({
                            'message': 'Login successful',
                            'is_admin': False,
                            'redirect': '/bookList/',
                            'user_name': f"{user.firstname} {user.lastname}"
                        })
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

    return render(request, 'auth/login.html')

def forgotPassword(request):
    return render(request, 'auth/forgotPassword.html')

def resetPassword(request):
    return render(request, 'auth/resetPassword.html')

def aboutUs(request):
    return render(request, 'footers/aboutUs.html')

def contactUs(request):
    return render(request, 'footers/contactUs.html')

def privacyPolicy(request):
    return render(request, 'footers/privacy.html')

def termsOfUse(request):
    return render(request, 'footers/terms.html')

def  help(request):
    return render(request, 'footers/help.html')

def paymentMethod(request):
    return render(request, 'cart/paymentMethod.html')

@csrf_exempt
def cart(request):
    """View for displaying the shopping cart page."""
    # Get the user from session
    user_id = request.session.get('user_id')
    
    if not user_id:
        # If user is not logged in, show empty cart template
        return render(request, 'cart/cart.html')
    
    try:
        # Get the user and their cart items
        user = User.objects.get(user_id=user_id)
        cart_items = Cart.objects.filter(user=user).select_related('book')
        
        # Calculate cart totals
        subtotal = sum(Decimal(str(item.book.price)) * item.quantity for item in cart_items)
        tax = subtotal * TAX_RATE
        total = subtotal + tax
        
        # Pass data to template
        context = {
            'cart_items': cart_items,
            'subtotal': subtotal,
            'tax': tax,
            'total': total,
        }
        
        return render(request, 'cart/cart.html', context)
        
    except User.DoesNotExist:
        return render(request, 'cart/cart.html')
    except Exception as e:
        print(f"Error loading cart: {str(e)}")
        return render(request, 'cart/cart.html', {'error': str(e)})

@csrf_exempt
def add_to_cart(request):
    """Add a book to the user's cart via AJAX."""
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    # Get the user from session
    user_id = request.session.get('user_id')
    
    if not user_id:
        return JsonResponse({'error': 'Please login to add items to cart'}, status=401)
    
    try:
        data = json.loads(request.body)
        print("add_to_cart received data:", data)  # <--- Add this line
        book_id = data.get('book_id')
        quantity = data.get('quantity', 1)
        
        # Validate book existence
        book = get_object_or_404(Book, id=book_id)
        
        # Get user
        user = User.objects.get(user_id=user_id)
        
        # Check if book already in cart
        cart_item, created = Cart.objects.get_or_create(
            user=user,
            book=book,
            defaults={'quantity': quantity}
        )
        
        # If book was already in cart, increase quantity
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        # Calculate new cart totals
        cart_items = Cart.objects.filter(user=user)
        subtotal = sum(Decimal(str(item.book.price)) * item.quantity for item in cart_items)
        tax = subtotal * TAX_RATE
        total = subtotal + tax
        
        return JsonResponse({
            'success': True,
            'message': 'Book added to cart',
            'cart_count': cart_items.count(),
            'subtotal': float(subtotal),
            'tax': float(tax),
            'total': float(total)
        })
        
    except Book.DoesNotExist:
        return JsonResponse({'error': 'Book not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        print("add_to_cart error:", str(e))  # <--- Add this line
        print(f"Error adding to cart: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def update_cart(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    # Get the user from session
    user_id = request.session.get('user_id')
    
    if not user_id:
        return JsonResponse({'error': 'Please login to update cart'}, status=401)
    
    try:
        data = json.loads(request.body)
        cart_item_id = data.get('cart_item_id')
        quantity = int(data.get('quantity'))
        
        # Get user
        user = User.objects.get(user_id=user_id)
        
        # Get cart item and verify ownership
        cart_item = get_object_or_404(Cart, id=cart_item_id, user=user)
        
        # Handle quantity changes
        if quantity <= 0:
            # Remove item if quantity is 0 or negative
            cart_item.delete()
            message = 'Item removed from cart'
        else:
            # Update quantity
            cart_item.quantity = quantity
            cart_item.save()
            message = 'Cart updated'
        
        # Calculate new cart totals
        cart_items = Cart.objects.filter(user=user)
        subtotal = sum(item.book.price * item.quantity for item in cart_items)
        tax = subtotal * TAX_RATE
        total = subtotal + tax
        
        return JsonResponse({
            'success': True,
            'message': message,
            'item_price': float(cart_item.book.price) if quantity > 0 else 0,
            'subtotal': float(subtotal),
            'tax': float(tax),
            'total': float(total)
        })
        
    except Cart.DoesNotExist:
        return JsonResponse({'error': 'Cart item not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        print(f"Error updating cart: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def remove_from_cart(request):
    """Remove an item from the cart."""
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    # Get the user from session
    user_id = request.session.get('user_id')
    
    if not user_id:
        return JsonResponse({'error': 'Please login to remove items'}, status=401)
    
    try:
        data = json.loads(request.body)
        cart_item_id = data.get('cart_item_id')
        
        # Get user
        user = User.objects.get(user_id=user_id)
        
        # Get cart item and verify ownership
        cart_item = get_object_or_404(Cart, id=cart_item_id, user=user)
        
        # Remove the item
        cart_item.delete()
        
        # Calculate new cart totals
        cart_items = Cart.objects.filter(user=user)
        subtotal = sum(item.book.price * item.quantity for item in cart_items)
        tax = subtotal * TAX_RATE
        total = subtotal + tax
        
        return JsonResponse({
            'success': True,
            'message': 'Item removed from cart',
            'subtotal': float(subtotal),
            'tax': float(tax),
            'total': float(total)
        })
        
    except Cart.DoesNotExist:
        return JsonResponse({'error': 'Cart item not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        print(f"Error removing from cart: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def complete_order(request):
    """Process the checkout and complete the order."""
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    # Get the user from session
    user_id = request.session.get('user_id')
    
    if not user_id:
        return JsonResponse({'error': 'Please login to complete checkout'}, status=401)
    
    try:
        data = json.loads(request.body)
        
        # Get user and cart items
        user = User.objects.get(user_id=user_id)
        cart_items = Cart.objects.filter(user=user)
        
        if not cart_items.exists():
            return JsonResponse({'error': 'Your cart is empty'}, status=400)
        
        # Process payment information
        payment_method = data.get('payment_method', '')
        
        # Here you would typically:
        # 1. Create an Order model instance
        # 2. Create OrderItems from cart items
        # 3. Process payment through a payment gateway
        # 4. Mark order as paid if successful
        
        # For this example, we'll just clear the cart
        # In a real app, you'd save the order details before clearing
        
        # Generate a random order number for demonstration
        order_number = f"CB-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Clear the cart after successful order
        cart_items.delete()
        
        # Store order info in session for the success page
        request.session['last_order'] = {
            'order_number': order_number,
            'order_date': datetime.now().strftime('%Y-%m-%d'),
            'payment_method': payment_method,
            # You'd include other order details here
        }
        
        return JsonResponse({
            'success': True,
            'message': 'Order completed successfully',
            'order_number': order_number,
            'redirect': '/orderSuccessful/'
        })
        
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        print(f"Error completing order: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

def orderSuccess(request):
    return render(request, 'cart/orderSuccessful.html')

@csrf_exempt
def book_operations(request, book_id=None):
    if request.method == 'DELETE':
        try:
            book = Book.objects.get(id=book_id)
            book.delete()
            return JsonResponse({'message': 'Book deleted successfully'})
        except Book.DoesNotExist:
            return JsonResponse({'error': 'Book not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    elif request.method == 'PUT':
        try:
            book = Book.objects.get(id=book_id)
            data = json.loads(request.body)
            
            # Update book fields
            for field, value in data.items():
                if field == 'tags':
                    book.tags.clear()
                    for tag_name in value:
                        tag, _ = Tags.objects.get_or_create(name=tag_name)
                        book.tags.add(tag)
                elif hasattr(book, field):
                    setattr(book, field, value)
            
            book.save()
            return JsonResponse({'message': 'Book updated successfully'})
        except Book.DoesNotExist:
            return JsonResponse({'error': 'Book not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def delete_book(request, book_id):
    if request.method == 'DELETE':
        try:
            book = Book.objects.get(id=book_id)
            book.delete()
            return JsonResponse({
                'message': 'Book deleted successfully'
            })
        except Book.DoesNotExist:
            return JsonResponse({
                'error': 'Book not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'error': str(e)
            }, status=500)
    return JsonResponse({
        'error': 'Method not allowed'
    }, status=405)

@csrf_exempt
def add_admin_page(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received data:", data)  # Debug print
            
            # Check if email already exists
            if Admin.objects.filter(email=data['email']).exists():
                return JsonResponse({
                    'error': 'Email already registered',
                    'field': 'email'
                }, status=400)

            # Create new admin
            admin = Admin.objects.create(
                firstname=data['firstname'],
                lastname=data['lastname'],
                email=data['email'],
                password=data['password']
            )
            
            return JsonResponse({
                'message': 'Admin created successfully',
                'redirect': '/adminPanel/'
            })

        except Exception as e:
            print(f"Error creating admin: {str(e)}")  # Debug print
            return JsonResponse({
                'error': str(e),
                'field': 'email'
            }, status=400)
    
    # For GET requests, render the add admin form
    return render(request, 'admin/addAdmin.html')

@csrf_exempt
def logout(request):
    if request.method == 'POST':
        try:
            # Clear session if you're using session-based auth
            request.session.flush()
            return JsonResponse({'message': 'Logged out successfully'})
        except Exception as e:
            print(f"Error during logout: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def book_form(request, book_id=None):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            if book_id:
                # Update existing book
                book = Book.objects.get(id=book_id)
                for field, value in data.items():
                    if field == 'tags':
                        book.tags.clear()
                        for tag_name in value:
                            tag, _ = Tags.objects.get_or_create(name=tag_name)
                            book.tags.add(tag)
                    elif hasattr(book, field):
                        setattr(book, field, value)
                book.save()
                return JsonResponse({'message': 'Book updated successfully'})
            else:
                # Create new book
                book = Book.objects.create(
                    title=data.get('title'),
                    author=data.get('author'),
                    isbn=data.get('isbn'),
                    pages=data.get('pages'),
                    language=data.get('language'),
                    cover_image=data.get('cover_image'),
                    publisher=data.get('publisher'),
                    published_date=data.get('published_date'),
                    description=data.get('description'),
                    rating=data.get('rating'),
                    in_stock=data.get('in_stock', True),
                    quote=data.get('quote')
                )
                # Handle tags
                for tag_name in data.get('tags', []):
                    tag, _ = Tags.objects.get_or_create(name=tag_name)
                    book.tags.add(tag)
                return JsonResponse({'message': 'Book added successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        try:
            book = None
            if book_id:
                book = Book.objects.get(id=book_id)
            return render(request, 'admin/bookForm.html', {'book': book})
        except Book.DoesNotExist:
            return redirect('admin_panel')

