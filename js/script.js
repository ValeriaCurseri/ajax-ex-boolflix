$(document).ready(function(){

    contenutiTrending('movie');       // prima della ricerca mostro i film trending
    contenutiTrending('tv');          // prima della ricerca mostro le serie trending
    
    $('#brand-name').click(function(){    // al click sul logo torni sulle tendenze
        cleanResults();
        contenutiTrending('movie');             // mostro i film trending
        contenutiTrending('tv');                // mostro le serie trending
    });

    // cerco all'invio o al click sulla icona di ricerca

    $('i#cerca').click(function(){                                                  // al click sull'iconcina di ricerca
        if ($("#ricerca").hasClass("active") && $("input#query").hasClass("active")){   // SE il div ricerca e l'input sono entrambi active
            var campo = $("input#query").val();                                         // memorizzo il valore dell'input in una variabile
            if (campo != ""){                                                               // SE il valore dell'input è diverso da stinga vuota
                inizio();                                                                   // inizio la fz di ricerca
            } else {                                                                        // ALTRIMENTI
                $("#ricerca").removeClass("active");                                        // chiudo l'input
                $("input#query").removeClass("active");
            }
        } else {                                                                        // ALTRIMENTI li rendo active e li mostro
            $("input#query").addClass("active");
            $("#ricerca").addClass("active");
        }
    })

    $('#query').keyup(function(event){
        if(event.keyCode == 13 || event.which == 13){                               // al click del tasto invio
            var campo = $("input#query").val();                                     // memorizzo il valore dell'input in una variabile
            if(campo != ""){                                                        // SE il valore dell'input è diverso da stinga vuota
                inizio();                                                               // inizio la fz di ricerca
            }
        }
    })

    // permetto di filtrare i risultati (film, serie, tutti)

    $(".filtro-tipo").click(function(){
        if ($(this).hasClass('movie')){
            $('.risultati.movie').show();
            $('.risultati.tv').hide();
        } else if ($(this).hasClass('tv')){
            $('.risultati.movie').hide();
            $('.risultati.tv').show();
        } else {
            $('.risultati.movie').show();
            $('.risultati.tv').show();
        }
    });

    // mostro i filtri per genere

    $(".filtro-tipo").click(function(){
        $(".filtro-tipo").removeClass('selected');
        if ($(this).hasClass('movie')){         // al click su btn film
            $(this).addClass('selected');
            $('.risultati.movie').show();           // mostra risultati film
            $('.risultati.tv').hide();              // nasconde risultati serie            
            $('#generi').empty();                   // svuota la lista generi nel select filtra per genere
            cercaGeneri('movie');                   // riempie la lista generi nel select filtra per genere con solo i generi dei film
            $('#select-generi').fadeIn();      
            
        } else if ($(this).hasClass('tv')){     // al click su btn serie tv
            $(this).addClass('selected');
            $('.risultati.movie').hide();           // mostra risultati serie tv
            $('.risultati.tv').show();              // nasconde risultati film 
            $('#generi').empty();                   // svuota la lista generi nel select filtra per genere
            cercaGeneri('tv');                      // riempie la lista generi nel select filtra per genere con solo i generi delle serie tv
            $('#select-generi').fadeIn();      
        } else {
            $('.risultati.movie').show();
            $('.risultati.tv').show();
            $('#select-generi').fadeOut(); 
        }
    });

    // scorrere le liste con le freccette

    $('i.right').click(function(){
        var elemDaScrollare = $(this).siblings('.lista');
        var currentPosition = elemDaScrollare.scrollLeft();
        currentPosition += 347;
        elemDaScrollare.scrollLeft(currentPosition);
    });

    $('i.left').click(function(){
        var elemDaScrollare = $(this).siblings('.lista');
        var currentPosition = elemDaScrollare.scrollLeft();
        currentPosition -= 347;
        elemDaScrollare.scrollLeft(currentPosition);
    });

    // memorizzo il valore del genere e richiamo la fz

    $(document).on("click", "ul#generi>li", function() {
        var genere = $(this).val();
        var tipo = $(this).attr("tipo");
        filtraGeneri(tipo,genere);
        console.log(genere, tipo);
        $('#select-generi').fadeOut(); 
    });

})

