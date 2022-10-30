const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
	app.use(
		[
			"/complaint",
			"/citizen",
			"/citizen/change-password",
			"/citizen/delete",
			"/police",
			"/admin",
			"/validcitizen",
			"/validpolice",
			"/validadmin",
			"/missing-person",
			"/missing-person/update",
			"/station-details",
			"/wanted-person",
			"/getAll",
		],
		createProxyMiddleware({
			target: "http://localhost:5000",
		})
	);
};

// || "https://cirdasv1.herokuapp.com:5000",
