package de.tobiasrick.pointerdiagram;

import de.tobiasrick.pointerdiagram.canvas.AddToCanvas;
import de.tobiasrick.pointerdiagram.canvas.PointerCanvas;
import de.tobiasrick.pointerdiagram.pointer.BasePointer;
import javafx.collections.FXCollections;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.ColorPicker;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TextField;

public class BasePointerAdderWindow {

    @FXML
    private ColorPicker colorPickerBox;

    @FXML
    private TextField lengthTextField;

    @FXML
    private ComboBox<String> powersOfTenComboBox;

    @FXML
    private ComboBox<String> unitComboBox;



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
        AddToCanvas.addShape(new BasePointer(PointerCanvas.graphicsContext, Double.parseDouble(lengthTextField.getText()), colorPickerBox.getValue(), colorPickerBox.getValue()));
        MainWindow.addPointerWindow.close();
    }
}
