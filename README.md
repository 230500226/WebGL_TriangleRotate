Sure, here's a draft of a README file for your GitHub project:

```markdown
# Triangle Rotate Matrix

This project demonstrates how to rotate a triangle using a matrix with buttons and keypresses.

## How it works

The project is divided into two main files: an HTML file and a JavaScript file (`triangleRotateMatrix.js`).

### HTML File

In the HTML file, we create buttons. The `id` attribute is used for referencing in the `main.js` file, and the `class` attribute is used for styling in the `styles.css` file.

### JavaScript File (triangleRotateMatrix.js)

In the `triangleRotateMatrix.js` file, we perform the following steps:

1. **Create uniforms for each rotation and get the uniforms**: This is where we define the variables that will be used in the vertex shader.

2. **Initialise the rotation boolean values**: These boolean values will determine whether a rotation should occur.

3. **Initialise the rotation angles**: These are the angles by which the triangle will be rotated.

4. **Create a draw function**: This function will be responsible for drawing the triangle on the screen.

5. **Increase the rotation angle if the boolean value is true**: If the rotation boolean value is true, the rotation angle is increased.

6. **Create the rotation matrix for each rotation**: This is where we define the matrix that will be used to rotate the triangle.

7. **Send the matrix to the vertex shader**: The vertex shader uses this matrix to rotate the triangle.

8. **Create a loop function for the button that starts and stops the loop**: This function will start or stop the rotation of the triangle when the button is pressed.

9. **Create the function that starts the loop triggered by a button**: This function is called when the start button is pressed.

10. **Listen to the button that will call the function that starts and stops the loop**: This is where we add an event listener to the start/stop button.

11. **Listen to the button that will call a function that will toggle the boolean value of the rotate if statements that will increase the angle within the draw function**: This is where we add an event listener to the button that toggles rotation.

12. **Use keyboard buttons as well**: If you want to use keyboard buttons to control the rotation, you can add event listeners for keypress events.

## Conclusion

This project is a great way to learn about matrix transformations and how they can be used to create complex animations in a simple and efficient way. Enjoy rotating triangles!
```
