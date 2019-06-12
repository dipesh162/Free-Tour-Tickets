var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
	userId: {
			    type: mongoose.Schema.Types.ObjectId,
			  },
	eventId: {
			    type: mongoose.Schema.Types.ObjectId,
			  },
	tourIndex: Number
});

var Order = mongoose.model("Order", orderSchema);
module.exports = Order;



