from django.shortcuts import render
from django.http import HttpResponse, HttpRequest
from .models import Book, tags, review
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