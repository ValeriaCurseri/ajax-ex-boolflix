$(document).ready(function(){

    var url1 = 'https://api.themoviedb.org/3/search/movie';
    var url2 = 'https://api.themoviedb.org/3/search/tv';

    $('#query').keyup(function(event){
        if(event.keyCode == 13 || event.which == 13){   // al click del tasto invio
            var query = $('#query').val().toLowerCase();    // memorizzo la query dell'utente e la trasformo in minuscolo così che sia possibile cercare in maiuscolo
            cleanResults();                                 // pulisco i risultati e l'input per fare una nuova ricerca
            ricerca(query,url1,'Film');                     // attivo la fz per la ricerca dei film
            ricerca(query,url2,'Serie TV');                 // attivo la fz per la ricerca delle serie Serie TV
        }
    })

    $('#cerca').click(function(){                       // al click sul bottone
        var query = $('#query').val().toLowerCase();        // memorizzo la query dell'utente e la trasformo in minuscolo così che sia possibile cercare in maiuscolo
        cleanResults();                                     // pulisco i risultati e l'input per fare una nuova ricerca
        ricerca(query,url1,'Film');                         // attivo la fz per la ricerca dei film
        ricerca(query,url2,'Serie TV');                     // attivo la fz per la ricerca delle serie Serie TV
    })
})

// AGGIUNGIAMO LA COPERTINA
// Ci viene passata dall’API solo la parte finale dell’URL, questo perché poi potremo generare da quella porzione di URL tante dimensioni diverse.
// 1 - Dovremo prendere quindi l’URL base delle immagini di TMDB: https://image.tmdb.org/t/p/
// 2 - aggiungere la dimensione che vogliamo generare (troviamo tutte le dimensioni possibili a questo link: https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400)
// 3 - aggiungere la parte finale dell’URL passata dall’API.
// Esempio di URL che torna la copertina di BORIS:https://image.tmdb.org/t/p/w185/s2VDcsMh9ZhjFUxw77uCFDpTuXp.jpg

// -- funzioni -- //

function ricerca(data,url,type){
    $.ajax(
        {                                       // attivo la chiamata API con l'attributo type
            url: url,
            method:'GET',
            data:{                              // aggiungo le chiavi
                api_key:'6cdc8707c60410cd9aef476067301b80',
                language:'it-IT',
                query: data
            },
            success: function(risposta){
                if (risposta.total_results != 0){           // SE il numero di risultati è diverso da 0
                    console.log('risultati');
                    stampa(risposta,type);                  // stampo i risultati
                } else {                                // ALTRIMENTI: se il numero di risultati è 0
                    console.log('nessun risultato');
                    noResults(type);                        // mostro messaggio
                }
            },
            error: function(){
                alert('Si è verificato un errore');
            }
        }
    )
}

function stampa(data,type){
    var source = $("#entry-template").html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < data.results.length; i++){              // ciclo tutti i risultati dell'array results
        var voto = data.results[i].vote_average;
        var linguaOriginale = data.results[i].original_language;
        if (type == 'Film') {                                  // SE il type corrisponde a Film
            var titoloOriginale = data.results[i].original_title;
            var titolo = data.results[i].title;
            // var elementoStampa = '.risultati.Film .lista';
        } else if (type == 'Serie TV') {                              // ALTRIMENTI: se corrisponde a Serie TV
            var titoloOriginale = data.results[i].original_name;
            var titolo = data.results[i].name;
            // var elementoStampa = '.risultati.Serie TV .lista';
        };
        var context = {                                         // specifico context per riuscire a gestire meglio i risultati
            titoloOriginale: titoloOriginale,
            titolo: titolo,
            tipo: type,
            original_language: simboloLingua(linguaOriginale),
            vote_average: stelline(voto),                        // dal voto genero le stelline
            poster: data.results[i].poster_path
        }
        var html = template(context);
        if (type == 'Film') {                                  // SE il type corrisponde a Film
            $('.risultati.movie .lista').append(html);                               // compilo la pagina con i valori dei risultati
        } else if (type == 'Serie TV') {                              // ALTRIMENTI: se corrisponde a Serie TV
            $('.risultati.tv .lista').append(html);                               // compilo la pagina con i valori dei risultati
        }
    };
}

function noResults(type){
    var source = $("#noresults-template").html();
    var template = Handlebars.compile(source);
    var context = {                                         // specifico context per riuscire a gestire meglio i risultati
        risultato: 'Non ci sono risultati nella sezione: ' + type
    }
    var html = template(context);
    if (type == 'Film') {                                  // SE il type corrisponde a Film
        $('.risultati.movie').append(html);                               // compilo la pagina con i valori dei risultati
    } else if (type == 'Serie TV') {                              // ALTRIMENTI: se corrisponde a Serie TV
        $('.risultati.tv').append(html);                               // compilo la pagina con i valori dei risultati
    }
    // return $('.risultati.' + type + ' .lista').text('Non è stato trovato alcun risultato');
    // return alert('Non è stato trovato alcun risultato tra ' + type);
}

function cleanResults(){
    $('.lista').empty();                                // svuoto il div risultati
    $('#query').val('');                                // pulisco il campo di input
}

function stelline(num){
    var votoDiviso = num / 2;                           // 1- divido il voto per due
    var votoArrotondato = Math.floor(votoDiviso);       // 2- arrotondo per eccesso con fz math >> ottengo num e cerco 5 - num
    var resto = votoArrotondato % 2;
    var stella = '';                                    // 3- imposto stringa vuota per inserire poi le stelle di fontawesome
    for (var i = 0; i < 5; i++){                        // 4- ciclo for per generare stelle (i da 0 a 5 per confrontarlo con votoArrotondato)
        if (i < votoArrotondato) {                      // 5- SE i <= votoArrotondato genero stelle intere
            stella += '<i class="fas fa-star"></i>';    // 6- aggiungo nella stringa vuota il codice fontawesome per stella piena
        } else if (resto != 0){
            stella += '<i class="fas fa-star-half-alt"></i>';
            resto = 0;
        } else {                                        // 7- ALTRIMENTI: SE i > votoArrotondato genero stelle vuote
            stella += '<i class="far fa-star"></i>';    // 8- aggiungo nella stringa vuota il codice fontawesome per stella vuota
        };
    };
    return stella;                                      // 9- ritorno la variabile stella
};

function simboloLingua(lingua){
    var language = ['it', 'en'];
    if (language.includes(lingua)){                     // 1- SE la proprietà è it è en
        return '<img src="img/' + lingua + '.svg"/>';   // 2- inserisco il tag img con la variabile uguale alla proprietà
    } else {                                            // 3- ALTRIMENTI: SE la proprietà è diversa da it e en
        return lingua;                                  // 4- ritorno solo la proprietà, come al solito
    }
}
