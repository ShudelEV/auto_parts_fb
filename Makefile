# Use development settings for running django dev server.
export DJANGO_SETTINGS_MODULE=QuickBikeProject.settingsdev

# Initializes virtual environment with basic requirements.
prod:
	pip install -r requirements.txt
	npm install --production

# Installs development requirements.
dev:
	pip install -r requirements.txt
	pip install -r requirements-dev.txt
	npm install

# Runs development server.
# This step depends on `make dev`, however dependency is excluded to speed up dev server startup.
run:
	python ./manage.py runserver --settings=AutoPartsFB.settings_dev

# This step depends on `make shell`, however dependency is excluded to speed up dev server startup.
shell:
	python ./manage.py shell --settings=AutoPartsFB.settings_dev

# Creates migrations and migrates database.
# This step depends on `make dev`, however dependency is excluded to speed up dev server startup.
migrate:
	python ./manage.py makemigrations
	python ./manage.py migrate

devmigrate:
	python ./manage.py makemigrations --settings=AutoPartsFB.settings_dev
	python ./manage.py migrate --settings=AutoPartsFB.settings_dev

# Builds files for distribution which will be placed in /static/dist
build: prod migrate
	npm run build

# Cleans up folder by removing virtual environment, node modules and generated files.
clean:
	rm -rf node_modules
	rm -rf static/public

# Run linter
lint:
	@npm run lint --silent
