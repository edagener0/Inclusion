install:
	pip install -r requirements.txt

migrate: add_all_cron
	cd src && python3 manage.py makemigrations
	cd src && python3 manage.py migrate

add_all_cron:
	cd src && python3 manage.py crontab add

remove_all_cron:
	cd src && python3 manage.py crontab remove
	
run: migrate 
	cd src && python3 manage.py runserver

test: migrate
	cd src && python3 manage.py test