//Fijar valores para que la presentación de valores sean en español
var es_ES = 
{
    "decimal": ",",
    "thousands": ".",
    "grouping": [3],
    "currency": ["$", ""],
    "dateTime": "%a %b %e %X %Y",
    "date": "%d/%m/%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    "shortDays": ["Dom", "Lun", "Mar", "Mi", "Jue", "Vie", "Sab"],
    "months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    "shortMonths": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
};

var ES = d3.formatDefaultLocale(es_ES);

$(document).ready(function() 
{
    var js;
    $.getJSON('../data/level3-filtrado.json', callbackmydata);

    function callbackmydata ( data ) 
    {
        js = data;
        var texto = "SOCIO";
        

        data = $.map(js, function (obj) 
        {
            obj.text = obj.text;
            return obj;
        });

        $('.categorias').select2(
            {
            theme: "bootstrap",
            placeholder: 'SOCIO',
            allowClear: true,
            width: 'resolve',
            data: data,
            templateResult: function(data) 
            {
                return data.text;
            },
            sorter: function(data) 
            {
                return data.sort(function(a, b) 
                {
                    return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
                });
            }
            })
        .on("select2:select", function (e) 
        { 
            $('.select2-selection__rendered li.select2-selection__choice').sort(function(a, b) 
            {
                return $(a).text() < $(b).text() ? -1 : $(a).text() > $(b).text() ? 1 : 0;
            })
            .prependTo('.select2-selection__rendered');
        });
        grafo(texto);

        $('.categorias').on('change', function() 
        {
            //elimino svg y limpio el select para poner nuevas comunas
            d3.selectAll("svg").remove();
            $(".selector").html("");
            $(".selector").append('<option></option>');
            var datos = $(".categorias option:selected").text().replace(/\s/g, "_").replace(/\n/g, "");
            grafo(datos);

        });

    }

});


