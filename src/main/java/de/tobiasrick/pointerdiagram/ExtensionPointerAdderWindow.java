package de.tobiasrick.pointerdiagram;

import de.tobiasrick.pointerdiagram.canvas.AddToCanvas;
import de.tobiasrick.pointerdiagram.canvas.DrawableShape;
import de.tobiasrick.pointerdiagram.pointer.ExtensionPointer;
import javafx.collections.FXCollections;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.*;

public class ExtensionPointerAdderWindow {

    private static double x1;
    private static double y1;
    private static double x2;
    private static double y2;
    @FXML
    private TextField angleTextField;
    @FXML
    private Button choosePoint1Button;
    @FXML
    private Button choosePoint2Button;
    @FXML
    private Button choosePoint3Button;
    @FXML
    private ColorPicker colorPickerBox;
    @FXML
    private ToggleGroup inputMode;
    @FXML
    private TextField lengthTextField;
    @FXML
    private ToggleButton negativSenseOfRotationButton;
    @FXML
    private ComboBox<String> powersOfTenComboBox;
    @FXML
    private ComboBox<String> unitComboBox;
    @FXML
    private RadioButton firstMethodButton;

    public static void connectionButtonClickedContinue(double[] connectionPoint, boolean firstConnectionButton) {
        MainWindow.addPointerWindow.show();
        if (firstConnectionButton) {
            x1 = connectionPoint[0];
            y1 = connectionPoint[1];
        } else {
            x2 = connectionPoint[0];
            y2 = connectionPoint[1];
        }
    }

    public static void chooseConnectionPointCancelled() {
        MainWindow.addPointerWindow.show();
    }

    @FXML
    void initialize() {
        // add combobox items
        powersOfTenComboBox.getItems().removeAll(powersOfTenComboBox.getItems());
        powersOfTenComboBox.setItems(FXCollections.observableArrayList("", "d", "c", "m", "µ", "k", "n", "p", "f", "da", "h", "M", "G", "T", "P"));

        unitComboBox.getItems().removeAll(powersOfTenComboBox.getItems());
        unitComboBox.setItems(FXCollections.observableArrayList("Ω", "V", "A", "var", "VA", "W"));
    }

    @FXML
    void cancelButtonClicked(ActionEvent event) {
        MainWindow.addPointerWindow.close();
    }

    @FXML
    void okButtonClicked(ActionEvent event) {
        if (firstMethodButton.isSelected()){
            AddToCanvas.canvas.addShape(new DrawableShape(new ExtensionPointer(AddToCanvas.canvas.getGraphicsContext2D(), x1, y1, x2, y2, colorPickerBox.getValue(), colorPickerBox.getValue())));
        } else {
            double angleRad = Math.toRadians(Double.parseDouble(angleTextField.getText()));
            if (!negativSenseOfRotationButton.isSelected()) {
                angleRad *= -1; // reverse direction of rotation
            }

            double deltaX = Double.parseDouble(lengthTextField.getText()) * Math.cos(angleRad);
            double deltaY = Double.parseDouble(lengthTextField.getText()) * Math.sin(angleRad);

            x2 = x1 + deltaX;
            y2 = y1 + deltaY;

            AddToCanvas.canvas.addShape(new DrawableShape(new ExtensionPointer(AddToCanvas.canvas.getGraphicsContext2D(), x1, y1, x2, y2, colorPickerBox.getValue(), colorPickerBox.getValue())));
        }

        MainWindow.addPointerWindow.close();
    }

    @FXML
    void firstConnectionButtonClicked(ActionEvent event) {
        MainWindow.addPointerWindow.hide();
        AddToCanvas.chooseConnectionPoint(true);
    }

    @FXML
    void secondConnectionButtonClicked(ActionEvent event) {
        MainWindow.addPointerWindow.hide();
        AddToCanvas.chooseConnectionPoint(false);
    }

    @FXML
    void firstMethodButtonClicked(ActionEvent event) {
        choosePoint1Button.setDisable(false);
        choosePoint2Button.setDisable(false);
        choosePoint3Button.setDisable(true);
        angleTextField.setDisable(true);
        lengthTextField.setDisable(true);
        negativSenseOfRotationButton.setDisable(true);
        unitComboBox.setDisable(true);
        powersOfTenComboBox.setDisable(true);
    }

    @FXML
    void secondMethodButtonClicked(ActionEvent event) {
        choosePoint1Button.setDisable(true);
        choosePoint2Button.setDisable(true);
        choosePoint3Button.setDisable(false);
        angleTextField.setDisable(false);
        lengthTextField.setDisable(false);
        negativSenseOfRotationButton.setDisable(false);
        unitComboBox.setDisable(false);
        powersOfTenComboBox.setDisable(false);
    }
}
