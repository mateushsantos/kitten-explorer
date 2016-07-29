(function () {
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {scope: '/'}).then(function(registration) {
    
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

	gatinho.renderizaGatos(registration.active);

    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
    
  }).catch(function(err) {
    // registration failed :(
    console.error('ServiceWorker registration failed: ', err);
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
		this.renderizaGatos();
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
					var catImageName = Math.floor(Math.random() * 9);

					var gatos = localStorage.getItem('gatosQueApareceram');

					if (gatos === "")
						gatos += catImageName + ".jpg";
					else
						gatos += "|" + catImageName + ".jpg";

					localStorage.setItem('gatosQueApareceram', gatos);

					var a = document.createElement('IMG');
					a.setAttribute('src', '/images/gatos/' + catImageName + '.jpg');
					a.setAttribute('class', 'soltaOsGato');
					a.setAttribute('class', 'imagem-gato');					
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
	},
	renderizaGatos: function () {
		var gatos = localStorage.getItem('gatosQueApareceram').split('|');

		for(var i = 0; i < gatos.length; i++) {
			$("#mainContent").append("<img class='imagem-gato soltaOsGato' src='/images/gatos/" + gatos[i] + "' />");
		}         
	}
}

gatinho.init();
})();