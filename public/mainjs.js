$(document).ready(function(){
  //Button actions to choose song

  $('li').click(function(){
    var audio = document.getElementById('audioElement')
    audio.src = $(this).data('songtype');
    audio.pause();
    audio.load();
    console.log('this.name', $(this).data('songtype'));
    console.log(audio.src)
  })

  //sadFrequency
  var frequencyChoice = 17000
  $('#frequencyChoice').keyup(function(){
   frequencyChoice = $(this).val();
    console.log('frequencychoice', frequencyChoice)
  })

  //Shit for visualizer n Web API
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioElement = document.getElementById('audioElement');
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();
  var sampleRate = audioCtx.sampleRate;

  console.log('sampleRate', sampleRate);


  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);
  audioSrc.crossOrigin = "anonymous";

  var frequencyData = new Uint8Array(800);
  var frequencySpread = sampleRate/(frequencyData.length*2)
  console.log('frequencySpread', frequencySpread)

  var svgWidth = 1200;
  var svgHeight = 510

  var sampleSVG = d3.select("#graph")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

  sampleSVG.selectAll("circle")
        .data(frequencyData)
        .enter().append("circle")
        .attr("r", 0.5)
        .attr("cx", function(d, i){
          return i * (svgWidth / frequencyData.length)
        })
        .attr("cy", 500)
        .text("text", function(d){
          if(d % 50 == 0){
            return 'test'
          }
        });


  function renderChart() {
    requestAnimationFrame(renderChart);

    analyser.getByteFrequencyData(frequencyData);
    function correspondingFreq(num){
      var index = Math.round(num / frequencySpread)
      return frequencyData[index]
    }
    sampleSVG.selectAll('circle')
      .data(frequencyData)
      .attr('cy', function(d){
        return 510 - d*2;
      })
      .style('fill', 'white');

    $('body').css('background-color', 'rgba(0, 0, ' + correspondingFreq(15000) + ', 1)');
    $('.fa-frown-o').css('opacity', correspondingFreq(frequencyChoice)/200);
  };
  renderChart();
});
