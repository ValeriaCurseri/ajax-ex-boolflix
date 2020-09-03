$(document).ready(function(){

    $('#query').keyup(function(event){
        if(event.keyCode == 13 || event.which == 13){       // al click del tasto invio
            var query = $('#query').val().toLowerCase();        // memorizzo la query dell'utente e la trasformo in minuscolo così che sia possibile cercare in maiuscolo
            var svuotoRisultati = svuotoRisultati();            // svuoto il div risultati
            var cerca = attivaRicerca(query);                   // attivo la fz per la ricerca
            var puliscoInput = puliscoInput();                  // pulisco il campo di input
        }
    })

    $('#cerca').click(function(){                           // al click sul bottone
        var query = $('#query').val().toLowerCase();            // memorizzo la query dell'utente e la trasformo in minuscolo così che sia possibile cercare in maiuscolo
        var svuotoRisultati = svuotoRisultati();                // svuoto il div risultati
        var cerca = attivaRicerca(query);                       // attivo la fz per la ricerca
        var puliscoInput = puliscoInput();                      // pulisco il campo di input
    })

})

// VOTO IN STELLINE
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
// 1- divido il voto per due
// 2- arrotondo per eccesso con fz math >> ottengo num e cerco 5 - num
// 3- ciclo for per generare tante stelle quante num
// 4- ciclo for per generare tante stelle vuote quante 5 - num 

// LINGUA IN BANDIERA
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).

// RICERCA SERIE TV
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
// Qui un esempio di chiamata per le serie tv:
// https:api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs

// -- funzioni -- //

function svuotoRisultati(){
    $('#lista').empty();
}

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
                    if(titoli.includes(data) || titoliOriginali.includes(data)){// se il titolo o il titolo originale includono la ricerca
                        var source = $("#entry-template").html();
                        var template = Handlebars.compile(source);
                        var context = risposta.results[i];
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

function puliscoInput(){
    $('#query').val('');
}
