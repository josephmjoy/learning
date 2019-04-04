
// general scaling
min + (max - min) * ((x - x_min) / (x_max - x_min))

// we will use 1 as the minimum value and 10 as the maximum value for scaling,
// so all scaled votes will fall into the range [1,10]

scaled_votes = 1 + 9 * ((x - x_min) / (x_max - x_min))

// NOTE: We CANNOT simply do 10 * ((x - x_min))..., results will be wrong
// Order of operations is important!

// use these values for scaling imdb.votes
x_max = 1521105
x_min = 5
min = 1
max = 10
x = imdb.votes

// within a pipeline, it should look something like the following
/*
  {
    $add: [
      1,
      {
        $multiply: [
          9,
          {
            $divide: [
              { $subtract: [<x>, <x_min>] },
              { $subtract: [<x_max>, <x_min>] }
            ]
          }
        ]
      }
    ]
  }
*/

// given we have the numbers, this is how to calculated normalized_rating
// yes, you can use $avg in $project and $addFields!
normalized_rating = average(scaled_votes, imdb.rating)


match = {
	'year': {$gte: 1990},
	'languages': 'English',
	'imdb.votes': {$gte: 1},
	'imdb.rating': {$gte: 1}

}

match2 = {
	'normalized_votes': {$lte: 1},
	'normalized_rating': {$lte: 1}
}

var x_max = 1521105
var x_min = 5


project = {
	_id: 0,
	title: 1,
	rating: '$imdb.rating',
	normalized_votes: {
	    $add: [
	      1,
	      {
		$multiply: [
		  9,
		  {
		    $divide: [
		      { $subtract: ['$imdb.votes', x_min] },
		      { $subtract: [x_max, x_min] }
		    ]
		  }
		]
	      }
	    ]
	}
}

addFields = {
	normalized_rating: {$avg: ['$normalized_votes', '$rating']}
}

pipeline = [
        {$match: match}, {$project: project}, {$addFields: addFields}, {$match: match2}
]

pipeline = [
        {$match: match}, {$project: project}, {$addFields: addFields},
	{$sort: {normalized_rating: 1}}
]


db.movies.findOne({'imdb.rating': {$lte: 1}, 'imdb.votes': {$lte: 1}, 'year': {$gte: 1990}})
