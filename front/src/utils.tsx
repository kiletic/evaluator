const copyToClipboard = (text: string) => {
	const dummy = document.createElement('textarea');
	dummy.textContent = text;
	document.body.append(dummy);
	dummy.select();
	document.execCommand("copy");
	document.body.removeChild(dummy);
}


export { copyToClipboard }
