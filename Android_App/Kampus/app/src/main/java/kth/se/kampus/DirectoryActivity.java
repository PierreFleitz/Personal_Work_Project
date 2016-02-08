package kth.se.kampus;

import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;

public class DirectoryActivity extends ActionBarActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_directory);

        //TODO change that shit
        String [] test = {"Le petit", "chapeau", "chappelle", "creme", "abba", "cristian", "Bob"};

        ArrayAdapter<String> adapter = new ArrayAdapter<>(this,
                android.R.layout.simple_dropdown_item_1line, test);
        AutoCompleteTextView textView = (AutoCompleteTextView)
                findViewById(R.id.edit_query);
        textView.setAdapter(adapter);
    }

}