// ----- funzioni ----- //

function cercaGeneri(type){         // fz per ottenere tutti i generi
    $.ajax(
        {
            url:'https://api.themoviedb.org/3/genre/' + type + '/list',
            method: 'GET',
            data:{
                api_key:'6cdc8707c60410cd9aef476067301b80',
                language:'it-IT'
            },
            success: function(risposta){
                stampaGeneri(risposta,type);
            },
            error: function(){
                alert('Si è verificato un errore');
            }
        }
    )
}

function stampaGeneri(data,type){         // fz per stampare i generi nella select
    var source = $("#option-template").html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < data.genres.length; i++){          // ciclo tutti i risultati dell'array results
        var context = {                                     // specifico context per riuscire a gestire meglio i risultati e inserire le variabili
            genere: data.genres[i].name,                     // corretto per film o serie
            id: data.genres[i].id,                     // corretto per film o serie
            tipo: type
        };
        var html = template(context);
        $('ul#generi').append(html);      // appendo i risultati dell'elemento corretto del DOM
    }
}

function filtraGeneri(type,id){
    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/discover/'+ type +'?with_genres=' + id,   // uso la stessa fz per due chiamate
            method:'GET',
            data:{                                          // aggiungo le chiavi
                api_key:'6cdc8707c60410cd9aef476067301b80',
                language:'it-IT'
            },
            success: function(risposta){
                console.log(this.url);
                console.log(type);
                $('.lista.' + type).empty();            // pulisco i risultati e l'input per fare una nuova ricerca
                stampa(risposta,type);                  // stampo i risultati
            },
            error: function(){
                alert('Si è verificato un errore qui');
            }
        }
    )
}

function contenutiTrending(type){          // fz per mostrare i contenuti trending
    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/trending/' + type + '/day',   // uso la stessa fz per due chiamate
            method:'GET',
            data:{                                          // aggiungo le chiavi
                api_key:'6cdc8707c60410cd9aef476067301b80',
                language:'it-IT'
            },
            success: function(risposta){
                stampa(risposta,type);                  // stampo i risultati
            },
            error: function(){
                alert('Si è verificato un errore');
            }
        }
    )
}

function inizio(){
    // memorizzo in due variabili i due url così da poterli usare come argomenti nella fz di ricerca
    var url1 = 'https://api.themoviedb.org/3/search/movie';
    var url2 = 'https://api.themoviedb.org/3/search/tv';

    var query = $('#query').val().toLowerCase();        // memorizzo la query dell'utente e la trasformo in minuscolo così che sia possibile cercare in maiuscolo
    cleanResults();                                     // pulisco i risultati e l'input per fare una nuova ricerca
    risultatiPer(query);
    ricerca(query,url1,'Film');                         // attivo la fz per la ricerca dei film
    ricerca(query,url2,'Serie TV');                     // attivo la fz per la ricerca delle serie Serie TV
}

function risultatiPer(ricerca){
    var source = $("#query-template").html();
    var template = Handlebars.compile(source);
    var context = {
        query:ricerca,
    }
    var html = template(context);
    $('#mostra-query').append(html);
}

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
        if (type == 'Film' || type == 'movie') {        // SE il type corrisponde a Film (le chiavi sono diverse)
            var titoloOriginale = data.results[i].original_title;
            var titolo = data.results[i].title;
            var tipo = 'movie';
        } else if (type == 'Serie TV' || type == 'tv') {  // ALTRIMENTI: se corrisponde a Serie TV (le chiavi sono diverse)
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
            overview:sinossi(data.results[i].overview),
            id: id
        }
        var html = template(context);
        if (type == 'Film' || type == 'movie') {        // SE il type corrisponde a Film
            $('.risultati.movie .lista').append(html);      // appendo i risultati dell'elemento corretto del DOM
        } else if (type == 'Serie TV' || type == 'tv') {  // ALTRIMENTI: se corrisponde a Serie TV
            $('.risultati.tv .lista').append(html);         // appendo i risultati dell'elemento corretto del DOM
        }
        castGeneri(tipo,id);                            // fz per ottenere generi e cast (altra fz perchè devo fare altre chiamate ajax)
    };
}

