const express = require('express'),
      util = require('util'),
      googleMaps = require('@google/maps');

const History = require('../schemas/history'),
      Favorite = require('../schemas/favorite');

const router = express.Router();

const googleMapsClient = googleMaps.createClient({
    key: process.env.GOOGLE_MAPS_API_KEY
});

router.get('/', async (req, res, next) => {
    try {
        const favorites = await Favorite.find({});
        
        res.render('index', { results: favorites });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/autocomplete/:query', (req, res, next) => {
    googleMapsClient.placesQueryAutoComplete({
        input: req.params.query,
        language: 'ko',
    }, (err, response) => {
        if (err) next(err);
        else res.json(response.json.predictions);
    });
});

router.get('/search/:query', async (req, res, next) => {
    const googlePlaces = util.promisify(googleMapsClient.places),
          googlePlacesNearBy = util.promisify(googleMapsClient.placesNearby);

    const { lat, lng, type } = req.query;

    try {
        const history = new History({ query: req.params.query });
        await history.save();

        let response;

        if (lat && lng) {
            response = await googlePlacesNearBy({
                keyword: req.params.query,
                location: `${lat}, ${lng}`,
                rankby: 'distance',
                language: 'ko',
                type,
            });
        } else {
            response = await googlePlaces({
                query: req.params.query,
                language: 'ko',
                type,
            });
        }
        
        res.render('result', {
            title: `${req.params.query} 검색 결과`,
            results: response.json.results,
            query: req.params.query
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/location/:id/favorite', async (req, res, next) => {
    try {
        const favorite = await Favorite.create({
            placeId: req.params.id,
            name: req.body.name,
            location: [req.body.lng, req.body.lat] // 경도, 위도
        });

        res.send(favorite);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;