function grafo(texto){
    // Creamos la variable svg para saber ancho y alto.
    var svg = d3.select("#canvas").append("svg");
    var width = window.innerWidth;
    var height = window.innerHeight-(window.innerHeight/4.5);
    var radius = 20;

    // Creamos variable con escala de 10 colores estándar de d3
    var color = d3.scaleOrdinal().domain(["Socio", "Empresa", "Licitación"])
                                   .range(["#ffa500", "#4b76a2", "#b179a2"]);

    var color2 = d3.scaleOrdinal().domain(["Adjudicada", "No adjudicada"])
                                   .range(["#ff0000", "#6d6d6d"]);

    var color3 = d3.scaleOrdinal().domain(["titulo"])
                                   .range(["#000000"]);


    // carga de datos de las categorías
    var graph = d3.json("../data/datos_filtrados.json", function(error, graph)
    {
        if (error) throw error;

        // Variables de listbox a ser utilizadas en el grafo
        var data = '';
        if (texto === '')
        {
            data = graph.SOCIO[0];
        } 
        else 
        {
            data = graph[texto][0];
        }

        //máximo y mínimo
        var monto_max =  100;
        var monto_min = 10;
        var clusters = new Array(5);
        var qNodos = data.nodes.length;

        if (qNodos < 300)
            {
                // Creamos la simulación y especificamos los links, la gravedad, la ubicación y la la distancia de overlaping
            var simulation = d3.forceSimulation()
            .nodes(data.nodes)
            .force("link", d3.forceLink().id(function(d) { return d.id; }))
            .force("charge", d3.forceManyBody().strength(10))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(40).iterations(10));

            // Reubicación del grafo en el centro y escaldo al 20% del tamaño total
            var g = svg.append("g")
            .attr("class", "everything");

            // Creamos variable para flechas
            var defs = svg.append("svg:defs");

            // Creación de los links, y fijación del grosor en base a la cantidad de órdenes de compra
            var link = g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .attr("id", "lineas")
            .attr("stroke-width", 2)
                .each(function (d) {
                    var color = "";
                    if (d.isAwarded === null || d.isAwarded === undefined) {
                        color = '#000000';
                    }
                    else {
                        color = linkColor(d.isAwarded);
                    }
                    d3.select(this).style("stroke", color)
                               .attr("marker-end", marker(color));
                });

            // Creación de los nodos y fijación de su tamaño en base al monto transado por el nodo y su color en base al tipo
            var nodes = g.append("g")
            .attr("class", "nodes");
            var node = nodes.selectAll("node")
            .data(data.nodes)
            .enter().append("g");
            var circle = node.append("circle")
            .attr("r", 20)
                .attr("fill", function (d) {
                    return color(d.Tipo);
                })
            .attr("id", function(d){
                    return "c" + d.id;
                })
            .attr("class", "circle")
            .on('mouseover', fade(0.1))
            .on('mouseout', fade(1));
            

            // Añadir leyendas 
            // Nodos 
            var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

               
            legend.append("rect")
            .attr("x", window.innerWidth - window.innerWidth/30)
            .attr("y", window.innerHeight - window.innerHeight/3)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color)
            .style("stroke", "white")
            .style("stroke-width", "1");

            legend.append("text")
            .attr("x", window.innerWidth - window.innerWidth/25)
            .style("font-family", "Roboto")
            .style("font-weight", "100")
            .style("fill", "black")
            .attr("y", window.innerHeight - window.innerHeight/3.10)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
                .text(function (d) {
                    return d;
                });

            // Nodo título 
            var legendT = svg.selectAll(".Tlegend")
            .data(color3.domain())
            .enter().append("g")
            .attr("class", "Tlegend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legendT.append("text")
            .attr("x", window.innerWidth - window.innerWidth/18)
            .style("font-family", "Roboto")
            .style("font-weight", "400")
            .style("fill", "black")
            .attr("y", window.innerHeight - window.innerHeight/2.87)
            .attr("dy", ".35em")
            .text("Nodos")

            // Flechas 
            var legend2 = svg.selectAll(".lineLegend")
            .data(color2.domain())
            .enter().append("g")
            .attr("class", "lineLegend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
               
            legend2.append("rect")
            .attr("x", window.innerWidth - window.innerWidth/30)
            .attr("y", window.innerHeight - window.innerHeight/2.05)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color2)
            .style("stroke", "white")
            .style("stroke-width", "1");

            legend2.append("text")
            .attr("x", window.innerWidth - window.innerWidth/25)
            .style("font-family", "Roboto")
            .style("font-weight", "100")
            .style("fill", "black")
            .attr("y", window.innerHeight - window.innerHeight/2.10)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
                .text(function (d) {
                    return d;
                });

            // Flechas título 
            var legendT2 = svg.selectAll(".Tlegend2")
            .data(color3.domain())
            .enter().append("g")
            .attr("class", "Tlegend2")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legendT2.append("text")
            .attr("x", window.innerWidth - window.innerWidth/18)
            .style("font-family", "Roboto")
            .style("font-weight", "400")
            .style("fill", "black")
            .attr("y", window.innerHeight - window.innerHeight/1.98)
            .attr("dy", ".35em")
            .text("Aristas")


            // Flechas
            function marker(color) {

                    defs.append("svg:marker")
                        .attr("id", color.replace("#", ""))
                        .attr("viewBox", "0 -5 10 10")
                        .attr("refX", 11.2) 
                        .attr("refY", 0.05)
                        .attr("markerWidth", 10)
                        .attr("markerHeight", 10)
                        .attr("orient", "auto")
                        .attr("markerUnits", "userSpaceOnUse")
                        .append("svg:path")
                        .attr("d", "M0,-5L10,0L0,5")
                        .style("fill", color);
                    return "url(" + color + ")";
                };
            

            // Iniciamos la simulación 
            simulation
            .nodes(data.nodes)
            .on("tick", ticked);
            
            simulation
            .force("link")
            .links(data.links)
            .distance(2);

            simulation.alphaDecay(0.05);

            // Definimos los div de cada tooltip
            // primero el tooltip de nodos
            var tooltip = d3.select('body')            
            .append('div')                             
            .attr('class', 'tooltip')
            .style("opacity", "0.8");                 

            tooltip.append('div')                        
            .attr('class', 'nodo_titulo tool_head');

            tooltip.append('div')                        
            .attr('class', 'nodo_tipo tool_titulo');

            tooltip.append('div')                        
            .attr('class', 'nodo_tipo_v tool_valor');

            tooltip.append('div')                        
            .attr('class', 'nodo_nombre tool_titulo');

            tooltip.append('div')                        
            .attr('class', 'nodo_nombre_v tool_valor');

            tooltip.append('div')                        
            .attr('class', 'nodo_monto_t tool_titulo');                     

            tooltip.append('div')                       
            .attr('class', 'monto_t tool_valor');        

            tooltip.append('div')                        
            .attr('class', 'nodo_cant_t tool_titulo');                     

            tooltip.append('div')                       
            .attr('class', 'cant_t tool_valor');

            //luego el tooltip de links
            var tooltip2 = d3.select('body')            
            .append('div')                             
            .attr('class', 'tooltip')
            .style("opacity", "0.8");   

            tooltip2.append('div')                        
            .attr('class', 'nodo_titulo tool_head');

            tooltip2.append('div')                        
            .attr('class', 'nodo_tipo tool_titulo2')
            .style("background", "rgb(96, 96, 96)");

            tooltip2.append('div')                        
            .attr('class', 'nodo_tipo_v tool_valor');

            tooltip2.append('div')                        
            .attr('class', 'nodo_nombre tool_titulo2')
            .style("background", "rgb(96, 96, 96)");

            tooltip2.append('div')                        
            .attr('class', 'nodo_nombre_v tool_valor');

            tooltip2.append('div')                        
            .attr('class', 'nodo_monto_t tool_titulo');                     

            tooltip2.append('div')                       
            .attr('class', 'monto_t tool_valor');        

            tooltip2.append('div')                        
            .attr('class', 'nodo_cant_t tool_titulo');                     

            tooltip2.append('div')                       
            .attr('class', 'cant_t tool_valor');

            // Función para traer al frente
            d3.selection.prototype.moveToFront = function() 
            {
                return this.each(function()
                {
                    this.parentNode.appendChild(this);
                });
            };

            // Tooltip y label en Nodos
            node.on('mouseover', function(d, o) 
            {
                //selecciono el nodo
                var l = d3.select(this); 

                //traigo el nodo al frente
                l.moveToFront();

                // Le añado el texto
                var text = l
                .append("text")
                .attr("class", "texto_nodos")
                .attr("y",-10)
                .attr("text-anchor", "start")
                .text(function(d) 
                {
                    return d.Name;
                });

                // aparición del tooltip
                var Tipo = '', numberFormat = d3.format(",.0f");
                // aparición del label
                d3.select(".texto_nodos").style("visibility","visible")

                // Llenado del tooltip

                Tipo = d.Tipo;
                tooltip.select('.nodo_titulo').html("Datos del Nodo");                
                tooltip.select('.nodo_tipo').html("Tipo:");                
                tooltip.select('.nodo_tipo_v').html(Tipo);                 
                tooltip.select('.nodo_nombre').html("Nombre:");                                
                tooltip.select('.nodo_nombre_v').html(d.Name);
                if (Tipo === 'Socio') {
                    tooltip.select('.nodo_monto_t').html("").style('display', 'none'); 
                    tooltip.select('.monto_t').html("").style('display', 'none');
                    tooltip.select('.nodo_cant_t').html("").style('display', 'none');                
                    tooltip.select('.cant_t').html("").style('display', 'none');
                }
                if (Tipo === 'Empresa') {
                    tooltip.select('.nodo_monto_t').html("RUT:").style('display', 'block'); 
                    tooltip.select('.monto_t').html(d.RUT).style('display', 'block');
                    tooltip.select('.nodo_cant_t').html("").style('display', 'none');                
                    tooltip.select('.cant_t').html("").style('display', 'none');
                }
                if (Tipo === 'Licitación') {
                    tooltip.select('.nodo_monto_t').html("Comprador:").style('display', 'block'); 
                    tooltip.select('.monto_t').html(d.Comprador).style('display', 'block');
                    tooltip.select('.nodo_cant_t').html("Fecha:").style('display', 'block');                
                    tooltip.select('.cant_t').html(d.Fecha.substring(0, 19)).style('display', 'block');
                }                      
                tooltip.style('display', 'block');
            });

            // Tooltip y label en links

            link.on('mouseover', function(k) 
            {
                Moneda = k.Moneda
                if (Moneda == ""){
                    var numberFormat = d3.format(",.0f");
                    // Llenado del tooltip
                    tooltip2.select('.nodo_titulo').html("Datos de la Arista");
                    tooltip2.select('.nodo_tipo').html(k.source.Tipo).style("background", "rgb(255,165,0)");                
                    tooltip2.select('.nodo_tipo_v').html(k.source.Name);                 
                    tooltip2.select('.nodo_nombre').html(k.target.Tipo).style("background", "rgb(75,118,162)");                                
                    tooltip2.select('.nodo_nombre_v').html(k.target.Name);
                    tooltip2.select('.nodo_monto_t').style('display', 'none');              
                    tooltip2.select('.monto_t').style('display', 'none'); 
                    tooltip2.select('.nodo_cant_t').style('display', 'none');               
                    tooltip2.select('.cant_t').style('display', 'none');                      
                    tooltip2.style('display', 'block');                          
                }
                else{
                    var numberFormat = d3.format(",.0f");
                    // Llenado del tooltip
                    tooltip2.select('.nodo_titulo').html("Datos de la Arista");
                    tooltip2.select('.nodo_tipo').html(k.source.Tipo).style("background", "rgb(75,118,162)");                
                    tooltip2.select('.nodo_tipo_v').html(k.source.Name);                 
                    tooltip2.select('.nodo_nombre').html(k.target.Tipo).style("background", "rgb(177,121,162)");                                
                    tooltip2.select('.nodo_nombre_v').html(k.target.Name);
                    tooltip2.select('.nodo_monto_t').html("Monto ofertado:").style('display', 'block');                
                    tooltip2.select('.monto_t').html(numberFormat(k.Monto)).style('display', 'block');
                    tooltip2.select('.nodo_cant_t').html("Moneda:").style('display', 'block');                
                    tooltip2.select('.cant_t').html((k.Moneda)).style('display', 'block');                       
                    tooltip2.style('display', 'block');                          
                }
            });




            // quitar tooltips y labels al sacar el puntero
            node.on('mouseout', function()
            { 
                // quitar el nombre del nodo al salir.
                d3.selectAll(".texto_nodos").remove();
                tooltip.style('display', 'none');                           
            });

            link.on('mouseout', function()
            { 
                tooltip2.style('display', 'none');                           
            });


            // Funciones para hacer highlight
            var linkedByIndex = {};

            data.links.forEach(function(d) 
            {
                linkedByIndex[d.source.index + "," + d.target.index] = 1;
            });

            function isConnected(a, b) 
            {
                return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
            }

            function fade(opacity) 
            {
                var thisOpacity;
                return function(d) 
                {
                    node.style("stroke-opacity", function(o) 
                    {
                        thisOpacity = isConnected(d, o) ? 1 : opacity;
                        this.setAttribute('fill-opacity', thisOpacity);
                        return thisOpacity;
                    })
                    .append("text")
                    .attr("class", "texto_nodos")
                    .attr("y", -10)
                    .attr("text-anchor", "left")
                    .text(function(o) 
                    {
                        if (isConnected(d, o) == 1)
                        {
                            return o.Name;
                        } 
                        else
                        {
                            return "";
                        }
                    });

                    link.style("opacity", function(o) 
                    {
                        return o.source === d || o.target === d ? 1 : opacity;
                    });
                }
            }

            // Funciones de búsqueda de nodo del selector
            $('.selector').on('change', function ()
            {
                var datos = $("#search option:selected").text();
                if(datos !== "") 
                {
                    datos = $("#search option:selected").text();
                    highlightNode();
                }
            });
            resize();
            d3.select(window).on("resize", resize);

            // Funcion para ubicar nodos y links (aquí se hace el cluster)
            function ticked()
            {
                node
                .attr("transform", function(d) 
                {
                    if (d.Tipo === 'Socio') {d.x = Math.max(radius, Math.min(width/5 - radius, d.x))}; 
                    if (d.Tipo === 'Empresa') {d.x = Math.max(radius, Math.min(2.5 * width / 5 - radius, d.x))};
                    if (d.Tipo === 'Licitación') {d.x = Math.max(radius, Math.min(4 * width / 5 - radius, d.x))};
                    d.y = Math.max(radius, Math.min(height, d.y));
                    return "translate(" + d.x + "," + d.y + ")";
                });

                link
                .attr("x1", function(d) { return d.source.x + (4+ (15*(d.target.x - d.source.x))/(Math.sqrt((d.target.y - d.source.y)*(d.target.y - d.source.y)+(d.target.x - d.source.x)*(d.target.x - d.source.x)))); })
                .attr("y1", function(d) { return d.source.y + (4+ (15*(d.target.y - d.source.y))/(Math.sqrt((d.target.y - d.source.y)*(d.target.y - d.source.y)+(d.target.x - d.source.x)*(d.target.x - d.source.x)))); })
                .attr("x2", function(d) { return d.target.x - (4+ (15*(d.target.x - d.source.x))/(Math.sqrt((d.target.y - d.source.y)*(d.target.y - d.source.y)+(d.target.x - d.source.x)*(d.target.x - d.source.x)))); }) 
                .attr("y2", function(d) { return d.target.y - (4+ (15*(d.target.y - d.source.y))/(Math.sqrt((d.target.y - d.source.y)*(d.target.y - d.source.y)+(d.target.x - d.source.x)*(d.target.x - d.source.x)))); });

            }
            

            // Ajuste tamaño de svg, para cuadrar con el scale
            function resize()
            {
                width = window.innerWidth, height = Math.max(600, window.innerHeight - window.innerHeight/4.5 );
                svg.attr("width", width).attr("height", height);
            }

        
            // Función color del link
            function linkColor(linkCode) {
                switch (linkCode)
                {
                  case '0.0' || '0': 
                    return '#6d6d6d';
                case '1.0' || '1':
                    return '#ff0000';
                case '2.0' || '2':
                    return '#ff0000';
                default:
                    return '#000000';
                }
            }
        } 
        else 
        {
            alert("La visualización no puede generarse ya que el socio presenta "+ qNodos + " ofertas y esa cantidad es demasiado alta para ser mostrada")
        }
        
        

    });

}
