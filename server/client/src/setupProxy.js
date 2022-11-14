const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
	app.use(
		[
			"/complaint",
			"/citizen",
			"/citizen/change-password",
			"/police/change-password",
			"/admin/change-password",
			"/citizen/delete",
			"/police/delete",
			"/admin/delete",
			"/police",
			"/admin",
			"/validcitizen",
			"/validpolice",
			"/validadmin",
			"/missing-person",
			"/missing-person/update",
			"/station-details",
			"/wanted-person",
			"/wanted-person/update",
			"/getAll",
			"/uploads",
		],
		createProxyMiddleware({
			target: "http://localhost:5000" || "https://cirdas.herokuapp.com:5000",
		})
	);
};

// ,
