var match = {
	'tomatoes.viewer.rating': {$gte: 3},
	// cast: { $elemMatch: { $exists: true } },
	countries: "USA",
	cast: {
        $in: favorites
      }
}

var project = {
	_id: 0,
	cast: 1,
	num_favs: {$size: {$setIntersection: ['$cast', favorites]}},
	rating: '$tomatoes.viewer.rating',
	title: 1
}

var sort = {
	num_favs: -1,
	rating: -1,
	title: -1
}


pipeline = [
	{$match: match}, {$project: project}, {$sort: sort}, {$skip: 24}, {$limit: 5}
]
