$(document).ready(function(){

    $('#query').keyup(function(event){
        if(event.keyCode == 13 || event.which == 13){       // al click del tasto invio
            var query = $('#query').val().toLowerCase();        // memorizzo la query dell'utente e la trasformo in minuscolo così che sia possibile cercare in maiuscolo
            $('#lista').empty();                                // svuoto il div risultati
            var cerca = attivaRicerca(query);                   // attivo la fz per la ricerca
            $('#query').val('');                                // pulisco il campo di input
        }
    })

    $('#cerca').click(function(){                           // al click sul bottone
        var query = $('#query').val().toLowerCase();            // memorizzo la query dell'utente e la trasformo in minuscolo così che sia possibile cercare in maiuscolo
        $('#lista').empty();                                    // svuoto il div risultati
        var cerca = attivaRicerca(query);                       // attivo la fz per la ricerca
        $('#query').val('');                                    // pulisco il campo di input
    })

})



// LINGUA IN BANDIERA
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).

// RICERCA SERIE TV
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
// Qui un esempio di chiamata per le serie tv:
// https:api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs

// -- funzioni -- //

function attivaRicerca(data){
    $.ajax({                                                            // attivo la chiamata API
        url:'https://api.themoviedb.org/3/search/movie',
        method:'GET',
        data:{                                                          // aggiungo le chiavi
            api_key:'6cdc8707c60410cd9aef476067301b80',
            language:'it-IT',
            query: data
        },
        success: function(risposta){
            if (risposta.total_results == 0){                                   // SE il numero di risultati è 0
                $('#risultati').text('Non è stato trovato alcun risultato');    // mostro il messaggio
            } else {                                                            // ALTRIMENTI
                for (var i = 0; i < risposta.results.length; i++){              // ciclo tutti i risultati dell'array results
                    var titoli = risposta.results[i].title;
                    var titoliOriginali = risposta.results[i].original_title;
                    var voto = risposta.results[i].vote_average;
                    if(titoli.includes(data) || titoliOriginali.includes(data)){// se il titolo o il titolo originale includono la ricerca
                        var source = $("#entry-template").html();
                        var template = Handlebars.compile(source);
                        var context = {                                         // specifico context per riuscire a gestire meglio i risultati
                            original_language: risposta.results[i].original_language,
                            original_title: titoliOriginali,
                            title: titoli,
                            vote_average: stelline(voto)                        // dal voto genero le stelline
                        }
                        var html = template(context);
                        $('#lista').append(html);                               // compilo la pagina con i valori dei risultati
                    }
                };
            };
        },
        error: function(){
            alert('Si è verificato un errore');
        }
    })
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
