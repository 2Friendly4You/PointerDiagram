package de.tobiasrick.pointerdiagram.canvas;

import de.tobiasrick.pointerdiagram.other.TextShape;
import de.tobiasrick.pointerdiagram.pointer.Pointer;
import javafx.scene.paint.Color;
import javafx.scene.shape.Shape;

/**
 * A class for the shapes that can be drawn on the PointerCanvas
 *
 * @author Tobias Rick
 */
public class DrawableShape {
    private Shape shape;
    private Pointer pointer;
    private Color strokeColor;
    private Color fillColor;
    private TextShape textShape;

    public DrawableShape(Shape shape, Color strokeColor, Color fillColor) {
        this.shape = shape;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
    }

    public DrawableShape(Pointer pointer) {
        this.pointer = pointer;
    }

    public DrawableShape(TextShape textShape){
        this.textShape = textShape;
    }

    public Shape getShape() {
        return shape;
    }

    public Pointer getPointer() {
        return pointer;
    }

    public TextShape getTextShape() {
        return textShape;
    }

    public Color getStrokeColor() {
        return strokeColor;
    }

    public Color getFillColor() {
        return fillColor;
    }
}