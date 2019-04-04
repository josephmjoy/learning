// This pipeline has a well-meaning project stage to cut down on extra fields.
pipeline1 = [
	{$match: {title: /^[aeiou]/i}},
	{$project: {title_size: {$size: {$split: ['$title', ' '] } }}},
	{$group: {_id: '$title_size', count: {$sum: 1}}},
	{$sort: {count: -1}}
];

// pipeline1 inserted the _id of the original documents, that resulted in a FETCH of each document
// Here we eliminate the _id.
pipeline2 = [
	{$match: {title: /^[aeiou]/i}},
	{$project: {_id: 0, title_size: {$size: {$split: ['$title', ' '] } }}},
	{$group: {_id: '$title_size', count: {$sum: 1}}},
	{$sort: {count: -1}}
];

// We don't in fact need a project stage! So we eliminate that stage entirely.
// This is more performant as it avoids a needless stage.
pipeline3 = [
	{$match: {title: /^[aeiou]/i}},
	{$group: {_id: {$size: {$split: ['$title', ' '] } }}},
	{$sort: {count: -1}}
];

// A more concise version - though equal performance.
pipeline4 = [
	{$match: {title: /^[aeiou]/i}},
	{$sortByCount: {$size: {$split: ['$title', ' '] } }}
];


db.movies.aggregate(pipeline1, {explain: true});
db.movies.aggregate(pipeline2, {explain: true});
db.movies.aggregate(pipeline3, {explain: true});
db.movies.aggregate(pipeline4, {explain: true});

//
//Output:
//

// We see results of the query (all for versions produce the same putput)
MongoDB Enterprise Cluster0-shard-0:PRIMARY> db.movies.aggregate(pipeline1);
{ "_id" : 3, "count" : 1450 }
{ "_id" : 2, "count" : 1372 }
{ "_id" : 1, "count" : 1200 }
{ "_id" : 4, "count" : 1166 }
{ "_id" : 5, "count" : 647 }
{ "_id" : 6, "count" : 285 }
{ "_id" : 7, "count" : 149 }
{ "_id" : 8, "count" : 85 }
{ "_id" : 9, "count" : 39 }
{ "_id" : 10, "count" : 21 }
{ "_id" : 11, "count" : 17 }
{ "_id" : 12, "count" : 6 }
{ "_id" : 15, "count" : 4 }
{ "_id" : 14, "count" : 3 }
{ "_id" : 13, "count" : 2 }
{ "_id" : 17, "count" : 1 }

// pipeline1 has the FETCH
MongoDB Enterprise Cluster0-shard-0:PRIMARY> db.movies.aggregate(pipeline1, {explain: true});
{
        "stages" : [
                {
                        "$cursor" : {
                                "query" : {
                                        "title" : /^[aeiou]/i
                                },
                                "fields" : {
                                        "title" : 1,
                                        "_id" : 1
                                },
                                "queryPlanner" : {
                                        "plannerVersion" : 1,
                                        "namespace" : "aggregations.movies",
                                        "indexFilterSet" : false,
                                        "parsedQuery" : {
                                                "title" : {
                                                        "$regex" : "^[aeiou]",
                                                        "$options" : "i"
                                                }
                                        },
                                        "winningPlan" : {
                                                "stage" : "FETCH",
                                                "inputStage" : {
                                                        "stage" : "IXSCAN",
                                                        "filter" : {
                                                                "title" : {
                                                                        "$regex" : "^[aeiou]",
                                                                        "$options" : "i"
                                                                }
                                                        },
                                                        "keyPattern" : {
                                                                "title" : 1,
                                                                "year" : 1
                                                        },
                                                        "indexName" : "title_1_year_1",
                                                        "isMultiKey" : false,
                                                        "multiKeyPaths" : {
                                                                "title" : [ ],
                                                                "year" : [ ]
                                                        },
                                                        "isUnique" : false,
                                                        "isSparse" : false,
                                                        "isPartial" : false,
                                                        "indexVersion" : 2,
                                                        "direction" : "forward",
                                                        "indexBounds" : {
                                                                "title" : [
                                                                        "[\"\", {})",
                                                                        "[/^[aeiou]/i, /^[aeiou]/i]"
                                                                ],
                                                                "year" : [
                                                                        "[MinKey, MaxKey]"
                                                                ]
                                                        }
                                                }
                                        },
                                        "rejectedPlans" : [...]
                                }
                        }
                },
                {
                        "$project" : {
                                "_id" : true,
                                "title_size" : {
                                        "$size" : [
                                                {
                                                        "$split" : [
                                                                "$title",
                                                                {
                                                                        "$const" : " "
                                                                }
                                                        ]
                                                }
                                        ]
                                }
                        }
                },
                {
                        "$group" : {
                                "_id" : "$title_size",
                                "count" : {
                                        "$sum" : {
                                                "$const" : 1
                                        }
                                }
                        }
                },
                {
                        "$sort" : {
                                "sortKey" : {
                                        "count" : -1
                                }
                        }
                }
        ],
	...
}

