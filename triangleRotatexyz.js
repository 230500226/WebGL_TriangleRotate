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

    let rotateX = false;
    let rotateY = false;
    let rotateZ = false;

    //  shader source code
    const vSSC = `#version 300 es
        precision mediump float;
        in vec3 vertexPosition;
        uniform vec2 uPosition;
        uniform float uRotationX;
        uniform float uRotationY;
        uniform float uRotationZ;

        void main() {
            float cosRx = cos(uRotationX);
            float sinRx = sin(uRotationX);
            float cosRy = cos(uRotationY);
            float sinRy = sin(uRotationY);
            float cosRz = cos(uRotationZ);
            float sinRz = sin(uRotationZ);

            vec3 rotatedPosition = vec3(
                vertexPosition.x * cosRy - vertexPosition.z * sinRy,
                vertexPosition.y * cosRx + vertexPosition.z * sinRx,
                vertexPosition.z * cosRx - vertexPosition.y * sinRx
            );

            vec3 finalPosition = vec3(
                rotatedPosition.x * cosRz - rotatedPosition.y * sinRz,
                rotatedPosition.x * sinRz + rotatedPosition.y * cosRz,
                rotatedPosition.z
            );

            gl_Position = vec4(uPosition + finalPosition.xy, 0.0, 1.0);
        }
    `;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vSSC);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        const errorMessage = gl.getShaderInfoLog(vertexShader);
        showError('Compile vertex error: ' + errorMessage);
        return;
    }

    // Fragment shader source code for pentagon (neon green)
    const fSSCNeonGreen = `#version 300 es
    precision mediump float;
    out vec4 outColor;
    void main() {
        outColor = vec4(0.0, 1.0, 0.0, 1.0); // Neon green color
    }`;

    const fragmentShaderNeonGreen = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderNeonGreen, fSSCNeonGreen);
    gl.compileShader(fragmentShaderNeonGreen);

    if (!gl.getShaderParameter(fragmentShaderNeonGreen, gl.COMPILE_STATUS)){
        const errorMessage = gl.getShaderInfoLog(fragmentShaderNeonGreen);
        showError('Compile fragment error: ' + errorMessage);
        return;
    }
    // Create shader program for triangle
    const programTriangle = gl.createProgram();
    gl.attachShader(programTriangle, vertexShader);
    gl.attachShader(programTriangle, fragmentShaderNeonGreen);
    gl.linkProgram(programTriangle);

    if (!gl.getProgramParameter(programTriangle, gl.LINK_STATUS)) {
        const errorMessage = gl.getProgramInfoLog(programTriangle);
        showError(`Failed to link GPU program: ${errorMessage}`);
        return;
    }

    const position = gl.getAttribLocation(programTriangle, "vertexPosition");
    if (position < 0) {
        showError(`Failed to get attribute location for vertexPosition`);
        return;
    }

    // Define the vertices for the triangle
    const verticesTriangle =[
        0.0,0.5,
        -0.5,-0.5,
        0.5,-0.5
    ];

    // Create the buffer for the triangle
    const bufferTriangle = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferTriangle);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesTriangle), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(position);

    // Create direction and position logic
    const canvasSizePixels = Math.min(canvas.width, canvas.height);

    const sizeClipSpaceTriangle = 0.9;
    const sizePixelsTriangle = sizeClipSpaceTriangle * canvasSizePixels / 2;
    var positionUniformTriangle = gl.getUniformLocation(programTriangle, 'uPosition');
    const angle = Math.random() * 2 * Math.PI;
    const speed = 0.6; // Adjust this value to change the speed
    const animDirectionTriangle = {x: speed * Math.cos(angle), y: speed * Math.sin(angle)};
    const animPositionTriangle = {x:canvas.width / 2, y:canvas.height / 2};

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    var rotationAngleX = 0.0;
    var rotationAngleY = 0.0;
    var rotationAngleZ = 0.0;
    function draw() {
        // Toggle rotations
        if (rotateX){
            rotationAngleX += 0.01;
        }
        if (rotateY) {
            rotationAngleY += 0.01;
        }
        if (rotateZ) {
            rotationAngleZ += 0.01;
        }

        const uRotationX = gl.getUniformLocation(programTriangle, 'uRotationX');
        const uRotationY = gl.getUniformLocation(programTriangle, 'uRotationY');
        const uRotationZ = gl.getUniformLocation(programTriangle, 'uRotationZ');
        gl.uniform1f(uRotationX, rotationAngleX);
        gl.uniform1f(uRotationY, rotationAngleY);
        gl.uniform1f(uRotationZ, rotationAngleZ);
        gl.clearColor(0.3, 0.3, 0.3, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw the triangle
        gl.useProgram(programTriangle);

        const clipXTriangle = (animPositionTriangle.x / canvas.width) * 2 - 1;
        const clipYTriangle = (animPositionTriangle.x / canvas.width) * - 2 + 1;

        gl.uniform2f(positionUniformTriangle, clipXTriangle, clipYTriangle);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferTriangle);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
    }

    function update() {
        animPositionTriangle.x += animDirectionTriangle.x;
        animPositionTriangle.y += animDirectionTriangle.y;
        if (animPositionTriangle.x - sizePixelsTriangle/2 < 0 || animPositionTriangle.x + sizePixelsTriangle/2 > canvas.width) {
            animDirectionTriangle.x *= -1;
        }
        if (animPositionTriangle.y - sizePixelsTriangle/2 < 0 || animPositionTriangle.y + sizePixelsTriangle/2 > canvas.height) {
            animDirectionTriangle.y *= -1;
        }

    }
    toggleAnimation();
    var isAnimating = true;
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

    document.getElementById('btnXLock').addEventListener('click', function() {
        rotateX = !rotateX;
    });
    document.getElementById('btnYLock').addEventListener('click', function() {
        rotateY = !rotateY;
    });
    document.getElementById('btnZLock').addEventListener('click', function() {
        rotateZ = !rotateZ;
    });
    document.getElementById('btnStartStop').addEventListener('click', function(){
        toggleAnimation();
    });
    document.getElementById('btnReset').addEventListener('click', function() {
        location.reload();
    });

}

try {
    mainFunction();
} catch (error) {
    showError('failed to run mainFunction() JS exception'+error);
}

