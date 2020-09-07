$(document).ready(function(){

    $('#query').keyup(function(event){
        if(event.keyCode == 13 || event.which == 13){   // al click del tasto invio
            inizio();
        }
    })

    $('#cerca').click(function(){                       // al click sul bottone
        inizio();
    })

})

// - stampa dei generi con fz stampaDettagli
// - stampa del cast 
// - messaggio per sinossi mancante tramite fz sinossi
// - freccette per scorrere
// - messaggio per mostrare la query tramite fx ricercaPer
// - campo input che compare al click sull'icona cerca

// ----- funzioni ----- //

function inizio(){
    // memorizzo in due variabili i due url così da poterli usare come argomenti nella fz di ricerca
    var url1 = 'https://api.themoviedb.org/3/search/movie';
    var url2 = 'https://api.themoviedb.org/3/search/tv';

    var query = $('#query').val().toLowerCase();        // memorizzo la query dell'utente e la trasformo in minuscolo così che sia possibile cercare in maiuscolo
    cleanResults();                                     // pulisco i risultati e l'input per fare una nuova ricerca
    // risultatiPer(query);
    ricerca(query,url1,'Film');                         // attivo la fz per la ricerca dei film
    ricerca(query,url2,'Serie TV');                     // attivo la fz per la ricerca delle serie Serie TV
}

// function risultatiPer(ricerca){
//     // console.log(ricerca);
//     var source = $("#query-template").html();
//     var template = Handlebars.compile(source);
//     var context = {
//         query:ricerca,
//     }
//     var html = template(context);
//     $('#query').html(html);
// }

