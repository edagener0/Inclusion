install:
	pip install -r requirements.txt

migrate: add_all_cron
	python3 src/manage.py makemigrations
	python3 src/manage.py migrate

scrape:
	python3 src/manage.py scrape_words

gen_wordle_4_today:
	python3 src/manage.py generate_daily_wordle --days 0

add_all_cron:
	python3 src/manage.py crontab add

remove_all_cron:
	python3 src/manage.py crontab remove
	
run: migrate gen_wordle_4_today 
	python3 src/manage.py runserver

test: migrate gen_wordle_4_today
	cd src && python3 manage.py test

init: migrate scrape
deploy:
	uvicorn inclusion.asgi:application --app-dir src --host 0.0.0.0 --port 8000