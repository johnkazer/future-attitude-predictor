var game = (function () {
    let isFirstClick = true
    // initial d3 code from https://jsfiddle.net/GordyD/0o71rhug/1/
    let fontFamily = 'proxima-nova, Verdana, Helvetica, Arial, sans-serif'
    var margin = { top: 50, right: 50, bottom: 50, left: 50 }
    var width = 600
    var height = 600
    var game = d3.select("svg")
        .attr('viewBox', '0 0 ' + width + ' ' + height) // https://stackoverflow.com/questions/49034455/d3-chart-grows-but-wont-shrink-inside-a-flex-div?noredirect=1&lq=1
        .style('position', 'absolute')
        .style('top', 0)
        .style('left', 0)
    
    game.append('g')
        .append('svg:image')
        .attr({
            'xlink:href': './images/y-axis.png',
            y: -margin.top, // down a little bit
            x: 0, // no indent
            width: 130, // same as x-axis height
            height: height + margin.bottom * 3 // fit inside
        });
        
    game.append('g')
        .append('svg:image')
        .attr({
            'xlink:href': './images/x-axis.png',
            y: height - margin.bottom * 2.25, // near the bottom
            x: margin.left * 1.5, // in a bit from the right
            width: width - margin.left * 2, // fit inside with room to spare for the y-axis image
            height: 130 // same as y-axis width
        });
    
    game.append("text")
        .attr('transform', 'translate(' + width / 2 + ',' + ((height / 2) - 10) + ')') // to the right then down (origin is top left of an svg) - puts text in the middle of the svg
        .attr('text-anchor', 'middle') // center the text on it's origin
        .text("Click where you fit")
        .attr('font-family', fontFamily)
        .attr('fill', 'white')

    function drawCircle (x, y, size, fillColour) {
        game.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", size)
            .attr("opacity", 0.5)
            .attr("fill", fillColour);
    }

    function deleteItem (item) {
        d3.selectAll(item).remove()
    }

    function findType (coords) {
        if (!Array.isArray(coords) || coords.length < 2) {
            return null
        }
        const xScalar = width / 3 // the svg px width and height, to convert into a 3 x 3 matrix
        const yScalar = height / 3
        let x = coords[0] / xScalar
        let y = coords[1] / yScalar
        if ((x + y) <= 1.5) { // svg co-ords are rotated by 90deg compared to normal x-y co-ords, so bottom right is (3, 3) and top left is (0, 0)
            return 'denial'
        } else if (((y - x) >= 1) && ((x + y) <= 4)) {
            return 'unaware'
        } else if ((x + y) > 4) {
            return 'flakiness'
        } else if ((x - y) >= 1) {
            return 'acceptance'
        } else {
            return 'resistance'
        }
    }

    function setResponseData (type) {
        let circleColour = 'black'
        let message = ''
        switch (type) { // https://www.psychologytoday.com/us/blog/struck-living/201110/convincing-the-stubborn-accept-mental-health-care
        case 'denial':
            circleColour = 'grey'
            message = 'Climate change sounds crazy, unlikely or just made up. It\'s right to be sceptical! But it\'s also worth considering that climate scientists would love to be wrong and that we are more confident about climate predictions than most economic forecasts. Worth checking-out why...'
            break
        case 'unaware':
            circleColour = 'purple'
            message = 'Climate change is a big and concerning issue that is starting to change the world. However there are useful things you can do to start understanding what\'s going on and how to adapt...'
            break;
        case 'flakiness':
            circleColour = 'white'
            message = 'If you\'ve been trying to work out how to understand and adapt to climate change, maybe there are some new things you could look into with some friends or family...'
            break;
        case 'acceptance':
            circleColour = 'red'
            message = 'Hopefully you are making good progress at adapting your lifestyle as the climate changes. There are always new and different options...'
            break;
        case 'resistance':
            circleColour = 'green'
            message = 'If you\'ve heard something about climate change but maybe resent being made to feel guilty or responsible, perhaps it\'s worth considering some of the benefits of a new perspective...'
            break
        default:
            circleColour = 'black'
            message = ''
        }
        return { colour: circleColour, msg: message }
    }

    function showMessage (msg) {
        if (window.innerHeight < 650) {
            d3.select('#scrollDown').attr('class', 'bottom-arrow')
            d3.select('#analysis').style('padding-top', '15px')
        }
        d3.select('#analysis').text(msg)
    }

    game.on('click', function (d, i) {
        deleteItem('circle')
        deleteItem('text')
        const coords = d3.mouse(this);
        let personalityType = findType(coords)
        let response = setResponseData(personalityType)
        drawCircle(coords[0], coords[1], 50, response.colour); // x, y, radius, circle colour
        showMessage(response.msg)
    });
})();