function ricerca(data,url,type){
    $.ajax(
        {
            url: url,                                       // uso la stessa fz per due chiamate
            method:'GET',
            data:{                                          // aggiungo le chiavi
                api_key:'6cdc8707c60410cd9aef476067301b80',
                language:'it-IT',
                query: data
            },
            success: function(risposta){
                if (risposta.total_results != 0){       // SE il numero di risultati è diverso da 0
                    stampa(risposta,type);                  // stampo i risultati
                } else {                                // ALTRIMENTI: se il numero di risultati è 0
                    noResults(type);                        // mostro il messaggio 'no results'
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
    for (var i = 0; i < data.results.length; i++){          // ciclo tutti i risultati dell'array results
        var voto = data.results[i].vote_average;
        var linguaOriginale = data.results[i].original_language;
        var id = data.results[i].id;
        if (type == 'Film') {                           // SE il type corrisponde a Film (le chiavi sono diverse)
            var titoloOriginale = data.results[i].original_title;
            var titolo = data.results[i].title;
            var tipo = 'movie';
        } else if (type == 'Serie TV') {                // ALTRIMENTI: se corrisponde a Serie TV (le chiavi sono diverse)
            var titoloOriginale = data.results[i].original_name;
            var titolo = data.results[i].name;
            var tipo = 'tv';
        };
        var context = {                                 // specifico context per riuscire a gestire meglio i risultati e inserire le variabili
            titoloOriginale: titoloOriginale,                   // corretto per film o serie
            titolo: titolo,                                     // corretto per film o serie
            tipo: type,                                         // corretto per film o serie
            original_language: simboloLingua(linguaOriginale),  // dalla lingua genero le bandierine
            vote_average: stelline(voto),                       // dal voto genero le stelline
            poster: immagine(data.results[i].poster_path),
            overview:data.results[i].overview.substring(0,300) + '...', //sinossi(data.results[i].overview)
            id: id
        }
        var html = template(context);
        if (type == 'Film') {                           // SE il type corrisponde a Film
            $('.risultati.movie .lista').append(html);      // appendo i risultati dell'elemento corretto del DOM
        } else if (type == 'Serie TV') {                // ALTRIMENTI: se corrisponde a Serie TV
            $('.risultati.tv .lista').append(html);         // appendo i risultati dell'elemento corretto del DOM
        }
        castGeneri(tipo,id);                          // fz per ottenere generi e cast
    };
}

function castGeneri(type,id){
    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/' + type + '/' + id,
            method:'GET',
            data:{
                api_key:'6cdc8707c60410cd9aef476067301b80',
                language:'it-IT'
            },
            append_to_response: 'credits',
            success: function(risposta){
                var generi = risposta.genres;
                // var cast = risposta.credits.cast;
                console.log(generi);
                // console.log(cast);

                stampaDettagli(generi)
            },
            error: function(){
                alert('Si è verificato un errore');
            }
        }
    )
}

// function stampaDettagli(arrayGeneri){
//     var listaGeneri = '';
//     for (var i = 0; i < arrayGeneri.length; i++){
//         if (i < (arrayGeneri.length - 1)){
//             listaGeneri += arrayGeneri[i].name + ', ';
//         } else {
//             listaGeneri += arrayGeneri[i].name;
//         }
//     }
//     // console.log(listaGeneri);
//     var source = $("#cast-generi-template").html();
//     var template = Handlebars.compile(source);
//     var context = {                                     // specifico context creando un nuovo oggetto
//         // cast: 'Non ci sono risultati nella sezione: ' + type,
//         generi: listaGeneri
//     }
//     var html = template(context);
//     $('.risultato#' + id).append(html);
// }

function noResults(type){
    var source = $("#noresults-template").html();
    var template = Handlebars.compile(source);
    var context = {                                     // specifico context creando un nuovo oggetto
        risultato: 'Non ci sono risultati nella sezione: ' + type
    }
    var html = template(context);
    if (type == 'Film') {                               // SE il type corrisponde a Film
        $('.risultati.movie').append(html);                 // appendo i risultati dell'elemento corretto del DOM
    } else if (type == 'Serie TV') {                    // ALTRIMENTI: se corrisponde a Serie TV
        $('.risultati.tv').append(html);                    // appendo i risultati dell'elemento corretto del DOM
    }
    // return $('.risultati.' + type + ' .lista').text('Non è stato trovato alcun risultato');
    // return alert('Non è stato trovato alcun risultato tra ' + type);
}

function cleanResults(){
    $('.lista').empty();                                // svuoto il div risultati
    $('#query').val('');                                // pulisco il campo di input
}

function stelline(num){
    var votoArrotondato = Math.floor(num / 2);          // 1- divido il voto per due e arrotondo per difetto - ottengo l'intero
    var stella = '';                                    // 2- imposto stringa vuota per inserire poi le stelle di fontawesome
    var resto = num % 2;                                // 10- memorizzo il resto di num / 2
    for (var i = 0; i < 5; i++){                        // 3- ciclo for per generare stelle (i da 0 a 5 per confrontarlo con votoArrotondato)
        if (i < votoArrotondato) {                          // 5- SE i < votoArrotondato genero stelle intere
            stella += '<i class="fas fa-star"></i>';            // 6- aggiungo nella stringa vuota il codice fontawesome per stella piena
        } else if (resto != 0){                         // 11- se il resto è diverso da 0 vuol dire che è decimale
            stella += '<i class="fas fa-star-half-alt"></i>';// 12- aggiungo una mezza stella
            resto = 0;                                      // 13- porto il resto a 0
        } else {                                            // 7- ALTRIMENTI: SE i > votoArrotondato genero stelle vuote
            stella += '<i class="far fa-star"></i>';            // 8- aggiungo nella stringa vuota il codice fontawesome per stella vuota
        };
    };
    return stella;                                      // 9- ritorno la variabile stella
};

function simboloLingua(lingua){
    var language = ['it', 'en'];
    if (language.includes(lingua)){                     // 1- SE la proprietà è it o en
        return '<img src="img/' + lingua + '.svg"/>';   // 2- inserisco il tag img con la variabile uguale alla proprietà
    } else {                                            // 3- ALTRIMENTI: SE la proprietà è diversa da it e en
        return lingua;                                  // 4- ritorno solo la proprietà, come al solito
    }
}

function immagine(immagine){
    if (immagine == null){
        var urlCompleta = 'https://via.placeholder.com/342x513.png?text=Immagine+non+disponibile'
    } else {
        var urlDiBase = 'https://image.tmdb.org/t/p/w342';
        var urlCompleta = urlDiBase + immagine;
    };
    return urlCompleta;
}

// function sinossi(testo){
//     if (testo.isEmpty()){
//         var mostra = 'Nessuna sinossi disponibile';
//     } else {
//         var mostra = testo;
//     };
//     return mostra;
// }
