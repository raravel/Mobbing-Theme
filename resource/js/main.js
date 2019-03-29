/* Hello world! */
//# sourceMappingURL=main.js.map

document.addEventListener("DOMContentLoaded", () => {
	// document ready

	//add subtitle
	document.querySelectorAll('a.list-group-item-action').forEach(element => {
		element.style = "cursor: pointer;"
		element.addEventListener('click', (event) => {
			let target = event.target;
			if ( target ) {
				//let rect = document.querySelector(`#${target.innerText}`).getBoundingClientRect();
				let sub = target.getAttribute('sub-data');
				let rect = document.querySelector(`h2[sub-data="${sub}"]`).getBoundingClientRect();
				window.scroll(window.scrollX, window.scrollY + (rect.top - target.offsetHeight - 10));
			}
		});
	});

	//sidebar atag click event then replace history
	document.querySelectorAll('#nav-Items a').forEach(element => {
		if ( element.href && element.href !== "#" && element.href !== "" ) {
			element.addEventListener('click', (event) => {
				let target = event.target;
				if ( target && target.href ) {
					//alert(target.href+target.search+"?&p=0");
					let url = target.href+"?&p=0";
					window.history.replaceState(null, null, url);
					location.assign(url);
					event.preventDefault();
				}
			});
		}
	});

	//body script eval
	document.querySelectorAll('body script').forEach(element => {
		if ( element.getAttribute('type') === "eval" ) {
			eval(element.innerHTML);
		}
	});

	//block adblock
	if ( blockAdBlock ) {
		if ( URLInfo.has('v') ) {
			blockAdBlock.onDetected(() => {
				$('#adBlockModal').modal();
			});
		}
	}
});