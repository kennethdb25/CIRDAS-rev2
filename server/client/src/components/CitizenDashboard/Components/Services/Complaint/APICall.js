// COMPLAINT TABLE
export const fetchData = async (setLoading, loginData, setData) => {
	setLoading(true);
	const res = await fetch(`/citizen/complaint/${loginData.validcitizen?._id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const dataComp = await res.json();
	console.log(dataComp);
	setData([dataComp]);
	setLoading(false);
};

// ANALYTICS

export const getFiledComplaint = async (loginData, setData) => {
	const res = await fetch(`/citizen/complaint/${loginData.validcitizen?._id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const dataComp = await res.json();
	setData(dataComp.body.length);
};

export const getPendingComplaints = async (loginData, setGetPending) => {
	const res = await fetch(`/citizen/complaint/Pending/${loginData.validcitizen?._id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const pending = await res.json();
	setGetPending(pending);
};

export const getReviewedComplaints = async (loginData, setGetReviewed) => {
	const res = await fetch(`/citizen/complaintss/Checked/${loginData.validcitizen?._id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const pending = await res.json();
	setGetReviewed(pending);
};

export const getUnderInvestigation = async (loginData, setGetUnder) => {
	const res = await fetch(`/citizen/complaints/UnderInvestigation/${loginData.validcitizen?._id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const pending = await res.json();
	setGetUnder(pending);
};

// END OF ANALYTICS
