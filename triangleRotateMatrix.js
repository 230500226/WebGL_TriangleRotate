function showError(errorText) {
    const errorBoxDiv = document.getElementById('error-box');
    const errorSpan = document.createElement('p');
    errorSpan.innerText = errorText;
    errorBoxDiv.appendChild(errorSpan);
    console.error(errorText);
}

showError("Hello Test error 1");

function mainFunction() {
    const canvas = document.getElementById("IDcanvas");
    if (!canvas) {
        showError("Can't find canvas reference");
        return;
    }
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        showError("Can't find webgl2 support");
        return;
    }

    const triangleVertices = [
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ];

    const triangleVerticesCpuBuffer = new Float32Array(triangleVertices);

    const triangleGeoBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVerticesCpuBuffer, gl.STATIC_DRAW);

    const vertexShaderSourceCode = `
    precision mediump float; 
    attribute vec3 vertexPosition;

    //step2 make the uniforms for each rotation
    uniform mat4 uRotationX;
    uniform mat4 uRotationY;
    uniform mat4 uRotationZ;

    void main() {
    
       gl_Position =  uRotationX *  uRotationY * uRotationZ * vec4(vertexPosition, 1.0);

    }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        const compileError = gl.getShaderInfoLog(vertexShader);
        showError('compile vertex error: ' + compileError);
        return;
    }

    const fragmentShaderSourceCode = `
    precision mediump float;

    void main() {
        gl_FragColor = vec4(0.8,0,0,1);
    }`;


    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        const compileError = gl.getShaderInfoLog(fragmentShader);
        showError('compile fragment error: ' + compileError);
        return;
    }

    const triangleShaderProgram = gl.createProgram();
    gl.attachShader(triangleShaderProgram, vertexShader);
    gl.attachShader(triangleShaderProgram, fragmentShader);

    gl.linkProgram(triangleShaderProgram);
    if (!gl.getProgramParameter(triangleShaderProgram, gl.LINK_STATUS)) {
        const linkError = gl.getProgramInfoLog(triangleShaderProgram);
        showError('link program error:' + linkError);
        return;
    }

    const vertexPositionAttributLocation = gl.getAttribLocation(triangleShaderProgram, 'vertexPosition');
    if (vertexPositionAttributLocation < 0) {
        showError('failed to get attribute location for vertexPosition');
        return;
    }
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    //step2 get the Uniforms
    const uRotationX = gl.getUniformLocation(triangleShaderProgram, 'uRotationX');
    const uRotationY = gl.getUniformLocation(triangleShaderProgram, 'uRotationY');
    const uRotationZ = gl.getUniformLocation(triangleShaderProgram, 'uRotationZ');

    //step3 initialise the rotation boolean values
    var rotateX = false;
    var rotateY = false;
    var rotateZ = false;

    //step4 initialise the rotation angles
    var rotationAngleX = 0.0;
    var rotationAngleY = 0.0;
    var rotationAngleZ = 0.0;

    //step5 make a draw function

    function draw() {
        //step6 increase the rotation angle if the boolean value is true
        if (rotateX) {
            rotationAngleX += 0.01;
        }
        if (rotateY) {
            rotationAngleY += 0.01;
        }
        if (rotateZ) {
            rotationAngleZ += 0.01;
        }

        //step7 make the rotation matrix for each
        const matrixX = [
            1, 0, 0, 0,
            0, Math.cos(rotationAngleX), -Math.sin(rotationAngleX), 0,
            0, Math.sin(rotationAngleX), Math.cos(rotationAngleX), 0,
            0, 0, 0, 1
        ]
        const matrixY = [
            Math.cos(rotationAngleY), 0, Math.sin(rotationAngleY), 0,
            0, 1, 0, 0,
            -Math.sin(rotationAngleY), 0, Math.cos(rotationAngleY), 0,
            0, 0, 0, 1
        ]
        const matrixZ = [
            Math.cos(rotationAngleZ), -Math.sin(rotationAngleZ), 0, 0,
            Math.sin(rotationAngleZ), Math.cos(rotationAngleZ), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]

        //step8 send the matrix to the vertex shader
        gl.uniformMatrix4fv(uRotationX, false, matrixX);
        gl.uniformMatrix4fv(uRotationY, false, matrixY);
        gl.uniformMatrix4fv(uRotationZ, false, matrixZ);

        gl.clearColor(0.3, 0.3, 0.3, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(triangleShaderProgram);
        gl.vertexAttribPointer(vertexPositionAttributLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexPositionAttributLocation);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

    }

    //step9 create a loop function for the button that starts and stops the loop
    function loop() {
        if (!isAnimating) {
            return;
        }
        draw();
        requestAnimationFrame(loop);
    }

    //step10 create the funcion that starts the loop triggered by a button
    var isAnimating = true;
    function toggleAnimation() {
        isAnimating = !isAnimating;
        if (isAnimating) {
            loop();
        }
    }

    //step11 listen to the button that will call the function that starts and stops the loop
    document.getElementById('btnStartStop').addEventListener('click',
        toggleAnimation);

    //step12 listen to the button that will call a function that will toggle the boolean value of the rotate if statements that will increase the angle within the draw function
    document.getElementById('btnXLock').addEventListener('click', function () {
        rotateX = !rotateX;
    });
    document.getElementById('btnYLock').addEventListener('click', function () {
        rotateY = !rotateY;
    });
    document.getElementById('btnZLock').addEventListener('click', function () {
        rotateZ = !rotateZ;
    });

    //This button just calls a function that refreshes the browser so the shape will reset to normal
    document.getElementById('btnReset').addEventListener('click', function () {
        location.reload();
    });

    //step 13 to use the keyboard buttons as well then use this
    document.addEventListener('keydown', function (event) {
        if (event.key === 'x') {
            rotateX = !rotateX;
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'y') {
            rotateY = !rotateY;
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'z') {
            rotateZ = !rotateZ;
        }
    });
    //This starts the draw loop immediately when the page is loaded so you dont have to press the button everytime
    loop()
}

try {
    mainFunction();
} catch (error) {
    showError(`Uncaught JavaScript exception: ${error}`);
}
