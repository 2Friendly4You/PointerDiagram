package de.tobiasrick.pointerdiagram.pointer;

import javafx.scene.canvas.GraphicsContext;
import javafx.scene.paint.Color;
import javafx.scene.transform.Affine;
import javafx.scene.transform.Transform;

import java.util.ArrayList;

/**
 * A class for the canvas that can draw BasePointers. These are the base for one or more ExtensionPointers
 *
 * @author Tobias Rick
 */
public class BasePointer extends Pointer{
    // manages all ExtensionPointers that are added to the BasePointer
    private ArrayList<ExtensionPointer> extensionPointers = new ArrayList<>();

    GraphicsContext gc;

    public BasePointer(GraphicsContext gc, int x1, int y1, int x2, int y2) {
        super(gc, x1, y1, x2, y2);
    }

    public BasePointer(GraphicsContext gc, int x1, int y1, int x2, int y2, Color strokeColor, Color fillColor) {
        super(gc, x1, y1, x2, y2, strokeColor, fillColor);
    }

    public BasePointer(GraphicsContext gc, double length, Color strokeColor, Color fillColor) {
        super(gc, length, strokeColor, fillColor);
    }

    public void addExtensionPointer(ExtensionPointer extensionPointer){
        extensionPointers.add(extensionPointer);
    }

    public void removeExtensionPointer(ExtensionPointer extensionPointer){
        extensionPointers.remove(extensionPointer);
    }

    @Override
    public void drawArrow(){
        super.getGc().setStroke(super.getStrokeColor());
        super.getGc().setFill(super.getFillColor());
        super.getGc().setLineWidth(super.getLineWidth());

        double dx = super.getX2() - super.getX1(), dy = super.getY2() - super.getY1();
        double angle = Math.atan2(dy, dx);
        int len = (int) Math.sqrt(dx * dx + dy * dy);

        Transform transform = Transform.translate(super.getX1(), super.getY1());
        transform = transform.createConcatenation(Transform.rotate(Math.toDegrees(angle), 0, 0));
        super.getGc().setTransform(new Affine(transform));

        super.getGc().strokeLine(0, 0, len, 0);
        super.getGc().fillPolygon(new double[]{len, len - super.getARR_SIZE(), len - super.getARR_SIZE(), len}, new double[]{0, -super.getARR_SIZE(), super.getARR_SIZE(), 0},
                4);

        for(ExtensionPointer pointer : extensionPointers){
            pointer.drawArrow();
        }

        super.getGc().setTransform(new Affine());
    }
}
