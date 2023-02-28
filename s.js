javascript: (function() {
    var script = document.createElement('script');
	const today = new Date();
	var nextDay = new Date(today);
	nextDay.setDate(today.getDate() + 1);
	
	const yyyy = today.getFullYear();
	const nYYYY = nextDay.getFullYear();
	let mm = today.getMonth() + 1; // Months start at 0!
	let dd = today.getDate();

	let nMM = nextDay.getMonth() +1;
	let nDD = nextDay.getDate();

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	if (nDD < 10) nDD = '0' + nDD;
	if (nMM < 10) nMM = '0' + nMM;

	const formattedToday = dd + '.' + mm + '.' + yyyy;	
	const formattedNextDay = nDD + '.' + nMM + '.' + nYYYY;
	let countSize = 0
	let inited = false
	var loopCount = 0
	var sto = 0;
	var sorok = 0;
	var dvadcat = 0;
	var summoy = 0;
	let startCount = 0;
	let lastCount = 0;
	let lastId = -1;
	let process = true;
	
		function waitForCondition (variable) {
	  function waitFor(result) {
		if (result) {
		  return result;
		}
		return new Promise((resolve) => setTimeout(resolve, 100))
		  .then(() => Promise.resolve(window[variable])) 
		  .then((res) => waitFor(res));
	  }
	  return waitFor();
	}
	
	function delay(time) {
	  return new Promise(resolve => setTimeout(resolve, time));
	}
	
	function startInterate() {
	
	console.log("LoopCount = " + loopCount)

		for (let i = 0; i < loopCount; i++) {
		  getInfo(startCount)
		  startCount = startCount + 20;
		  		  console.log(startCount);
		  if (startCount > countSize) {
		   console.log("StartCount > countSize");
			startCount = startCount - countSize + lastCount;
		  }
		waitForCondition('process').then((res) => console.log('>>>', res));
		   lastCount = startCount;
			if (i == loopCount - 1) {
				console.log("This is a last iteration");
			}
		}
	}
	
	function getInfo(startCount) {
		process = false;
		fetch("https://app.frontpad.ru/blocks/content/orders_list.php", {
            "headers": {
                "accept": "*/*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://app.frontpad.ru/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `datetime1=27.02.2023 01:00:00&datetime2=28.02.2023 01:00:59&filter_waiter=0&filter_status&filter_pay=0&undefined&start=${startCount}`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(response => response.json()).then(data => {

			console.log(data);
			const obj = JSON.parse(JSON.stringify(data))
				//console.log(obj);
			//console.log(obj.order);
			countSize = obj['stat']['count'];
			loopCount = Math.ceil(countSize/20)
			console.log(countSize);
			console.log(loopCount);
			if (inited == false) {
				inited = true;
				return;
			}
			console.log("StartCount = " + startCount);
			Object.keys(obj.order).forEach(function(key1) {
			  //console.log('Key : ' + key + ', Value : ' + data[key])
				Object.keys(obj.order[key1]).forEach(function(key) {
					if (lastId != obj.order[key1]) { 
						var cena = obj.order[key1]['total'];
						var skidka = obj.order[key1]['sale'];
						console.log(" Cena = " + cena + " Skidka = " + skidka);
						if (parseInt(skidka) == 40) {
							sorok = sorok + parseInt(cena);
							console.log("Sorok = " + sorok);
						}
						if (parseInt(skidka) == 20) {
							dvadcat = dvadcat + parseInt(cena);
							console.log("Dvadcat = " + dvadcat);
						}
						lastId = obj.order[key1];
						// console.log('Key : ' + key + ', Value : ' + obj.order[key1][key]);
					}
				})
			})
			process = true;
        });;
	}

    script.src = "//cdn.jsdelivr.net/npm/eruda";
    document.body.appendChild(script);
    script.onload = function() {
		// start ne mozhet byt bolshe stat.count
		
        const myList = document.querySelector('ul');
		var url1 =  `datetime1=${formattedToday} 01:00:00&datetime2=${formattedNextDay} 18:00:59&filter_waiter=0&filter_status&filter_pay=0&undefined&start=0`;
       getInfo(startCount);
	   



		waitForCondition('inited').then((res) => console.log('>>>', res));

		
		delay(1000).then(() => startInterate());
		delay(3000).then(() => alert("Sorok = " + sorok + "\n Dvadcat = " + dvadcat));	
    }
})();
