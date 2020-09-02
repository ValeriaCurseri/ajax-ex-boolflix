$(document).ready(function(){

    $('#query').keyup(function(event){
        if(event.keyCode == 13 || event.which == 13){   // al click del tasto invio
            var cerca = attivaRicerca();                // attivo la fz per la ricerca
        }
    })

    $('#cerca').click(function(){                       // al click sul bottone
        var cerca = attivaRicerca();                    // attivo la fz per la ricerca
    })

})

// DA FARE
// - mostrare 'Non è stato trovato nessun risultato'

// -- funzioni -- //

function attivaRicerca(){                                               // fz per la ricerca
    var query = $('#query').val().toLowerCase();                        // memorizzo la query dell'utente e la trasformo in minuscolo così che sia possibile cercare in maiuscolo

    $('#lista').empty();                                                // svuoto #lista dai risultati dell'ultima ricerca, così è possibile farne una seconda

    $.ajax({                                                            // attivo la chiamata API
        url:'https://api.themoviedb.org/3/search/movie',
        method:'GET',
        data:{                                                          // aggiungo le chiavi
            api_key:'6cdc8707c60410cd9aef476067301b80',
            language:'it-IT',
            query: query
        },
        success: function(risposta){
            for (var i = 0; i < risposta.results.length; i++){          // ciclo tutti i risultati dell'array results
                // var ultimoIndice = parseInt(risposta.results.length) - 1;        NON FUNZIONA
                if(risposta.results[i].title.includes(query) || risposta.results[i].original_title.includes(query)){    // se il titolo o il titolo originale includono la ricerca
                    var source = $("#entry-template").html();
                    var template = Handlebars.compile(source);
                    var context = risposta.results[i];
                    var html = template(context);
                    $('#lista').append(html);                           // compilo la pagina con i valori dei risultati
                } // else if ((i == ultimoIndice) && $('#lista:empty')) { // se #lista rimane vuoto dopo il ciclo
                //     $('#risultati').html('Non è stato trovato nessun risultato');        NON FUNZIONA
                // };
            };
            query = $('#query').val('');
        },
        error: function(){
            alert('Si è verificato un errore');
        }
    })
}
