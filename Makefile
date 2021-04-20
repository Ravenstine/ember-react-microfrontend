start:
	npm --prefix="./ember-app" run build && \
	rm -rf ./react-app/public/ember-app && \
	cp -r ./ember-app/dist/ ./react-app/public/ember-app && \
	npm --prefix="./react-app" run start