function castGeneri(type,id){
    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/' + type + '/' + id,     // chiamata per ogni tipo e ogni risultato
            method:'GET',
            data:{
                api_key:'6cdc8707c60410cd9aef476067301b80',
                append_to_response: 'credits',                          // per prendere il cast
                language:'it-IT'
            },
            success: function(risposta){
                var generi = risposta.genres;                           // array dei generi
                var cast = risposta.credits.cast;                       // array del cast
                stampaDettagli(generi,cast,id);                         // fz per stampare i due risultati con Handlebars
            },
            error: function(){
                // console.log('Si è verificato un errore nella fz castGeneri');
            }
        }
    )
}

function stampaDettagli(arrayGeneri,arrayCast,codeId){      // fz per stampare cast e generi con handlebars

    var listaGeneri = '';                                       // imposto array vuoto per i generi
    for (var i = 0; i < arrayGeneri.length; i++){               // ciclo tutti i generi di un risultato
        if (i < (arrayGeneri.length - 1)){                      // SE non sono all'ultimo ciclo
            listaGeneri += arrayGeneri[i].name + ', ';              // inserisco il genere nell'array con virgola
        } else {                                                // ALTRIMENTI
            listaGeneri += arrayGeneri[i].name;                     // inserisco il genere nell'array senza virgola
        }
    }

    var listaCast = '';                                         // imposto array vuoto per il cast (devo mostrare massimo 5 nomi)
    var j = 0;
    while (j < 5 && j < arrayCast.length){                      // creo un ciclo while per 5 volte, o fino a che ho ciclato tutto il cast (nel caso in cui sia composto da meno di 5 attori)
        if (j < 4){                                             // SE non sono all'ultimo ciclo
            listaCast += arrayCast[j].name + ', ';                  // inserisco il genere nell'array con virgola
        } else {                                                // ALTRIMENTI
            listaCast += arrayCast[j].name;                         // inserisco il genere nell'array senza virgola
        }
        j++;
    }

    var source = $("#cast-generi-template").html();             // seleziono il template
    var template = Handlebars.compile(source);                  // lo collego a handlebars
    var context = {                                             // specifico context creando un nuovo oggetto
        generi: listaGeneri,
        cast: listaCast
    }
    var html = template(context);
    $('.risultato#' + codeId + ' .overlay').append(html);       // lo appendo
}

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

}

function cleanResults(){
    $('.lista').empty();                                // svuoto il div risultati
    $('#mostra-query').empty();                         // svuoto il div in cui mostro la query
    $('#query').val('');                                // pulisco il campo di input
}

function stelline(num){
    var votoArrotondato = Math.floor(num / 2);          // 1- divido il voto per due e arrotondo per difetto - ottengo l'intero
    var stella = '';                                    // 2- imposto stringa vuota per inserire poi le stelle di fontawesome
    var resto = num % 2;                                // 10- memorizzo il resto di num / 2
    for (var i = 0; i < 5; i++){                        // 3- ciclo for per generare stelle (i da 0 a 5 per confrontarlo con votoArrotondato)
        if (i < votoArrotondato) {                          // 5- SE i < votoArrotondato genero stelle intere
            stella += '<i class="fas fa-star"></i>';            // 6- aggiungo nella stringa vuota il codice fontawesome per stella piena
        } else if (resto != 0){                             // 11- SE il resto è diverso da 0 vuol dire che è decimale
            stella += '<i class="fas fa-star-half-alt"></i>';   // 12- aggiungo una mezza stella
            resto = 0;                                          // 13- porto il resto a 0
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

function sinossi(testo){
    if (testo==""){
        var mostra = 'Nessuna sinossi disponibile';
    } else {
        var mostra = testo.substring(0,300) + '...';
    };
    return mostra;
}
