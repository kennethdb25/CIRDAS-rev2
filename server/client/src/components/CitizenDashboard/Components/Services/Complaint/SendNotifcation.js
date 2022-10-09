import emailjs from "@emailjs/browser";

export const sendNotification = (municipal, complainantname, complaint) => {
	if (municipal === "Apalit") {
		emailjs.send(
			"service_t71a21p",
			"template_70llx4t",
			{
				municipal: municipal,
				complaintname: complainantname,
				complaint: complaint,
				toEmail: "apalitcirdas@gmail.com",
			},
			"EeGa2uvotcHWC5po_"
		);
	} else if (municipal === "Bacolor") {
		emailjs.send(
			"service_t71a21p",
			"template_70llx4t",
			{
				municipal: municipal,
				complaintname: complainantname,
				complaint: complaint,
				toEmail: "bacolorcirdas@gmail.com",
			},
			"EeGa2uvotcHWC5po_"
		);
	}
};
