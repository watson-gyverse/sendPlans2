import React from "react"

function BuildTimestamp() {
	const t = process.env.REACT_APP_BUILD_TIMESTAMP.replace("Z", "").split("T")
	return (
		<div style={{display: "none"}}>
			<span style={{fontSize: "0.5rem"}}>{t[0]}</span>{" "}
			<span style={{fontSize: "0.5rem"}}>{t[1].split(".")[0]}</span>
		</div>
	)
}

export default BuildTimestamp
