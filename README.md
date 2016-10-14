# Restup Front

Web, Mobile, Desktop client for Restup-api resource management

## Getting started

```sh
git clone https://github.com/ibandominguez/restup-front.git
cd restup-front
npm install
bower install
ionic serve
```

## Building platforms

```sh
ionic build
sed -i -- 's/url(..\/..\/fonts\//url(..\/fonts\//g' www/styles/*.css # font error { TODO: export to gulp task }
```

## Contributors

* Ibán Domínguez
* Alejandro Santana

## License

Private
