package de.tobiasrick.pointerdiagram.canvas;

import de.tobiasrick.pointerdiagram.pointer.Pointer;
import javafx.scene.paint.Color;
import javafx.scene.shape.Shape;
import javafx.scene.text.Font;

/**
 * A class for the shapes that can be drawn on the PointerCanvas
 *
 * @author Tobias Rick
 */
public class DrawableShape {
    private Color textColor;
    private int textSize;
    private Font textFont;
    private String text;
    private Shape shape;
    private Pointer pointer;
    private Color strokeColor;
    private Color fillColor;
    public DrawableShape(Shape shape, Color strokeColor, Color fillColor) {
        this.shape = shape;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
    }

    public DrawableShape(Pointer pointer, Color strokeColor, Color fillColor) {
        this.pointer = pointer;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
    }

    public DrawableShape(String text, Font textFont, int textSize, Color textColor){
        this.text = text;
        this.textFont = textFont;
        this.textSize = textSize;
        this.textColor = textColor;
    }

    public DrawableShape(Pointer pointer) {
        this.pointer = pointer;
    }

    public Shape getShape() {
        return shape;
    }

    public Pointer getPointer() {
        return pointer;
    }

    public Color getStrokeColor() {
        return strokeColor;
    }

    public Color getFillColor() {
        return fillColor;
    }
}