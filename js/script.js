$(document).ready(function(){

    $('#query').keyup(function(event){
        if(event.keyCode == 13 || event.which == 13){       // al click del tasto invio
            var query = $('#query').val().toLowerCase();        // memorizzo la query dell'utente e la trasformo in minuscolo così che sia possibile cercare in maiuscolo
            $('#lista').empty();                                // svuoto il div risultati
            // var cercaFilm = ricercaFilm(query);                 // attivo la fz per la ricerca dei film
            // var cercaSerie = ricercaSerie(query);               // attivo la fz per la ricerca delle serie tv
            var cercaFilm = ricerca(query,'movie');
            var cercaSerie = ricerca(query,'tv');
            $('#query').val('');                                // pulisco il campo di input
        }
    })

    $('#cerca').click(function(){                           // al click sul bottone
        var query = $('#query').val().toLowerCase();            // memorizzo la query dell'utente e la trasformo in minuscolo così che sia possibile cercare in maiuscolo
        $('#lista').empty();                                    // svuoto il div risultati
        // var cercaFilm = ricercaFilm(query);                 // attivo la fz per la ricerca dei film
        // var cercaSerie = ricercaSerie(query);               // attivo la fz per la ricerca delle serie tv
        var cercaFilm = ricerca(query,'movie');
        var cercaSerie = ricerca(query,'tv');
        $('#query').val('');                                    // pulisco il campo di input
    })

})

// -- funzioni -- //

function ricerca(data,type){
    $.ajax({                                                            // attivo la chiamata API
        url:'https://api.themoviedb.org/3/search/' + type,
        method:'GET',
        data:{                                                          // aggiungo le chiavi
            api_key:'6cdc8707c60410cd9aef476067301b80',
            language:'it-IT',
            query: data
        },
        success: function(risposta){
            stampaRisultati(risposta,type);
        },
        error: function(){
            alert('Si è verificato un errore');
        }
    })
}

function stampaRisultati(data,type){
    if (data.total_results == 0){                                   // SE il numero di risultati è 0
        $('#risultati').text('Non è stato trovato alcun risultato');    // mostro il messaggio
    } else {                                                            // ALTRIMENTI
        var source = $("#entry-template").html();
        var template = Handlebars.compile(source);
        for (var i = 0; i < data.results.length; i++){              // ciclo tutti i risultati dell'array results
            var voto = data.results[i].vote_average;
            var linguaOriginale = data.results[i].original_language
            if (type == 'movie') {
                var titoloOriginale = data.results[i].original_title;
                var titolo = data.results[i].title;
                var context = {                                         // specifico context per riuscire a gestire meglio i risultati
                    original_title: titoloOriginale,
                    title: titolo,
                    tipo:type,
                    original_language: simboloLingua(linguaOriginale),
                    vote_average: stelline(voto)                        // dal voto genero le stelline
                }
            } else {
                var titoloOriginale = data.results[i].original_name;
                var titolo = data.results[i].name;
                var context = {                                         // specifico context per riuscire a gestire meglio i risultati
                    original_name: titoloOriginale,
                    name: titolo,
                    tipo:type,
                    original_language: simboloLingua(linguaOriginale),
                    vote_average: stelline(voto)                        // dal voto genero le stelline
                }
            }
            var html = template(context);
            $('#lista').append(html);                               // compilo la pagina con i valori dei risultati
        };
    };
}

function stelline(num){
    var votoDiviso = num / 2;                           // 1- divido il voto per due
    var votoArrotondato = Math.ceil(votoDiviso);        // 2- arrotondo per eccesso con fz math >> ottengo num e cerco 5 - num
    var stella = '';                                    // 3- imposto stringa vuota per inserire poi le stelle di fontawesome
    for (var i = 1; i < 6; i++){                        // 4- ciclo for per generare stelle (i da 1 a 5 per confrontarlo con votoArrotondato)
        if (i <= votoArrotondato) {                     // 5- SE i <= votoArrotondato genero stelle intere
            stella += '<i class="fas fa-star"></i>';    // 6- aggiungo nella stringa vuota il codice fontawesome per stella piena
        } else {                                        // 7- ALTRIMENTI: SE i > votoArrotondato genero stelle vuote
            stella += '<i class="far fa-star"></i>';    // 8- aggiungo nella stringa vuota il codice fontawesome per stella vuota
        };
    };
    return stella;                                      // 9- ritorno la variabile stella
};

function simboloLingua(lingua){
    var risultato = '';                                     // 1- imposto stringa vuota per inserire poi il tag delle immagini
    if (lingua == 'it' || lingua == 'en'){                  // 2- SE la proprietà è it è en
        risultato = '<img src="img/' + lingua + '.svg"/>';  // 3- inserisco il tag img con la variabile uguale alla proprietà
    } else {                                                // 4- ALTRIMENTI: SE la proprietà è diversa da it e en
        risultato = lingua;                                 // 5- ritorno solo la proprietà, come al solito
    }
    return risultato;
}
