var cardsType_enemies = [
	{
		id: 'rabite',
		type: 'enemy',
		name: 'rabite',
		img_name: 'rabite.gif',
		attack: 1,
		health: 3,
		xp: 5
	},
	{
		id: 'dinofish',
		type: 'enemy',
		name: 'dinofish',
		img_name: 'dinofish.gif',
		attack: 2,
		health: 1,
		xp: 4
	},
	{
		id: 'beastzombie',
		type: 'enemy',
		name: 'beastzombie',
		img_name: 'beastzombie.gif',
		attack: 2,
		health: 5,
		xp: 8
	},
];
cardsByTypeMap.set('enemies', cardsType_enemies);

var enemiesByNameMap = new Map();
for (var i = 0; i < cardsType_enemies.length; i++) {
	enemiesByNameMap.set(cardsType_enemies[i].name, cardsType_enemies[i]);
}