// pipeline2 avoids a FETCH - the query is served entirely by the index!
MongoDB Enterprise Cluster0-shard-0:PRIMARY> db.movies.aggregate(pipeline2, {explain: true});
{
        "stages" : [
                {
                        "$cursor" : {
                                "query" : {
                                        "title" : /^[aeiou]/i
                                },
                                "fields" : {
                                        "title" : 1,
                                        "_id" : 0
                                },
                                "queryPlanner" : {
                                        "plannerVersion" : 1,
                                        "namespace" : "aggregations.movies",
                                        "indexFilterSet" : false,
                                        "parsedQuery" : {
                                                "title" : {
                                                        "$regex" : "^[aeiou]",
                                                        "$options" : "i"
                                                }
                                        },
                                        "winningPlan" : {
                                                "stage" : "PROJECTION",
                                                "transformBy" : {
                                                        "title" : 1,
                                                        "_id" : 0
                                                },
                                                "inputStage" : {
                                                        "stage" : "IXSCAN",
                                                        "filter" : {
                                                                "title" : {
                                                                        "$regex" : "^[aeiou]",
                                                                        "$options" : "i"
                                                                }
                                                        },
                                                        "keyPattern" : {
                                                                "title" : 1,
                                                                "year" : 1
                                                        },
                                                        "indexName" : "title_1_year_1",
                                                        "isMultiKey" : false,
                                                        "multiKeyPaths" : {
                                                                "title" : [ ],
                                                                "year" : [ ]
                                                        },
                                                        "isUnique" : false,
                                                        "isSparse" : false,
                                                        "isPartial" : false,
                                                        "indexVersion" : 2,
                                                        "direction" : "forward",
                                                        "indexBounds" : {
                                                                "title" : [
                                                                        "[\"\", {})",
                                                                        "[/^[aeiou]/i, /^[aeiou]/i]"
                                                                ],
                                                                "year" : [
                                                                        "[MinKey, MaxKey]"
                                                                ]
                                                        }
                                                }
                                        },
                                        "rejectedPlans" :[...]
                                }
                        }
                },
                {
                        "$project" : {
                                "_id" : false,
                                "title_size" : {
                                        "$size" : [
                                                {
                                                        "$split" : [
                                                                "$title",
                                                                {
                                                                        "$const" : " "
                                                                }
                                                        ]
                                                }
                                        ]
                                }
                        }
                },
                {
                        "$group" : {
                                "_id" : "$title_size",
                                "count" : {
                                        "$sum" : {
                                                "$const" : 1
                                        }
                                }
                        }
                },
                {
                        "$sort" : {
                                "sortKey" : {
                                        "count" : -1
                                }
                        }
                }
        ],
	...
}

