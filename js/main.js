var settings = {
	hero: {},
	cardsIdCpt: 0,
	nb_CardsInHand_start: 3,
	nb_CardsInHand_max: 5,
	floor_level: 1,
	nb_rooms_per_floor: 12
};

var heroes = [
	{
		name: 'Seeryn',
		hpmax: 20,
		hp: 18,
		def: 0
	},
	{
		name: 'Pi',
		hpmax: 20,
		hp: 18,
		def: 0
	},
	{
		name: 'Margo',
		hpmax: 30,
		hp: 27,
		def: 0
	}
];
var heroesMapByName = new Map();
for (var i = 0; i < heroes.length; i++) {
	heroesMapByName.set(heroes[i].name, heroes[i]);
}

$(document).ready(function() {
	$('.char').click(function(ev) {
		settings.hero = heroesMapByName.get(ev.currentTarget.id);
		// TODO adjust settings by hero (nb_CardsInHand_max ?)
		localStorage.settings = JSON.stringify(settings);
		window.location.href = 'page.html';

	});
});
