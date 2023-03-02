package de.tobiasrick.pointerdiagram;

import javafx.collections.FXCollections;
import javafx.fxml.FXML;
import javafx.scene.control.ComboBox;

public class BasePointerAdder {

    @FXML
    private ComboBox<String> powersOfTenComboBox;

    @FXML
    private ComboBox<String> unitComboBox;


    @FXML
    void initialize() {
        // add combobox items

        powersOfTenComboBox.getItems().removeAll(powersOfTenComboBox.getItems());
        powersOfTenComboBox.setItems(FXCollections.observableArrayList("d", "c", "m", "µ", "n", "p", "f", "da", "h", "k", "M", "G", "T", "P"));

        unitComboBox.getItems().removeAll(powersOfTenComboBox.getItems());
        unitComboBox.setItems(FXCollections.observableArrayList("Ω", "V", "A", "var", "VA", "W"));
    }
}