// Pipeline3 is like pipelin2, but eliminates the extra project stage
MongoDB Enterprise Cluster0-shard-0:PRIMARY> db.movies.aggregate(pipeline3, {explain: true});
{
        "stages" : [
                {
                        "$cursor" : {
                                "query" : {
                                        "title" : /^[aeiou]/i
                                },
                                "fields" : {
                                        "title" : 1,
                                        "_id" : 0
                                },
                                "queryPlanner" : {
                                        "plannerVersion" : 1,
                                        "namespace" : "aggregations.movies",
                                        "indexFilterSet" : false,
                                        "parsedQuery" : {
                                                "title" : {
                                                        "$regex" : "^[aeiou]",
                                                        "$options" : "i"
                                                }
                                        },
                                        "winningPlan" : {
                                                "stage" : "PROJECTION",
                                                "transformBy" : {
                                                        "title" : 1,
                                                        "_id" : 0
                                                },
                                                "inputStage" : {
                                                        "stage" : "IXSCAN",
                                                        "filter" : {
                                                                "title" : {
                                                                        "$regex" : "^[aeiou]",
                                                                        "$options" : "i"
                                                                }
                                                        },
                                                        "keyPattern" : {
                                                                "title" : 1,
                                                                "year" : 1
                                                        },
                                                        "indexName" : "title_1_year_1",
                                                        "isMultiKey" : false,
                                                        "multiKeyPaths" : {
                                                                "title" : [ ],
                                                                "year" : [ ]
                                                        },
                                                        "isUnique" : false,
                                                        "isSparse" : false,
                                                        "isPartial" : false,
                                                        "indexVersion" : 2,
                                                        "direction" : "forward",
                                                        "indexBounds" : {
                                                                "title" : [
                                                                        "[\"\", {})",
                                                                        "[/^[aeiou]/i, /^[aeiou]/i]"
                                                                ],
                                                                "year" : [
                                                                        "[MinKey, MaxKey]"
                                                                ]
                                                        }
                                                }
                                        },
                                        "rejectedPlans" : [...]
                                }
                        }
                },
                {
                        "$group" : {
                                "_id" : {
                                        "$size" : [
                                                {
                                                        "$split" : [
                                                                "$title",
                                                                {
                                                                        "$const" : " "
                                                                }
                                                        ]
                                                }
                                        ]
                                }
                        }
                },
                {
                        "$sort" : {
                                "sortKey" : {
                                        "count" : -1
                                }
                        }
                }
        ],
	...
}

// Pipeline 4 is effectively the same as pipeline3. Note that $group inserts a count by default!
MongoDB Enterprise Cluster0-shard-0:PRIMARY> db.movies.aggregate(pipeline4, {explain: true});
{
        "stages" : [
                {
                        "$cursor" : {
                                "query" : {
                                        "title" : /^[aeiou]/i
                                },
                                "fields" : {
                                        "title" : 1,
                                        "_id" : 0
                                },
                                "queryPlanner" : {
                                        "plannerVersion" : 1,
                                        "namespace" : "aggregations.movies",
                                        "indexFilterSet" : false,
                                        "parsedQuery" : {
                                                "title" : {
                                                        "$regex" : "^[aeiou]",
                                                        "$options" : "i"
                                                }
                                        },
                                        "winningPlan" : {
                                                "stage" : "PROJECTION",
                                                "transformBy" : {
                                                        "title" : 1,
                                                        "_id" : 0
                                                },
                                                "inputStage" : {
                                                        "stage" : "IXSCAN",
                                                        "filter" : {
                                                                "title" : {
                                                                        "$regex" : "^[aeiou]",
                                                                        "$options" : "i"
                                                                }
                                                        },
                                                        "keyPattern" : {
                                                                "title" : 1,
                                                                "year" : 1
                                                        },
                                                        "indexName" : "title_1_year_1",
                                                        "isMultiKey" : false,
                                                        "multiKeyPaths" : {
                                                                "title" : [ ],
                                                                "year" : [ ]
                                                        },
                                                        "isUnique" : false,
                                                        "isSparse" : false,
                                                        "isPartial" : false,
                                                        "indexVersion" : 2,
                                                        "direction" : "forward",
                                                        "indexBounds" : {
                                                                "title" : [
                                                                        "[\"\", {})",
                                                                        "[/^[aeiou]/i, /^[aeiou]/i]"
                                                                ],
                                                                "year" : [
                                                                        "[MinKey, MaxKey]"
                                                                ]
                                                        }
                                                }
                                        },
                                        "rejectedPlans" : [...]
                                }
                        }
                },
                {
                        "$group" : {
                                "_id" : {
                                        "$size" : [
                                                {
                                                        "$split" : [
                                                                "$title",
                                                                {
                                                                        "$const" : " "
                                                                }
                                                        ]
                                                }
                                        ]
                                },
                                "count" : {
                                        "$sum" : {
                                                "$const" : 1
                                        }
                                }
                        }
                },
                {
                        "$sort" : {
                                "sortKey" : {
                                        "count" : -1
                                }
                        }
                }
        ],
        ...
}
MongoDB Enterprise Cluster0-shard-0:PRIMARY>
