"use latest";

const MongoClient = require('mongodb').MongoClient;

const save_iou = (name, amount, db, cb) => {
  db
    .collection('ious')
    .insertOne({ name: name, amount: amount }, null, err => {
      if(err) return cb(err);

      cb(null);
    });
}

module.exports = (ctx, done) => {

	// Grab the MongoDB URI from the request...
	const MONGO_URI = ctx.data.MONGO_URI;

	MongoClient.connect(MONGO_URI, (err, db) => {
		if(err) return done(err);

		// Grab the name and amount values from the request...
		const amount = ctx.data.amount;
		const name = ctx.data.name;

		console.log('Request data: name=$, amount=$', name, amount);

		save_iou(name, amount, db, err => {
			if(err) return done(err);

			done(null, 'Inserted IOU into db');
		});
	});
};