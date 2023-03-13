package de.tobiasrick.pointerdiagram.canvas;

import javafx.scene.canvas.GraphicsContext;
import javafx.scene.shape.Rectangle;

/**
 * a class that can stroke a shape
 * (draw a given DrawableShape)
 *
 * @author Tobias Rick
 */
public class StrokeShape {
    public static void strokeShape(GraphicsContext gc, DrawableShape shape) {
        if (shape != null && shape.getShape() instanceof Rectangle rec) {
            gc.setFill(shape.getFillColor());
            gc.setStroke(shape.getStrokeColor());
            gc.fillRect(rec.getX(), rec.getY(), rec.getWidth(), rec.getHeight());
        } else {
            assert shape != null;
            if (shape.getPointer() != null) {
                shape.getPointer().drawArrow();
            } else if(shape.getTextShape() != null){
                gc.setStroke(shape.getTextShape().getColor());
                gc.setFill(shape.getTextShape().getColor());
                gc.setFont(shape.getTextShape().getFont());
                gc.fillText(shape.getTextShape().getText(), shape.getTextShape().getX(), shape.getTextShape().getY());
            }
        }
    }
}
