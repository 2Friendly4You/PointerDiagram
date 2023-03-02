package de.tobiasrick.pointerdiagram.canvas;

import de.tobiasrick.pointerdiagram.I18N;
import de.tobiasrick.pointerdiagram.pointer.BasePointer;
import de.tobiasrick.pointerdiagram.pointer.ExtensionPointer;
import javafx.embed.swing.SwingFXUtils;
import javafx.geometry.Rectangle2D;
import javafx.scene.SnapshotParameters;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.image.WritableImage;
import javafx.scene.paint.Color;
import javafx.stage.FileChooser;
import javafx.stage.Stage;

import javax.imageio.ImageIO;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * A class for the canvas that can draw pointers
 *
 * @author Tobias Rick
 */
public class PointerCanvas extends Canvas {
    private final List<DrawableShape> shapes = new ArrayList<>();

    public PointerCanvas() {
        super(2000, 2000);

        // set fill for rectangle
        BasePointer basePointer = new BasePointer(this.getGraphicsContext2D(), 10, 10, 1200, 10);
        basePointer.addExtensionPointer(new ExtensionPointer(this.getGraphicsContext2D(), 50, 10, 50, 400, Color.BLUE, Color.BLUE));
        basePointer.addExtensionPointer(new ExtensionPointer(this.getGraphicsContext2D(), 10, 10, 50, 40, Color.RED, Color.RED));
        addShape(new DrawableShape(basePointer, Color.BLACK, Color.BLUE));


        //saveImage(Start.stage, this, "png");
    }

    public static double clamp( double value, double min, double max) {

        if( Double.compare(value, min) < 0)
            return min;

        if( Double.compare(value, max) > 0)
            return max;

        return value;
    }

    /**
     * adds a shape to the canvas
     *
     * @param shape the shape, that is added
     */
    public void addShape(DrawableShape shape) {
        shapes.add(shape);
        drawShapes();
    }

    /**
     * removes a shape from the canvas
     *
     * @param shape the shape, that will be removed
     */
    public void removeShape(DrawableShape shape) {
        shapes.remove(shape);
        drawShapes();
    }

    /**
     * clear all shapes and reset canvas
     */
    public void clearShapes() {
        shapes.clear();
        GraphicsContext gc = getGraphicsContext2D();
        gc.clearRect(0, 0, getWidth(), getHeight());
    }

    /**
     * draw all shapes to the canvas
     */
    private void drawShapes() {
        GraphicsContext gc = getGraphicsContext2D();
        gc.clearRect(0, 0, getWidth(), getHeight());
        for (DrawableShape shape : shapes) {
            StrokeShape.strokeShape(gc, shape);
        }
    }

    /**
     * creates a file Chooser Dialog and then proceeds to save the canvas content in the given file
     *
     * @param primaryStage The stage the file chooser should belong to
     * @param canvas       The canvas to draw to the file
     * @param type         The image type - supported types: png
     */
    public static void saveImage(Stage primaryStage, Canvas canvas, String type){
        // create file chooser
        FileChooser saveFile = new FileChooser();
        saveFile.titleProperty().bind(I18N.createStringBinding("window.title.saveCanvasToPng"));
        // add an extension filter, that ensures that the file is a png
        FileChooser.ExtensionFilter extensionFilter = new FileChooser.ExtensionFilter("PNG Files", "*.png");
        saveFile.getExtensionFilters().add(extensionFilter);

        // show the dialog
        File file = saveFile.showSaveDialog(primaryStage);

        // Take a snapshot of the canvas
        SnapshotParameters params = new SnapshotParameters();
        params.setFill(Color.TRANSPARENT); // ensure transparency is preserved
        WritableImage snapshot = canvas.snapshot(params, null);

        // Find the dimensions of the content on the canvas
        double minX = Double.MAX_VALUE;
        double minY = Double.MAX_VALUE;
        double maxX = Double.MIN_VALUE;
        double maxY = Double.MIN_VALUE;
        for (double x = 0; x < canvas.getWidth(); x++) {
            for (double y = 0; y < canvas.getHeight(); y++) {
                Color color = Color.rgb(
                        (snapshot.getPixelReader().getArgb((int) x, (int) y) >> 16) & 0xFF,
                        (snapshot.getPixelReader().getArgb((int) x, (int) y) >> 8) & 0xFF,
                        (snapshot.getPixelReader().getArgb((int) x, (int) y)) & 0xFF,
                        (snapshot.getPixelReader().getArgb((int) x, (int) y) >> 24) & 1
                );
                if (color.equals(Color.TRANSPARENT)) {
                    continue; // skip transparent pixels
                }
                if (x < minX) {
                    minX = x;
                }
                if (y < minY) {
                    minY = y;
                }
                if (x > maxX) {
                    maxX = x;
                }
                if (y > maxY) {
                    maxY = y;
                }
            }
        }

        // Define the rectangular area to be cut out
        double x = minX - 20;    // x-coordinate of the rectangle
        double y = minY - 20;    // y-coordinate of the rectangle
        double w = maxX - minX + 40;    // width of the rectangle
        double h = maxY - minY + 40;    // height of the rectangle

        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (w > canvas.getWidth()) w = canvas.getWidth();
        if (h > canvas.getHeight()) h = canvas.getHeight();

        params = new SnapshotParameters();
        params.setFill(Color.TRANSPARENT);    // make transparent pixels non-opaque
        params.setViewport(new Rectangle2D(x, y, w, h));    // set the region to be captured
        snapshot = canvas.snapshot(params, null);

        // write canvas to the file
        try {
            ImageIO.write(SwingFXUtils.fromFXImage(snapshot, null), type, file);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
