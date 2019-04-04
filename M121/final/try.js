// Final question. Note: I added an $addFields stage because I couldn't figure out how to
// include the size of the 'airlines' array in the same group stage. Come to think of it,
// the size needs to be computed after the array is complete anyways, so it's correct to add it
// later.
pipeline = [
	{$match: {src_airport: {$in: ['JFK', 'LHR']}, dst_airport: {$in: ['JFK', 'LHR']}}},
	{$lookup: {from: 'air_alliances', localField: 'airline.name', foreignField: 'airlines', as: 'partners'}},
	{$group: {_id: '$partners.name', airlines: {$addToSet: '$airline.name'}}},
	{$addFields: {num: {$size: '$airlines'}}},
	{$sort: {num: -1}}
]
