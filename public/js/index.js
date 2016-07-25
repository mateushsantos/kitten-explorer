(function () {
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {scope: '/'}).then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
    
    if (!navigator.serviceWorker.controller) {
    	return;
    }
    
    if (registration.waiting) {
    	gatinho.novaVersaoPronta();
    	document.getElementById('instalar').addEventListener('click', function () {
				registration.waiting.postMessage({action: 'skipWaiting'});
			});
    	return;
    }
    
    if (registration.installing) {
    	gatinho.veEstadoDaAtualizacao(registration.installing);
    }
    
    registration.addEventListener('updatefound', function () {
    	gatinho.veEstadoDaAtualizacao(registration.installing);
    });
    
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
  
   navigator.serviceWorker.addEventListener('controllerchange', function () {
   	location.reload();
   });
}

var on = false;
var setGatos;

var gatinho = {
	init: function () {
		this.addEvents();
	},
	addEvents: function () {
		document.querySelector(".soltaOsGato").addEventListener('click', function() {
			if(on) {
				clearInterval(setGatos);
				on = false;
			}
			else {
				on = true;
				setGatos = setInterval(function () {
					
					var mainContent = document.getElementById("mainContent");
					var a = document.createElement('IMG');
					a.setAttribute('src', 'https://thecatapi.com/api/images/get?format=src&type=gif');
					a.setAttribute('class', 'soltaOsGato');
					a.style.opacity = 0;
					
					mainContent.appendChild(a);	
					setInterval(function () {
						a.style.opacity = 1;
					}, 1000);
				}, 3000);
			}
		});
		
		document.getElementById('cancelar').addEventListener('click', function () {
			var novaVersao = document.getElementById('novaVersaoPronta');
			novaVersao.classList.add('hidden');
		});
	},
	novaVersaoPronta : function () {
		var novaVersao = document.getElementById('novaVersaoPronta');
		novaVersao.classList.remove('hidden');
	},
	veEstadoDaAtualizacao: function(worker) {
		document.getElementById('instalar').addEventListener('click', function () {
				worker.postMessage({action: 'skipWaiting'});
		});
  	worker.addEventListener('statechange', function() {
    	if (worker.state == 'installed') {
      	gatinho.novaVersaoPronta();
    	}
	  });
	}
}

gatinho.init();
})();