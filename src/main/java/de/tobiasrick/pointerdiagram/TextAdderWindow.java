package de.tobiasrick.pointerdiagram;

import de.tobiasrick.pointerdiagram.canvas.AddToCanvas;
import de.tobiasrick.pointerdiagram.canvas.PointerCanvas;
import de.tobiasrick.pointerdiagram.other.TextShape;
import javafx.collections.FXCollections;
import javafx.fxml.FXML;
import javafx.scene.control.ColorPicker;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TextField;
import javafx.scene.text.Font;

import java.io.IOException;

public class TextAdderWindow {

    @FXML
    private ComboBox<String> fontFamilyComboBox;

    @FXML
    private TextField textField;

    @FXML
    private TextField textSizeTextField;

    @FXML
    private ColorPicker colorPicker;

    @FXML
    void initialize() {
        fontFamilyComboBox.setItems(FXCollections.observableArrayList(Font.getFamilies()));
    }

    @FXML
    void cancelButtonClicked() {
        MainWindow.addWindow.close();
    }

    @FXML
    void okButtonClicked() {
        MainWindow.addWindow.close();
        AddToCanvas.addText(new TextShape(PointerCanvas.graphicsContext, textField.getText(), new Font(fontFamilyComboBox.getPromptText(), Double.parseDouble(textSizeTextField.getText())), colorPicker.getValue()));
    }

    @FXML
    void addDegreeButtonClicked() {
        textField.setText(textField.getText() + "°");
    }

    @FXML
    void addMicroButtonClicked() {
        textField.setText(textField.getText() + "µ");
    }

    @FXML
    void addOhmButtonClicked() {
        textField.setText(textField.getText() + "Ω");
    }

    @FXML
    void openMoreButtonClicked() {
        try {
            Runtime.getRuntime()
                    .exec("C:\\windows\\system32\\charmap.exe");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
