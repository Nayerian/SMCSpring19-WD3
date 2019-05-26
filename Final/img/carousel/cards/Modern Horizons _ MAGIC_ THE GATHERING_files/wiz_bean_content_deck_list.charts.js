/**
 * Custom pie chart: breakdown of a Magic deck.
 * @param  String target jQuery selector, where to place the generated chart
 * @param  Array deck   Array of integers, number of cards of each type
 * @param  Array colors Array of strings of color hex codes, one for each type
 * @param  Array labels Array of strings of card type labels, ie: color names etc.
 *
 * @TODO Add icons.
 */
//jQuery.getScript("http://d3js.org/d3.v3.min.js");

var wizPie = function(target, data, label) {

  target = target || '';
  if (target.length < 1 || data.counts.length < 1) {
    return;
  }

  // establish variables to be used later.
  var height      = parseInt(jQuery(target).css('height').replace('px', ''), 10),
      width       = parseInt(jQuery(target).css('width').replace('px', ''), 10),
      radius      = Math.min(width, height) / 4,
      r           = radius,
      total_cards = 0,
      size        = 0,
      pie         = d3.layout.pie().sort(null),
      arc         = d3.svg.arc().innerRadius(Math.round(radius * 0.4)).outerRadius(radius);

  // determine the total count of cards in this deck
  for (var i = 0; i < data.counts.length; i++) {
    total_cards += data.counts[i];
  }

  // determine the total size of this deck and remove items that should not be calculated.
  for (i = 0; i < data.labels.length; i++) {
    // remove colorless and land cards from the stats per request.
    if (data.labels[i] == 'Colorless' || data.labels[i] == 'Lands') {
      delete(data.labels[i]);
      delete(data.colors[i]);
      delete(data.counts[i]);
      delete(data.icons[i]);
    }
    // not colorless or land? increase size value
    else {
      size++;
    }
  }

  // establish variables to be used later.
  var deck       = data.counts || [],
      colors     = data.colors || [],
      labels     = data.labels || [],
      icon_paths = data.icons  || [],
      multicolors = data.multicolors || [];

var mMulitcolor = [];

multicolors.forEach(function(i) {
  if(i === "black") {
      i = '#515151';
      mMulitcolor.push(i);
  } else {
      mMulitcolor.push(i);
  }
});

  if (target == '#triad_of_fates_commander_deck .chart.by-color') {

  }

  // Correct array length attribute to account for element deletions
  deck.length       = size;
  colors.length     = size;
  labels.length     = size;
  icon_paths.length = size;

  var piedata = pie(deck);

  // start d3 svg chart
  var svg = d3.select(target).append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + ((width / 2) + 5) + "," + height / 2 + ")");

  var gradient = svg.append('defs')
    .append('radialGradient')
    .attr('id', 'gradient');

  gradient.append('stop')
    .attr('offset', '75%')
    .attr('stop-color', '#4f4f4f')
    .attr('stop-opacity', 1);

  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#333333')
    .attr('stop-opacity', 1);

  // Set offset based on whether this is an article or not.
  var label_offset_y = -120;
  var is_article = jQuery.find('article.node').length;
  if (is_article) {
    label_offset_y = -105;
  }
  svg.append('text')
    .attr('x', 0)
    .attr('y', label_offset_y)
    .attr('text-anchor', 'middle')
    .style('font-size', '110%')
    .style('fill', '#fff')
    .style('stoke', 'none')
    .style('text-transform', 'uppercase')
    .text(label);

  // draw background circle
  svg.append('circle')
    .attr('r', Math.round(radius * 1.3))
    .attr('fill', 'url(#gradient)')
    .attr('stroke', '#555555')
    .style('stroke-width', radius * 0.01);

  // draw darker background circle
  svg.append('circle')
    .attr('r', Math.round(radius * 1.06))
    .attr('fill', '#333333');

  // draw chart slices
  svg.selectAll("path")
  .data(piedata)
  .enter().append("path")
  .attr("fill", function(d, i) {
      return colors[i];

  })
  .attr("d", arc);

  // draw semi-transparent darker overlay circle in center of donut
  svg.append('circle')
    .attr('r', Math.round(radius * 0.45))
    .attr('fill', '#222222')
    .style('fill-opacity', 0.4);

  // draw card color icons & labels
  var icons = svg.append('g')
    .attr('class', 'icons')
    // draw tick marks in center of each slice
    .selectAll("line").data(piedata).enter();

  icons.append("line")
    .attr('class', 'tick')
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", -radius + Math.round(radius * 0.3))
    .attr("y2", -radius - Math.round(radius * 0.3))
    .attr("stroke", "#ffffff")
    .attr("transform", function(d) {
      return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
    })
    .style("stroke-width", radius * 0.02);

  icons.append('circle')
    .attr('class', 'icon-bg')
    .attr('r', Math.round(radius * 0.15))
    .attr("transform", function(d) {
       var dist   = radius * 1.3,
           winkel = (d.startAngle + d.endAngle) / 2,
           x      = dist * Math.sin(winkel),
           y      = -dist * Math.cos(winkel);

       return "translate(" + x + "," + y + ")";
    })
    .attr('stroke', '#ffffff')
    .style('stroke-width', radius * 0.02)
    .attr('fill', function(d, i) {
      return colors[i];
    });

    var multidots = icons.append('g')
        .attr('class', 'multi-dots')
        .attr('id', function(d, i) {
            if(colors[i]=='#ffd778') {
              return 'active-dots';
            }
        })
        .attr('height', 20)
        .attr("text-anchor", function(d) {
            var winkel = (d.startAngle+d.endAngle) / 2,
            angle  = (winkel * 180) / Math.PI;

            if (angle >= 180) {
                return 'end';
            }
            else {
                return 'left';
            }
        })
        .attr("transform", function(d) {
            var dist   = Math.round(radius * 1.3),
            winkel = (d.startAngle+d.endAngle) / 2,
            angle  = (winkel * 180) / Math.PI,
            x      = 0,
            y      = -dist * Math.cos(winkel) + 5;

            if (angle >= 180) {
                (function(d, i) {
                    x = ((dist * Math.sin(winkel)) - Math.round(radius * 0.24) - (10 * multicolors.length));
                    return x;
                })();

                // x = ((dist * Math.sin(winkel)) - Math.round(radius * 0.24) - 40);
            }
            else {
                x = dist * Math.sin(winkel) + Math.round(radius * 0.24);
            }

            return "translate(" + x + "," + y + ")";
        })
        .selectAll("circle").data(function() {
             if(colors.indexOf('#ffd778') > -1) {
                return mMulitcolor;
            } else {
                return false;
            }
        }).enter();

    multidots.append('circle')
        .attr('class', 'multicolors')
        .attr('cx', function(d, i) {
            return i * 10 + 5;
        })
        .attr('cy', 3)
        .attr('r', 3)
        .attr('fill', function(d, i) {
            return mMulitcolor[i];
        });

  // Labels
  icons.append('text')
    .attr('class', 'label')
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-size', Math.round(radius * 0.15) + 'px')
    .style('font-weight', 'bold')
    .attr("text-anchor", function(d) {
      var winkel = (d.startAngle+d.endAngle) / 2,
          angle  = (winkel * 180) / Math.PI;

      if (angle >= 180) {
        return 'end';
      }
      else {
        return 'left';
      }
    })
    .attr("fill", '#ffffff')
    .attr("transform", function(d) {
      var dist   = Math.round(radius * 1.3),
          winkel = (d.startAngle+d.endAngle) / 2,
          angle  = (winkel * 180) / Math.PI,
          x      = 0,
          y      = -dist * Math.cos(winkel);

      if (angle >= 180) {
        x = ((dist * Math.sin(winkel)) - Math.round(radius * 0.24));
      }
      else {
        x = dist * Math.sin(winkel) + Math.round(radius * 0.24);
      }

      return "translate(" + x + "," + y + ")";
    })
    .text(function(d, i){
      return labels[i];
    });

  // Card counts
  icons.append("text")
    .attr("class", "data")
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-size', Math.round(radius * 0.13) + 'px')
    .attr('text-anchor', function(d) {
      var winkel = (d.startAngle+d.endAngle) / 2,
          angle  = (winkel * 180) / Math.PI;

      if (angle >= 180) {
        return 'end';
      }
      else {
        return 'left';
      }
    })
    .attr('fill', '#ededed')
    .attr("transform", function(d, i) {
       var dist   = Math.round(radius * 1.3),
           winkel = (d.startAngle+d.endAngle) / 2,
           angle  = (winkel * 180) / Math.PI,
           x      = 0;
           if(colors[i]=='#ffd778') {
               y = -dist * Math.cos(winkel) + Math.round(radius * 0.15) + 10;
           } else {
               y = -dist * Math.cos(winkel) + Math.round(radius * 0.15);
           }

      if (angle >= 180) {
        x = ((dist * Math.sin(winkel)) - Math.round(radius * 0.24));
      }
      else {
        x = dist * Math.sin(winkel) + Math.round(radius * 0.24);
      }

       return "translate(" + x + "," + y + ")";
    })
    .text(function(d){
      if (d != 1) {
        return d.value + ' ' + Drupal.t('Cards') + ' (' + Math.round((d.value / total_cards) * 100) + '%)';
      }
      else {
        return d.value + ' ' + Drupal.t('Card') + ' (' + Math.round((d.value / total_cards) * 100) + '%)';
      }
    });

  // Icons
  icons.append('image')
  .attr('xlink:href', function(d, i) {
    return Drupal.settings.basePath + icon_paths[i];
  })
  .attr('class', function(d, i) {
    return 'iconsimg';
  })
  .attr('width', function(d, i) {
    return radius * 0.25;
  })
  .attr('height', function(d, i) {
    return radius * 0.25;
  })
  .attr('transform', function(d,i) {
    var dist   = radius * 1.3,
        winkel = (d.startAngle + d.endAngle) / 2,
        x      = dist * Math.sin(winkel) - (radius * 0.125),
        y      = -dist * Math.cos(winkel) - (radius * 0.125);

    return "translate(" + x + "," + y + ")";
  });

};

