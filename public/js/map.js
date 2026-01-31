
maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
container: 'map',
style: maptilersdk.MapStyle.STREETS,
center:[-74.5, 40], // starting position [lng, lat]
});
