import React from 'react'

class Footer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<footer>
				<a href="https://github.com/Leith42" target="_blank">Made with <span
					className="footer-heart">❤</span>️
				</a>
			</footer>
		);
	}
}

export default Footer;