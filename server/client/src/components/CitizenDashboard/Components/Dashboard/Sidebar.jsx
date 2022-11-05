/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Drawer, Space, Modal } from "antd";
import { FiLogOut } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdLocalPolice } from "react-icons/md";
import { VscChromeClose } from "react-icons/vsc";
import scrollreveal from "scrollreveal";
import Complaints from "../Complaints/Complaints";
import { LoginContext } from "../../../../context/Context";
import { ToastContainer, toast } from "react-toastify";
import { UilFileQuestion, UilClipboardAlt, UilSearch, UilUsersAlt, UilBuilding, UilSetting } from "@iconscout/react-unicons";
import MissingPerson from "../MissingPerson/MissingPerson";
import WantedPerson from "../WantedPerson/WantedPerson";
import PoliceStationDetails from "../PoliceStationDetails/PoliceStationDetails";
import About from "../About/About";
import Account from "../Account/Account";

export default function Sidebar(props) {
	const { loginData, setLoginData } = useContext(LoginContext);
	const [currentLink, setCurrentLink] = useState(1);
	const [navbarState, setNavbarState] = useState(false);
	const html = document.querySelector("html");
	html.addEventListener("click", () => setNavbarState(false));

	const history = useNavigate();

	const { fetchData, complaintData, loading } = props;

	const logoutCitizenUser = async () => {
		let token = localStorage.getItem("citizenUserDataToken");

		const res = await fetch("/citizen/logout", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
				Accept: "application/json",
			},
			credentials: "include",
		});

		const dataPol = await res.json();

		if (dataPol.status === 201) {
			toast.warn("Logging Out", { position: toast.POSITION.TOP_CENTER });
			setTimeout(() => {
				localStorage.removeItem("citizenUserDataToken");
				history("/");
			}, 4000);
		} else {
			toast.error("Error Occured", { position: toast.POSITION.TOP_CENTER });
		}
	};

	const CitizenDasboardValid = async () => {
		let token = localStorage.getItem("citizenUserDataToken");

		const res = await fetch("/validcitizen", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		});
		const getData = await res.json();

		if (getData.status === 401 || !getData) {
			history("*");
		} else {
			console.log("user verified");
			setLoginData(getData);
			history("/user-citizen/dashboard");
		}
	};

	useEffect(() => {
		CitizenDasboardValid();
		const sr = scrollreveal({
			origin: "left",
			distance: "80px",
			duration: 1000,
			reset: false,
		});

		sr.reveal(
			`
          .brand,
          .links>ul>li:nth-of-type(1),
      .links>ul>li:nth-of-type(2),
      .links>ul>li:nth-of-type(3),
      .links>ul>li:nth-of-type(4),
      .links>ul>li:nth-of-type(5),
      .links>ul>li:nth-of-type(6),
      .logout
      `,
			{
				opacity: 0,
				interval: 300,
			}
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Section>
				<div className="top">
					<div className="brand">
						<MdLocalPolice onClick={() => setCurrentLink(1)} />
						<span onClick={() => setCurrentLink(1)}>CIRDAS</span>
					</div>
					<div className="toggle">
						{navbarState ? (
							<VscChromeClose onClick={() => setNavbarState(false)} />
						) : (
							<GiHamburgerMenu
								onClick={(e) => {
									e.stopPropagation();
									setNavbarState(true);
								}}
							/>
						)}
					</div>
					<div className="links">
						<ul>
							<li key={1} className={currentLink === 1 ? "active" : "none"} onClick={() => setCurrentLink(1)}>
								<a>
									<UilClipboardAlt />
									<span> Complaints</span>
								</a>
							</li>
							<li key={2} className={currentLink === 2 ? "active" : "none"} onClick={() => setCurrentLink(2)}>
								<a>
									<UilSearch />
									<span> Missing Person</span>
								</a>
							</li>
							<li key={3} className={currentLink === 3 ? "active" : "none"} onClick={() => setCurrentLink(3)}>
								<a>
									<UilUsersAlt />
									<span> Wanted Person</span>
								</a>
							</li>
							<li key={4} className={currentLink === 4 ? "active" : "none"} onClick={() => setCurrentLink(4)}>
								<a>
									<UilBuilding />
									<span> Police Station Location</span>
								</a>
							</li>
							<li
								key={5}
								className={currentLink === 5 ? "active" : "none"}
								onClick={() => {
									setCurrentLink(5);
								}}
							>
								<a>
									<UilSetting />
									<span> Account</span>
								</a>
							</li>
							<li
								key={6}
								className={currentLink === 6 ? "active" : "none"}
								onClick={() => {
									setCurrentLink(6);
								}}
							>
								<a>
									<UilFileQuestion />
									<span> About</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="logout">
					<a>
						<FiLogOut />
						<span
							className="logout"
							onClick={() => {
								logoutCitizenUser();
							}}
						>
							Logout
						</span>
					</a>
				</div>
			</Section>
			<ResponsiveNav state={navbarState} className={navbarState ? "show" : ""}>
				<div className="responsive__links">
					<ul>
						<li key={1} className={currentLink === 1 ? "active" : "none"} onClick={() => setCurrentLink(1)}>
							<a>
								<UilClipboardAlt />
								<span> Complaints</span>
							</a>
						</li>
						<li key={2} className={currentLink === 2 ? "active" : "none"} onClick={() => setCurrentLink(2)}>
							<a>
								<UilSearch />
								<span> Missing Person</span>
							</a>
						</li>
						<li key={3} className={currentLink === 3 ? "active" : "none"} onClick={() => setCurrentLink(3)}>
							<a>
								<UilUsersAlt />
								<span> Wanted Person</span>
							</a>
						</li>
						<li key={4} className={currentLink === 4 ? "active" : "none"} onClick={() => setCurrentLink(4)}>
							<a>
								<UilBuilding />
								<span> Police Station Location</span>
							</a>
						</li>
						<li
							key={5}
							className={currentLink === 5 ? "active" : "none"}
							onClick={() => {
								setCurrentLink(5);
							}}
						>
							<a>
								<UilSetting />
								<span> Account</span>
							</a>
						</li>
						<li
							key={6}
							className={currentLink === 6 ? "active" : "none"}
							onClick={() => {
								setCurrentLink(6);
							}}
						>
							<a>
								<UilFileQuestion />
								<span> About</span>
							</a>
						</li>
						<div className="logout">
							<a>
								<FiLogOut />
								<span
									className="logout"
									onClick={() => {
										logoutCitizenUser();
									}}
								>
									Logout
								</span>
							</a>
						</div>
					</ul>
				</div>
			</ResponsiveNav>
			{currentLink === 1 ? (
				<>
					<ToastContainer />
					<Complaints fetchData={fetchData} complaintData={complaintData} loading={loading} />
				</>
			) : currentLink === 2 ? (
				<>
					<ToastContainer />
					<MissingPerson />
				</>
			) : currentLink === 3 ? (
				<>
					<ToastContainer />
					<WantedPerson />
				</>
			) : currentLink === 4 ? (
				<>
					<ToastContainer />
					<PoliceStationDetails />
				</>
			) : currentLink === 5 ? (
				<>
					<Account />
				</>
			) : currentLink === 6 ? (
				<>
					<About />
				</>
			) : null}
		</>
	);
}
const Section = styled.section`
	position: fixed;
	left: 0;
	background-color: #437fc7;
	height: 100vh;
	width: 18vw;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 2rem 0;
	gap: 2rem;
	.top {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;

		.toggle {
			display: none;
		}
		.brand {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 2rem;
			cursor: pointer;
			svg {
				color: #edf6ff;
				font-size: 2rem;
			}
			span {
				font-size: 2rem;
				color: #edf6ff;
				font-family: "PT Serif";
				cursor: pointer;
			}
		}
		.links {
			display: flex;
			justify-content: center;
			ul {
				list-style-type: none;
				display: flex;
				flex-direction: column;
				gap: 1rem;
				li {
					padding: 0.6rem 1rem;
					border-radius: 0.6rem;
					&:hover {
						background-color: #6daffe;
						a {
							color: black;
						}
					}
					a {
						text-decoration: none;
						display: flex;
						align-items: center;
						gap: 1rem;
						color: white;
						span {
							font-size: 1.1rem;
						}
					}
				}
				.active {
					background-color: #6daffe;
					a {
						color: black;
					}
				}
			}
		}
	}

	.logout {
		padding: 0.3rem 1rem;
		border-radius: 0.6rem;
		&:hover {
			background-color: #6daffe;
		}
		a {
			text-decoration: none;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			color: white;
		}
	}
	@media screen and (min-width: 280px) and (max-width: 1080px) {
		position: initial;
		width: 100%;
		height: max-content;
		padding: 1rem;
		gap: none;
		.top {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			padding: 0 1rem;
			.toggle {
				display: block;
				color: white;
				z-index: 99;
				svg {
					font-size: 1.4rem;
				}
			}
			.brand {
				cursor: pointer;
				gap: 1rem;
				justify-content: flex-start;
			}
		}
		.top > .links,
		.logout {
			display: none;
		}
	}
`;

const ResponsiveNav = styled.div`
	position: fixed;
	right: -10vw;
	top: 0;
	z-index: 10;
	background-color: #6daffe;
	height: 100vh;
	width: ${({ state }) => (state ? "60%" : "0%")};
	transition: 0.4s ease-in-out;
	display: flex;
	opacity: 0;
	visibility: hidden;
	padding: 1rem;
	.responsive__links {
		ul {
			list-style-type: none;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			margin-top: 3rem;
			li {
				padding: 0.6rem 1rem;
				border-radius: 0.6rem;
				&:hover {
					background-color: #437fc7;
					a {
						color: black;
					}
				}
				a {
					text-decoration: none;
					display: flex;
					gap: 1rem;
					color: white;
				}
			}
			.active {
				background-color: #437fc7;
				a {
					color: black;
				}
			}
		}
	}
	.logout {
		padding: 0.3rem 1rem;
		border-radius: 0.6rem;
		
		a {
			text-decoration: none;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			color: white;
		}
`;
