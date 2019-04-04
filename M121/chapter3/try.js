db.movies.aggregate([
            {$match: {awards: {$exists: true} }},
            {$project: {_id:0, rating: '$imdb.rating', awards1:{$split: ['$awards', ' ']}}},
            //{$addFields: {awards3:{$arrayElemAt: ['$awards1', 0]}}},
            {$match: {$expr: {$and: [{$eq: [{$arrayElemAt: ['$awards1', 0]}, 'Won']},
                                    {$in: [{$arrayElemAt: ['$awards1', 2]}, ['Oscar.', 'Oscars.']]}]}}},
			{$group: {_id: null, highest: {$max: '$rating'}, lowest: {$min: '$rating'}, sd: {$stdDevSamp: '$rating'}}}
            //,{$sample: {size:10}}
        ]).pretty()


db.movies.aggregate([
            {$match: {'languages': 'English'}},
			{$project: {_id:0, cast:1, rating: '$imdb.rating'}},
			{$unwind: '$cast'},
			{$group: {'_id': '$cast', numFilms: {'$sum': 1}, average: {'$avg': '$rating'}}},
			{$sort: {'numFilms': -1}},
			{$limit: 1}
            //,{$sample: {size:10}}
]).pretty()


db.air_routes.aggregate([
	{$match: {$expr: {'$in': ['$airplane', ['747', '380']]}}},
	{$project: {_id:0, airline: '$airline.name'}},
 	{"$lookup": { "from": "air_alliances", "localField": "airline", "foreignField": "airlines", "as": "alliances" } },
 	{$project: {alliance: '$alliances.name'}},
        {$group: {_id: '$alliance', routes: {$sum: 1}}},
	{$sort: {routes: -1}},
	{$limit: 10}
        //{$sample: {size:10}}
]).pretty()

db.air_routes.aggregate([
	{$match: {$expr: {'$in': ['$airplane', ['747', '380']]}}},
	{$count: 'count'}
]).pretty()



db.movies.aggregate([
	{$match: {'imdb.rating': {$gt: 0}, 'tomatoes.critic.rating': {$gt: 0}}},
	{$project: {_id:0, irating: '$imdb.rating', mrating: '$tomatoes.critic.rating', title:1 }},
	{$facet: {
	    isorted: [{$sort: {irating: -1}}, {$limit: 10}],
	    msorted: [{$sort: {mrating: -1}}, {$limit: 10}],
	}},
	{$project: {both: {$setIntersection: ['$isorted', '$msorted']}}}
]).pretty()
p

{ "title" : "The Godfather: Part II", "irating" : 9.1, "mrating" : 9.5 }
        "mrating" : 4.5
}
MongoDB Enterprise Cluster0-shard-0:PRIMARY> db.movies.aggregate([         {$match: {'imdb.rating': {$gt: 0}, 'tomatoes.critic.rating': {$
gt: 0}}},         {$project: {_id:0, irating: '$imdb.rating', mrating: '$tomatoes.critic.rating', title:1 }},         {$sort: {mrating: -1
}},         {$limit: 10}  ]).pretty()
{ "title" : "Short Term 12", "irating" : 8, "mrating" : 10 }
{ "title" : "Sherlock Jr.", "irating" : 8.3, "mrating" : 9.7 }
{ "title" : "Tokyo Story", "irating" : 8.3, "mrating" : 9.7 }
{ "title" : "Love Me Tonight", "irating" : 7.8, "mrating" : 9.6 }
{ "title" : "The Wind", "irating" : 8.4, "mrating" : 9.6 }
{ "title" : "Kes", "irating" : 7.8, "mrating" : 9.6 }
{ "title" : "Spring in a Small Town", "irating" : 7.6, "mrating" : 9.6 }
{ "title" : "The Godfather: Part II", "irating" : 9.1, "mrating" : 9.5 }
{ "title" : "Orpheus", "irating" : 8.1, "mrating" : 9.5 }
{ "title" : "The Rules of the Game", "irating" : 8.1, "mrating" : 9.5 }
MongoDB Enterprise Cluster0-shard-0:PRIMARY>
