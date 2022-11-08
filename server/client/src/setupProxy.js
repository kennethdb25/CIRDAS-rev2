const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
	app.use(
		[
			"/complaint",
			"/citizen",
			"/citizen/change-password",
			"/police/change-password",
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
			"/uploads",
		],
		createProxyMiddleware({
			target: "http://localhost:5000" || "https://cirdas.herokuapp.com:5000",
		})
	);
};

// ,
