//display errors in the browser
function showError(errorText) {
    const errorBoxDiv = document.getElementById('error-box'); //find error box
    const errorSpan = document.createElement('p');    //create span (paragraph element) to store error tex
    errorSpan.innerText = errorText; //add error text
    errorBoxDiv.appendChild(errorSpan); //add error text to the box
    console.error(errorText); //console.log(errorText) for redundant error message
}

function mainFunction(){
    const canvas = document.getElementById("IDcanvas");
    if (!canvas){
        showError("Can't find canvas reference");
        return;
    }

    const gl = canvas.getContext("webgl2");
    if (!gl){
        showError("Can't find webgl2 support");
        return;
    }

    //  shader source code
    const vertexShaderSourceCode = `#version 300 es
    precision mediump float;
    in vec2 vertexPosition;
    uniform vec2 uPosition;
    void main() {
        gl_Position = vec4(vertexPosition + uPosition, 0.0, 1.0);
    }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        const errorMessage = gl.getShaderInfoLog(vertexShader);
        showError('Compile vertex error: ' + errorMessage);
        return;
    }

    // Fragment shader source code for square (neon blue)
    const fragmentShaderSourceCodeSquare = `#version 300 es
    precision mediump float;
    out vec4 outColor;
    void main() {
        outColor = vec4(0.0, 1.0, 1.0, 1.0); // Neon blue color
    }`;

    const fragmentShaderNeonBlue = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderNeonBlue, fragmentShaderSourceCodeSquare);
    gl.compileShader(fragmentShaderNeonBlue);

    if (!gl.getShaderParameter(fragmentShaderNeonBlue, gl.COMPILE_STATUS)){
        const errorMessage = gl.getShaderInfoLog(fragmentShaderNeonBlue);
        showError('Compile fragment error: ' + errorMessage);
        return;
    }

    // Fragment shader source code for pentagon (neon green)
    const fragmentShaderSourceCodePentagon = `#version 300 es
    precision mediump float;
    out vec4 outColor;
    void main() {
        outColor = vec4(0.0, 1.0, 0.0, 1.0); // Neon green color
    }`;

    const fragmentShaderNeonGreen = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderNeonGreen, fragmentShaderSourceCodePentagon);
    gl.compileShader(fragmentShaderNeonGreen);

    if (!gl.getShaderParameter(fragmentShaderNeonGreen, gl.COMPILE_STATUS)){
        const errorMessage = gl.getShaderInfoLog(fragmentShaderNeonGreen);
        showError('Compile fragment error: ' + errorMessage);
        return;
    }

    // Fragment shader source code for star (neon red)
    const fragmentShaderSourceCodeStar = `#version 300 es
    precision mediump float;
    out vec4 outColor;
    void main() {
        outColor = vec4(1.0, 0.0, 0.0, 1.0); // Neon red color
    }`;

    const fragmentShaderNeonRed = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderNeonRed, fragmentShaderSourceCodeStar);
    gl.compileShader(fragmentShaderNeonRed);

    if (!gl.getShaderParameter(fragmentShaderNeonRed, gl.COMPILE_STATUS)){
        const errorMessage = gl.getShaderInfoLog(fragmentShaderNeonRed);
        showError('Compile fragment error: ' + errorMessage);
        return;
    }

    // Create shader program for square
    const programSquare = gl.createProgram();
    gl.attachShader(programSquare, vertexShader);
    gl.attachShader(programSquare, fragmentShaderNeonBlue);
    gl.linkProgram(programSquare);

    if (!gl.getProgramParameter(programSquare, gl.LINK_STATUS)) {
        const errorMessage = gl.getProgramInfoLog(programSquare);
        showError(`Failed to link GPU program: ${errorMessage}`);
        return;
    }

    // Create shader program for pentagon
    const programPentagon = gl.createProgram();
    gl.attachShader(programPentagon, vertexShader);
    gl.attachShader(programPentagon, fragmentShaderNeonGreen);
    gl.linkProgram(programPentagon);

    if (!gl.getProgramParameter(programPentagon, gl.LINK_STATUS)) {
        const errorMessage = gl.getProgramInfoLog(programPentagon);
        showError(`Failed to link GPU program: ${errorMessage}`);
        return;
    }

    // Create shader program for star
    const programStar = gl.createProgram();
    gl.attachShader(programStar, vertexShader);
    gl.attachShader(programStar, fragmentShaderNeonRed);
    gl.linkProgram(programStar);

    if (!gl.getProgramParameter(programStar, gl.LINK_STATUS)) {
        const errorMessage = gl.getProgramInfoLog(programStar);
        showError(`Failed to link GPU program: ${errorMessage}`);
        return;
    }

    const position = gl.getAttribLocation(programSquare, "vertexPosition");
    if (position < 0) {
        showError(`Failed to get attribute location for vertexPosition`);
        return;
    }

    // Define the vertices for the square
    const squareVertices = [
        -0.8, -0.8,
        0.8, -0.8,
        -0.8,  0.8,
        -0.8,  0.8,
        0.8, -0.8,
        0.8,  0.8
    ];

    // Define the vertices for the pentagon
    const pentagonVertices = [
        0.0, 0.6,   // Top vertex
        -0.58, 0.2, // Upper left vertex
        -0.36, -0.5, // Lower left vertex
        0.36, -0.5, // Lower right vertex
        0.58, 0.2  // Upper right vertex
    ];

    // Define the vertices for the star
    const starVertices =[
        0.0,  0.1,  
        0.022,  0.022,   
        0.1,  0.0,   
        0.022, -0.022,   
        0.0, -0.1, 
        -0.022, -0.022,   
        -0.1,  0.0,  
        -0.022,  0.022,   
        0.0,  0.1   
    ];

    // Create the buffer for the square
    const squareBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertices), gl.STATIC_DRAW);

    // Create the buffer for the pentagon
    const pentagonBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pentagonBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pentagonVertices), gl.STATIC_DRAW);

    // Create the buffer for the star
    const starBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(starVertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(position);

    // Create direction and position logic
    const canvasSizePixels = Math.min(canvas.width, canvas.height);

    const squareSizeClipSpace = 1.6;
    const squareSizePixels = squareSizeClipSpace * canvasSizePixels / 2;
    var squarePositionLocation = gl.getUniformLocation(programSquare, 'uPosition');

    const pentagonSizeClipSpace = 1.2;
    const pentagonSizePixels = pentagonSizeClipSpace * canvasSizePixels / 2;
    var pentagonPositionLocation = gl.getUniformLocation(programPentagon, 'uPosition');

    const starSizeClipSpace = 0.178;
    const starSizePixels = starSizeClipSpace * canvasSizePixels / 2;
    var starPositionLocation = gl.getUniformLocation(programStar, 'uPosition');

    const squareAnimDirection = {x:(Math.random() * 2 - 1) * 0.2, y:(Math.random() * 2 - 1) * 0.2};
    const squareAnimPosition = {x:canvas.width / 2, y:canvas.height / 2};

    const pentagonAnimDirection = {x:(Math.random() * 2 - 1) * 0.4, y:(Math.random() * 2 - 1) * 0.4};
    const pentagonAnimPosition = {x:canvas.width / 2, y:canvas.height / 2};

    const starAnimDirection = {x:(Math.random() * 2 - 1) * 0.6, y:(Math.random() * 2 - 1) * 0.6};
    const starAnimPosition = {x:canvas.width / 2, y:canvas.height / 2};

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    function draw() {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw the square
        gl.useProgram(programSquare);

        const squareClipX = (squareAnimPosition.x / canvas.width) * 2 - 1;
        const squareClipY = (squareAnimPosition.y / canvas.height) * -2 + 1;

        gl.uniform2f(squarePositionLocation, squareClipX, squareClipY);
        gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Draw the pentagon
        gl.useProgram(programPentagon);

        const pentagonClipX = (pentagonAnimPosition.x / canvas.width) * 2 - 1;
        const pentagonClipY = (pentagonAnimPosition.y / canvas.height) * -2 + 1;

        gl.uniform2f(pentagonPositionLocation, pentagonClipX, pentagonClipY);
        gl.bindBuffer(gl.ARRAY_BUFFER, pentagonBuffer);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);

        // Draw the star
        gl.useProgram(programStar);

        const starClipX = (starAnimPosition.x / canvas.width) * 2 - 1;
        const starClipY = (starAnimPosition.x / canvas.width) * - 2 + 1;

        gl.uniform2f(starPositionLocation, starClipX, starClipY);
        gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 9);
    }

    function update() {
        squareAnimPosition.x += squareAnimDirection.x;
        squareAnimPosition.y += squareAnimDirection.y;
        if (squareAnimPosition.x - squareSizePixels/2 < 0 || squareAnimPosition.x + squareSizePixels/2 > canvas.width) {
            squareAnimDirection.x *= -1;
        }
        if (squareAnimPosition.y - squareSizePixels/2 < 0 || squareAnimPosition.y + squareSizePixels/2 > canvas.height) {
            squareAnimDirection.y *= -1;
        }

        pentagonAnimPosition.x += pentagonAnimDirection.x;
        pentagonAnimPosition.y += pentagonAnimDirection.y;
        if (pentagonAnimPosition.x - pentagonSizePixels/2 < 0 || pentagonAnimPosition.x + pentagonSizePixels/2 > canvas.width) {
            pentagonAnimDirection.x *= -1;
        }
        if (pentagonAnimPosition.y - pentagonSizePixels/2 < 0 || pentagonAnimPosition.y + pentagonSizePixels/2 > canvas.height) {
            pentagonAnimDirection.y *= -1;
        }

        starAnimPosition.x += starAnimDirection.x;
        starAnimPosition.y += starAnimDirection.y;
        if (starAnimPosition.x - starSizePixels/2 < 0 || starAnimPosition.x + starSizePixels/2 > canvas.width) {
            starAnimDirection.x *= -1;
        }
        if (starAnimPosition.y - starSizePixels/2 < 0 || starAnimPosition.y + starSizePixels/2 > canvas.height) {
            starAnimDirection.y *= -1;
        }

    }
    var isAnimating = true;
    //loop();
    function toggleAnimation() {
        isAnimating = !isAnimating;
        if (isAnimating) {
            loop();
        }
    }
    function loop() {
        if (!isAnimating) {
            return;
        }
        update();
        draw();
        requestAnimationFrame(loop);
    }

    document.getElementById('btnStartStop').addEventListener('click', function(){
        toggleAnimation();
    });

}

try {
    mainFunction();
} catch (error) {
    showError('failed to run mainFunction() JS exception'+error);
}

