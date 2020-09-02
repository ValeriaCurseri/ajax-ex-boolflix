// Milestone 1:
// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto

$(document).ready(function(){

    $('#cerca').click(function(){           // al click sul bottone

        var query = $('#query').val()       // memorizzo la query dell'utente
        console.log(query);

        $.ajax({                            // attivo la chiamata API
            url:'https://api.themoviedb.org/3/search/movie',
            method:'GET',
            data:{                          // aggiungo le chiavi
                api_key:'6cdc8707c60410cd9aef476067301b80',
                language:'it-IT',
                query: query
            },
            success: function(risposta){
                for (var i = 0; i < risposta.results.length; i++){          // ciclo tutti i risultati dell'array results
                    if(risposta.results[i].title.includes(query) || risposta.results[i].original_title.includes(query)){    // se il titolo o il titolo originale includono la ricerca
                        var source = $("#entry-template").html();
                        var template = Handlebars.compile(source);
                        var context = risposta.results[i];
                        var html = template(context);
                        $('#lista').append(html);                           // compilo la pagina con i valori dei risultati
                    } else {
                        console.log('Non è stato trovato nessun risultato')
                    }
                }
                // if(!$('#lista'))
            },
            error: function(){
                alert('Si è verificato un errore');
            }
        })

    })

})

// DA FARE
// - permettere nuove ricerche dopo la prima
// - se non c'è nessun risultato dire 'Non è stato trovato nessun risultato'
// - cercare non solo al click, ma anche con keyUp su invio