/**
 * Custom bar chart (stacked cards): breakdown of a Magic deck.
 * @param  String target jQuery selector, where to place the generated chart
 * @param  Array deck   Array of integers, number of cards of each type
 * @param  Array labels Array of strings of card type labels, ie: color names etc.
 */
var wizBar = function(target, data, label) {
  target = target || '';
  var deck   = data.counts || [],
      labels = data.labels || [];

  if (target.length < 1 || deck.length < 1 || labels.length < 1) {
    return;
  }
  var height = parseInt(jQuery(target).css('height').replace('px', ''), 10),
      width  = parseInt(jQuery(target).css('width').replace('px', ''), 10),
      radius = Math.min(width, height) / 4,
      svg    = d3.select(target).append("svg:svg")
        .attr("width", width)
        .attr("height", height),
      gradient = svg.append('defs')
        .append('radialGradient')
        .attr('id', 'bar-gradient');

  gradient.append('stop')
    .attr('offset', '5%')
    .attr('stop-color', '#666666')
    .attr('stop-opacity', 1);
  gradient.append('stop')
    .attr('offset', '75%')
    .attr('stop-color', '#333333')
    .attr('stop-opacity', 1);

  svg.append('text')
    .attr('x', (width / 2))
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .style('font-size', '110%')
    .style('fill', '#fff')
    .style('stoke', 'none')
    .style('text-transform', 'uppercase')
    .text(label);

  svg.append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    .append('circle')
    .attr('r', Math.round(radius * 1.3))
    .attr('fill', 'url(#bar-gradient)')
    .attr('stroke', '#555555')
    .attr('opacity', 0.7)
    .style('stroke-width', radius * 0.01);

  var bars = svg.append('g')
    .attr('class', 'bars')
    .attr("transform", "translate(" + (width - (deck.length * (radius * 0.46))) / 2 + "," + height / 2 + ")");

  for (var x in deck) {
    var y = 0;

    for (var z = 0; z < deck[x]; z++) {
      y = z * -(radius * 0.04);
      bars.append('path')
        .attr('fill', '#868686')
        .attr('stroke', '#3a3a3a')
        .attr('d', 'M ' + radius * 0.14440233 + ',' + radius * 0.18759252 + ' ' + radius * 0.33885669 + ',' + radius * 0.07975874 + ' ' + radius * 0.2045064 + ',' + radius * 0.009048058 + ' ' + radius * 0.010052038 + ',' + radius * 0.10627524 + ' z')
        .style('stroke-width', (radius * 0.012))
        .style('stroke-linejoin', 'round')
        .style('stroke-opacity', 1)
        .style('fill-opacity', 0.6)
        .attr('class', 'card')
        .attr('transform', 'translate(' + (x * (radius * 0.48)) + ',' + y + ')');
    }
  }

  bars = svg.append('g')
    .attr('class', 'data')
    .attr("transform", "translate(" + (width - (deck.length * (radius * 0.46))) / 2 + "," + height / 2 + ")")
    .selectAll('data')
    .data(deck)
    .enter();

  var r = radius * 0.4;

  bars.append('text')
    .attr('class', 'card-count')
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-size', radius * 0.19 + 'px')
    .style('font-style', 'italic')
    .attr('fill', '#ffffff')
    .text(function(d, i) {
      return deck[i];
    })
    .attr('text-anchor', 'middle')
    .attr('transform', function(d, i) {
      return 'translate(' + ((i * (radius * 0.48)) + (radius * 0.16)) + ',' + r + ')';
    });

  bars.append('circle')
    .attr('class', 'card-value-bg')
    .attr('r', radius * 0.14)
    .attr('cx', radius * 0.16)
    .attr('fill', '#b6aca6')
    .attr('stroke', '#ffffff')
    .style('stroke-width', radius * 0.03)
    .attr('transform', function(d, i) {
      return 'translate(' + (i * (radius * 0.48)) + ',' + (r + (radius * 0.28)) + ')';
    });

  bars.append('text')
    .attr('class', 'card-value')
    .text(function(d, i) {
      return labels[i];
    })
    .attr('text-anchor', 'middle')
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-weight', 'bold')
    .style('font-size', radius * 0.18 + 'px')
    .attr('fill', '#000000')
    .attr('transform', function(d,i) {
      if (labels[i].length > 1) {
        return 'translate(' + ((i * (radius * 0.48)) + (radius * 0.15)) + ',' + (r + (radius * 0.34)) + ')';
      }
      else {
        return 'translate(' + ((i * (radius * 0.48)) + (radius * 0.16)) + ',' + (r + (radius * 0.34)) + ')';
      }
    });
};
