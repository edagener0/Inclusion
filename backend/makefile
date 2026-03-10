install:
	pip install -r requirements.txt

migrate:
	cd src && python3 manage.py makemigrations
	cd src && python3 manage.py migrate

add_all_cron:
	cd src && python3 manage.py crontab add

remove_all_cron:
	cd src && python3 manage.py crontab remove
run: migrate add_all_cron
	cd src && python3 manage.py runserver

test: migrate add_all_cron
	cd src && python3 manage.py test