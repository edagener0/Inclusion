install:
	pip install -r requirements.txt

migrate:
	cd src && python3 manage.py makemigrations
	cd src && python3 manage.py migrate

run: migrate
	cd src && python3 manage.py runserver
